'use strict';
var util = require('util');
var events = require('events');
var Call = require('./call');
var plugins = require('./plugins');



/**
 * The RAIL aka. REST As In Lazy
 *
 * @param {?Object=} opt_options
 *
 * @constructor
 * @extends {events.EventEmitter}
 */
function RAIL(opt_options) {
  if (!(this instanceof RAIL)) {
    return new RAIL(opt_options);
  }
  events.EventEmitter.call(this);
  opt_options = opt_options || {};

  this.proto = opt_options.proto || 'https';

  var req = opt_options.request || {};

  this.defaults = {
    method: req.method || 'GET',
    path: req.path || '/',
    host: req.host || '127.0.0.1',
    port: req.port,
    headers: req.headers,
    auth: req.auth,
    agent: req.agent,
    keepAlive: req.keepAlive,
    keepAliveMsecs: req.keepAliveMsecs,

    // tls options
    ca: req.ca,
    pfx: req.pfx,
    key: req.key,
    cert: req.cert,
    ciphers: req.ciphers,
    passphrase: req.passphrase,
    servername: req.servername,
    secureProtocol: req.secureProtocol,
    rejectUnauthorized: req.rejectUnauthorized
  };

  this.plugins = {};

  // load plugins
  var i, keys = Object.keys(opt_options);

  for (i = 0; i < keys.length; ++i) {
    this.use(keys[i], opt_options[keys[i]]);
  }
}
util.inherits(RAIL, events.EventEmitter);
module.exports = RAIL;


RAIL.prototype.use = function(name, opt_plugin, opt_options) {
  if (this.plugins[name]) {
    return null;

  } else if (typeof opt_plugin !== 'function') {
    opt_options = opt_plugin;
    opt_plugin = plugins[name];
  }

  if (typeof opt_plugin !== 'function') {
    return false;
  }
  opt_options = opt_options || {};

  this.plugins[name] = opt_plugin(this, opt_options) || true;

  return this.plugins[name];
};


RAIL.prototype.call = function(opt_options, opt_responseListener) {
  if (typeof opt_options === 'function') {
    opt_responseListener = opt_options;
    opt_options = null;
  }
  var call = new Call(this, opt_options);

  if (opt_responseListener) {
    call.on('response', opt_responseListener);
  }

  return call;
};
