'use strict';
var util = require('util');
var stream = require('stream');
var Configuration = require('./configuration');
var ReplayBuffer = require('./replay-buffer');

var protocols = {
  http: require('http'),
  https: require('https'),
  // https://github.com/molnarg/node-http2/wiki/Public-API
  http2: require('http2')
};



/**
 * Call
 * Manages a series of requests
 *
 * @param {RAIL} rail
 * @param {?(Object|string)=} opt_options
 *
 * @constructor
 * @extends {stream.Writable}
 */
function Call(rail, opt_options) {
  stream.Writable.call(this);
  opt_options = opt_options || {};

  this.rail = rail;

  this.maxReplayBuffer =
      opt_options.maxReplayBuffer || rail.maxReplayBuffer;

  // original client objects
  this.request = null;
  this.response = null;

  this.ended = false;
  this.aborted = false;     // call abort flag
  this._aborted = false;    // request abort flag (reset-able)
  this._reason = '';

  // stack of request configurations
  this._stack = [];
  this._pointer = -1;

  // event interceptors
  this._interceptors = {};

  // first plugin event
  rail.emit('plugin-call', this, opt_options);

  // request body buffer
  this._buffer = null;

  // configure the first request
  this.__configure(opt_options);
}
util.inherits(Call, stream.Writable);
module.exports = Call;


/**
 * @param {Object|string} options
 *
 * @return {Object}
 */
Call.prototype.__configure = function(options) {
  var configuration = new Configuration(this, options);

  this._pointer = this._stack.push(configuration) - 1;
  this.rail.emit('plugin-configure', this, configuration);

  return configuration;
};


Call.prototype.__buffer = function() {
  if (!this._buffer && !this.request) {
    this._buffer = new ReplayBuffer(this.maxReplayBuffer);

    this.rail.emit('plugin-replay-buffer', this,
        this._stack[this._pointer], this._buffer);
  }

  return this._buffer;
};


Call.prototype.__request = function(opt_callback) {
  var self = this;
  var request, err;
  var options = this._stack[this._pointer];

  opt_callback = opt_callback || function() {};

  if (this.aborted) {
    setImmediate(opt_callback);
    return false;

  } else if (this.request) {
    setImmediate(opt_callback, null, this.request);
    return true;

  } else if (!options) {
    err = new Error('No configuration available');
    this.emit('error', err);
    return setImmediate(opt_callback, err);
  }
  request = protocols[options.proto].request(options.request);
  this.rail.emit('plugin-request', this, options, request);

  request.once('response', function(response) {
    self._onResponse(options, response);
  });

  request.on('error', function(err2) {
    if (self._aborted) {
      return; // ignore errors after a request has been aborted, see call.__abort()
    }
    self.__emit('error', err2);

    self.request = null;
    self.response = null;

    if (!self.response) {
      finish(err2);
    }
  });

  this.request = request;

  function finish(err3) {
    if (self.response) {
      return;
    }
    opt_callback(err3, self.request);
    if (!err3) {
      self.__emit('request', request); // interceptable event
    }
  }

  if (this._buffer) {
    this._buffer.pipe(request, finish);
  } else {
    process.nextTick(finish);
  }

  return request;
};


Call.prototype._onResponse = function(options, response) {
  var self = this;

  this.response = response;
  this.rail.emit('plugin-response', this, options, response);

  response.once('end', function() {
    self.request = null;
    self.response = null;
  });

  this.__emit('response', response); // interceptable event
};


Call.prototype.__emit = function(event, object) {
  var listener;

  if (this._interceptors[event] && this._interceptors[event].length) {
    listener = this._interceptors[event].shift();
    listener(this, this._stack[this._pointer], object);
  } else {
    this.emit(event, object);
  }
};


Call.prototype.__intercept = function(event, interceptor) {
  if (typeof interceptor !== 'function') {
    throw new TypeError('interceptor should be a function');
  }
  this._interceptors[event] = this._interceptors[event] || [];

  if (this._interceptors[event].indexOf(interceptor) === -1) {
    this._interceptors[event].push(interceptor);
  }
};


Call.prototype.__clear = function() {
  this._aborted = false;
  this._reason = '';
  this._interceptors = {};
};


Call.prototype.__abort = function() {
  // request.abort()
  //   - node.js 0.10 emits error event
  //   - node.js 0.12 silently aborts
  //   - io.js 1.x emits abort event
  var self = this;

  if (this.request) {
    if (typeof this.request.abort === 'function' &&
        this.request.aborted === undefined) {

      this._aborted = true;
      this.request.abort();
      self.__clear();

      setImmediate(function() {
        self.rail.emit('plugin-abort', self, self._stack[self._pointer]);

        if (self.aborted) {
          self.emit('abort');
        }
      });
    }
    return true;
  }
  // TODO: handle http2
  return false;
};


Call.prototype.abort = function() {
  if (!this.aborted) {
    this.aborted = true;
    this.__abort(true);

    if (this._buffer) {
      this._buffer.end();
      this._buffer.dump();
      this._buffer = null;
    }
  }
};


/**
 * @return {Call} this
 */
Call.prototype._end = Call.prototype.end;
Call.prototype.end = function(chunk, encoding, opt_callback) {
  var self = this;
  var err;

  if (typeof encoding === 'function') {
    opt_callback = encoding;
    encoding = null;
  } else if (!encoding) {
    encoding = null;
  }

  opt_callback = opt_callback || function() {};

  if (this.ended) {
    err = new Error('Trying to write after end');
    if (chunk) {
      this.emit('error', err);
    }
    setImmediate(opt_callback, err);
    return this;
  }

  this.ended = true;

  if (chunk) {
    this.write(chunk, encoding);
  }
  if (this._buffer) {
    this._buffer.end();
  }

  this.__request(function(err2, request) {
    if (err2) {
      return opt_callback(err2);
    } else if (!request) {
      return opt_callback(new Error('Not connected'));
    }
    self._end(function() {
      if (self._buffer) {
        self._buffer.unpipe(request);
      }
      request.end();
      opt_callback();
    });
  });

  return this;
};


Call.prototype._write = function(chunk, encoding, callback) {
  var self = this;

  if (this._buffer) {
    this._buffer.push(chunk, encoding);

    if (this._buffer.bailout) {
      // the max buffer size is reached, bailout
      this.__request(function(err_, request) {
        self._buffer.end();
        self._buffer.dump();

        if (request) {
          self._buffer.unpipe(request);
        }
        self._buffer = null;

        callback();
      });
    } else {
      callback(); // ZALGO!
    }

  } else if (this.request) {
    this.request.write(chunk, encoding, callback);

  } else {
    this.__request(function(err, request) {
      if (err) {
        return callback(err);
      } else if (!request) {
        callback(new Error('Not connected'));
      }
      request.write(chunk, encoding);
      callback();
    });
  }
};
