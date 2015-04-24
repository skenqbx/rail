'use strict';
var util = require('util');
var stream = require('stream');
var assert = require('assert');
var parseURL = require('url').parse;
var ReplayBuffer = require('./replay-buffer');

var protocols = {
  http: require('http'),
  https: require('https'),
  // https://github.com/molnarg/node-http2/wiki/Public-API
  http2: require('http2')
};

var ports = {
  http: 80,
  https: 443,
  http2: 443
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

  // original client objects
  this.request = null;
  this.response = null;

  this.ended = false;
  this.aborted = false;     // call abort flag
  this._aborted = false;    // request abort flag (reset-able)
  this._destroyed = false;  // socket destroyed flag (reset-able)
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
  var i, keys, req;
  var defaults = this.rail.defaults;

  if (typeof options === 'string') {
    options = this._urlToOptions({}, options);
  } else if (typeof options.url === 'string') {
    options = this._urlToOptions(options, options.url);
  }

  req = options.request;

  if (!req) {
    req = options;
  }

  var request = {
    method: req.method || defaults.method,
    path: req.path || defaults.path,
    host: req.host || defaults.host,
    port: req.port || defaults.port,
    headers: {},
    auth: req.auth || defaults.auth,
    agent: req.agent !== undefined ? req.agent : defaults.agent,
    keepAlive: req.keepAlive || false,
    keepAliveMsecs: req.keepAliveMsecs || 1000
  };

  if (defaults.headers) {
    keys = Object.keys(defaults.headers);

    for (i = 0; i < keys.length; ++i) {
      request.headers[keys[i]] = defaults.headers[keys[i]];
    }
  }

  if (req.headers) {
    keys = Object.keys(req.headers);

    for (i = 0; i < keys.length; ++i) {
      request.headers[keys[i]] = req.headers[keys[i]];
    }
  }

  var opts = {
    proto: options.proto || req.proto || this.rail.proto,
    request: request
  };

  if (!request.port) {
    request.port = ports[opts.proto];
  }

  if (opts.proto === 'https' || opts.proto === 'http2') {
    request.ca = req.ca || defaults.ca;
    request.pfx = req.pfx || defaults.pfx;
    request.key = req.key || defaults.key;
    request.cert = req.cert || defaults.cert;
    request.ciphers = req.ciphers || defaults.ciphers;
    request.passphrase = req.passphrase || defaults.passphrase;
    request.servername = req.servername || defaults.servername;
    request.secureProtocol = req.secureProtocol || defaults.secureProtocol;
    request.rejectUnauthorized =
        req.rejectUnauthorized || defaults.rejectUnauthorized;
  }

  // apply plugin configuration
  keys = Object.keys(this.rail.plugins);

  for (i = 0; i < keys.length; ++i) {
    if (options[keys[i]]) {
      opts[keys[i]] = options[keys[i]];
    }
  }

  this.rail.emit('plugin-configure', this, opts);
  this._pointer = this._stack.push(opts) - 1;

  return opts;
};


Call.prototype.__buffer = function() {
  if (!this._buffer && !this.request) {
    this._buffer = new ReplayBuffer();
  }

  return this._buffer ? true : false;
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

  if (this._buffer) {
    this.rail.emit('plugin-send-buffer', this,
        this._stack[this._pointer], this._buffer);
  }

  request = protocols[options.proto].request(options.request);

  this.rail.emit('plugin-request', this, options, request);

  request.once('response', function(response) {
    self.response = response;
    self.rail.emit('plugin-response', self, options, response);

    response.once('end', function() {
      self.request = null;
      self.response = null;
    });

    self.__emit('response', response); // interceptable event
  });

  request.on('error', function(err) {
    if (self._aborted || self._destroyed) {
      err.reason = self._reason;
    }
    self.__emit('error', err);

    // TODO: clear when the actual error is emitted
    self.request = null;
    self.response = null;

    if (!self.response) {
      finish(err);
    }
  });

  this.request = request;

  function finish(err) {
    if (self.response) {
      return;
    }
    opt_callback(err, self.request);

    if (!err) {
      self.__emit('request', request); // interceptable event
    }
  }

  if (this._buffer) {
    this._buffer.out(request, finish);
  } else {
    process.nextTick(finish);
  }

  return request;
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
  this._destroyed = false;
  this._reason = '';

  this._interceptors = {};
};


Call.prototype.__abort = function(opt_reason) {
  if (this.request) {
    if (typeof this.request.abort === 'function' &&
        this.request.aborted === undefined) {

      this._aborted = true;
      this._reason = opt_reason || 'unknown';
      this.request.abort();

    } else if (this.request.socket &&
        typeof this.request.socket.destroy === 'function') {

      this._destroyed = true;
      this._reason = opt_reason || 'unknown';
      this.request.socket.destroy();
    }
    return true;
  }
  // TODO: handle http2
  return false;
};


Call.prototype.abort = function() {
  this.aborted = true;

  if (this._buffer) {
    this._buffer.dump();
    this._buffer = null;
  }

  this.__abort('user');
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

  this.__request(function(err2, request) {
    if (err2) {
      return opt_callback(err2);
    } else if (!request) {
      return opt_callback(new Error('Not connected'));
    }

    self._end(function() {
      if (self._buffer) {
        self._buffer.close();
      }
      request.end();
      opt_callback(err2);
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
      this.__request(function() {
        self._buffer.close();
        self._buffer.dump();
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


Call.prototype._urlToOptions = function(options, url) {
  var parsed = parseURL(url);

  options.proto = parsed.protocol.substr(0, parsed.protocol.length - 1);

  if (options.request) {
    options.request.host = parsed.hostname;
    options.request.port = parsed.port;
    options.request.path = parsed.path;
  } else {
    options.host = parsed.hostname;
    options.port = parsed.port ? parseInt(parsed.port, 10) : null;
    options.path = parsed.path;
  }

  return options;
};
