'use strict';
var util = require('util');
var events = require('events');
var protocols = {
  http: require('http'),
  https: require('https'),
  http2: require('http2')
};



/**
 * An API Call
 *
 * @param {RAIL} rail
 * @param {Object} options
 *
 * @constructor
 * @extends {events.EventEmitter}
 */
function Call(rail, options) {
  events.EventEmitter.call(this);

  this.rail = rail;

  this.request = null;
  this.response = null;

  // stack of request configurations
  this._stack = [];
  this._pointer = 0;

  this.rail.emit('plugin-call', this, options);

  this.configure(options);
}
util.inherits(Call, events.EventEmitter);
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

  this.rail.emit('plugin-configure', opts);

  this._stack.push(opts);
};


Call.prototype._request = function() {
  var self = this;
  var request, options = this._stack[this._pointer];

  if (!options) {
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
      self.request = null;
      self.response = null;
    });

    self.emit('response', response);
  });

  request.on('error', function(err) {
    self.emit('error', err);
    self.request = null;
    self.response = null;
  });

  this.request = request;
  this.emit('request', request);
};


Call.prototype.end = function(opt_data, opt_encoding) {
  if (this.request) {
    this.request.end(opt_data, opt_encoding);
  } else {
    this._request();
  }
};
