'use strict';
var util = require('util');
var stream = require('stream');

var protocols = {
  http: require('http'),
  https: require('https'),
  // https://github.com/molnarg/node-http2/wiki/Public-API
  http2: require('http2')
};



/**
 * An API Call
 *
 * @param {RAIL} rail
 * @param {?Object=} opt_options
 *
 * @constructor
 * @extends {stream.Writable}
 */
function Call(rail, opt_options) {
  stream.Writable.call(this);
  opt_options = opt_options || {};

  this.rail = rail;

  this.request = null;
  this.response = null;

  this.ended = false;

  // stack of request configurations
  this._stack = [];
  this._pointer = -1;

  // event interceptors
  this._interceptors = {};

  // first plugin event
  this.rail.emit('plugin-call', this, opt_options);

  // configure the first request
  this.__configure(opt_options);
}
util.inherits(Call, stream.Writable);
module.exports = Call;


/**
 * @return {Object}
 */
Call.prototype.__configure = function(options) {
  var i, keys;
  var req = options.request;
  var defaults = this.rail.defaults;

  if (!req) {
    req = options;
  }

  var request = {
    method: req.method || defaults.method,
    path: req.path || defaults.path,
    host: req.host || defaults.host,
    port: req.port || defaults.port,
    headers: {},
    auth: req.auth || defaults.auth
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
    request: request,
    response: options.response
  };

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


Call.prototype.__request = function() {
  var self = this;
  var request;
  var options = this._stack[this._pointer];

  if (this.request) {
    return true;
  } else if (!options) {
    return this.emit('error', new Error('No options available'));
  } else if (!protocols[options.proto]) {
    return this.emit('error',
        new Error('Unknown protocol "' + options.proto + '"'));
  }
  request = protocols[options.proto].request(options.request);

  this.rail.emit('plugin-request', this, options, request);

  request.once('response', function(response) {
    self.rail.emit('plugin-response', self, options, response);

    response.once('end', function() {
      self.request = null;
      self.response = null;
    });

    self.__emit('response', response); // interceptable event
  });

  request.on('error', function(err) {
    self.__emit('error', err);

    self.request = null;
    self.response = null;
  });

  // TODO: timeout handling

  this.request = request;

  process.nextTick(function() {
    self.__emit('request', request); // interceptable event
  });

  return request;
};


Call.prototype._write = function(chunk, encoding, callback) {
  if (this.__request()) {
    // TODO: allow intercepting outgoing body
    this.request.write(chunk, encoding, callback);
  } else {
    callback(new Error('Not connected')); // ZALGO!
  }
};


Call.prototype._end = Call.prototype.end;


Call.prototype.end = function(chunk, encoding, callback) {
  var self = this;

  if (typeof encoding === 'function') {
    callback = encoding;
    encoding = null;
  } else if (!encoding) {
    encoding = null;
  }

  if (this.ended) {
    if (callback) {
      setImmediate(callback, new Error('Trying to write after end'));
    } else {
      this.emit('error', new Error('Trying to write after end'));
    }
    return;
  }

  this.ended = true;

  if (this.__request()) {
    this._end(chunk, encoding, function(err) {
      self.request.end();

      if (callback) {
        return callback(err);
      }
      if (err) {
        self.emit('error', err);
      }
    });
  } else if (callback) {
    setImmediate(callback, new Error('Not connected'));
  } else {
    this.emit('error', new Error('Not connected'));
  }
};


/**
 * Interceptable Events
 */
Call.prototype.__emit = function(event, object) {
  var listener;

  if (this._interceptors[event] && this._interceptors[event].length) {
    listener = this._interceptors[event].shift();
    listener(this, this._stack[this._pointer], object);
  } else {
    this.emit(event, object);
  }
};


Call.prototype.__intercept = function(event, listener) {
  this._interceptors[event] = this._interceptors[event] || [];

  if (this._interceptors[event].indexOf(listener) === -1) {
    this._interceptors[event].push(listener);
  }
};


Call.prototype.__clear = function() {
  this._interceptors = {};
};
