'use strict';
var tools = require('./tools');
var RequestOptions = require('./request-options');

var ports = {
  http: 80,
  https: 443,
  http2: 443
};



function Configuration(call, options) {
  Object.defineProperty(this, 'call', {
    value: call
  });
  var defaults, i, keys;

  if (typeof options === 'string') {
    options = tools.parseURL(options);
  } else if (!options) {
    options = {};
  }

  if (call._pointer === -1) {
    defaults = call.rail.defaults;
    this.proto = options.proto || call.rail.proto;
  } else {
    defaults = call._stack[call._pointer].request;
    this.proto = options.proto || call._stack[call._pointer].proto;
  }

  if (typeof options.url === 'string') {
    this.proto = tools.applyURL(options.request || options, options.url);
  }

  this.request = new RequestOptions(options.request || options, defaults);

  if (!this.request.port) {
    this.request.port = ports[this.proto];
  }

  keys = Object.keys(call.rail.plugins);

  if (call._pointer > -1) {
    options = call._stack[call._pointer];
  }

  for (i = 0; i < keys.length; ++i) {
    this[keys[i]] = options[keys[i]] !== undefined ? options[keys[i]] : null;
  }
}
module.exports = Configuration;
