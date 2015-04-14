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
 * @param {Object} options
 *
 * @constructor
 * @extends {stream.Writable}
 */
function Call(rail, options) {
  stream.Writable.call(this);

  this.rail = rail;

  this.request = null;
  this.response = null;

  // stack of request configurations
  this._stack = [];
  this._pointer = 0;

  // event interceptors
  this._interceptors = {};

  // first plugin event
  this.rail.emit('plugin-call', this, options);

  // configure the first request
  this.configure(options);
}
util.inherits(Call, stream.Writable);
module.exports = Call;


Call.prototype.configure = function(options) {
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
    headers: defaults.headers,
    auth: req.auth || defaults.auth
  };

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

  this.rail.emit('plugin-configure', opts);

  this._stack.push(opts);
};


Call.prototype._request = function() {
  var self = this;
  var request, options = this._stack[this._pointer];

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

    // TODO: check if this does not interfer with buffering
    response.once('end', function() {
      self._reset();
    });

    self.__emit('response', response); // interceptable event
  });

  request.on('error', function(err) {
    self.__emit('error', err);
    self._reset();
  });

  this.request = request;
  this.__emit('request', request); // interceptable event

  return true;
};


Call.prototype._write = function(chunk, opt_encoding, callback) {
  if (this._request()) {
    this.request.write(chunk, opt_encoding, callback);
  } else {
    callback(new Error('Not connected')); // ZALGO!
  }
};


Call.prototype._reset = function() {
  this._interceptors = {};
  this.request = null;
  this.response = null;
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
  this._interceptors[event].push(listener);
};
