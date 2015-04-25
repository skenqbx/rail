'use strict';
var tools = require('./tools');

var requestOptions = [
  'method',
  'port',
  'host',
  'path',
  'auth',
  'agent',
  'keepAlive',
  'keepAliveMsecs',
  'ca',
  'pfx',
  'key',
  'cert',
  'ciphers',
  'passphrase',
  'servername',
  'secureProtocol',
  'rejectUnauthorized'
];



function RequestOptions(options, defaults) {
  // http
  this.method = 'GET';
  this.port = 0;
  this.host = 'localhost';
  this.path = '/';
  this.auth = null;
  this.agent = null;
  this.keepAlive = null;
  this.keepAliveMsecs = null;

  // https, http2
  this.ca = null;
  this.pfx = null;
  this.key = null;
  this.cert = null;
  this.ciphers = null;
  this.passphrase = null;
  this.servername = null;
  this.secureProtocol = null;
  this.rejectUnauthorized = null;

  // all
  this.headers = {};

  // apply options or defaults
  tools.copy(this, options, defaults, requestOptions);
  tools.copyHeaders(this.headers, options.headers, defaults.headers);
}
module.exports = RequestOptions;
