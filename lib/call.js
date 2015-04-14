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
  var req = options.request;

  if (!req) {
    req = options;
  }

  var request = {
    method: req.method || 'GET',
    path: req.path || '/',
    host: req.host || '127.0.0.1',
    port: req.port || 443,
    headers: req.headers || {},
    auth: req.auth
  };

  var opts = {
    proto: options.proto || req.proto || 'https',
    request: request,
    response: options.response
  };

  if (opts.proto === 'https' || opts.proto === 'http2') {
    request.pfx = req.pfx;
    request.key = req.key;
    request.passphrase = req.passphrase;
    request.cert = req.cert;
    request.ca = req.ca;
    request.ciphers = req.ciphers;
    request.rejectUnauthorized = req.rejectUnauthorized;
    request.secureProtocol = req.secureProtocol;
  }

  // apply plugin configuration
  var i, keys = Object.keys(this.rail.plugins);

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
