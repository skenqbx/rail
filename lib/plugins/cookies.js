'use strict';
var net = require('net');



function CookiesPlugin(rail, options) {
  if (!(this instanceof CookiesPlugin)) {
    return new CookiesPlugin(rail, options);
  }
  this._rail = rail;

  this.jar = options.jar || {};

  this._setup();
}
module.exports = CookiesPlugin;


CookiesPlugin.prototype._setup = function() {
  var self = this;
  var rail = this._rail;

  rail.on('plugin-configure', function(call, options) {
    if (options.cookies !== false) {
      self._setHeader(options);
    }
  });

  rail.on('plugin-response', function(call, options, response) {
    if (options.cookies !== false) {
      self._parseHeaders(options, response);
    }
  });
};


CookiesPlugin.prototype._parseHeaders = function(options, response) {
  var i, j, p;
  var tokens, cookie;
  var domain = options.request.host;
  var cookies = response.headers['set-cookie'];
  var jar = this.jar;

  if (!cookies) {
    return;
  }

  response.cookies = {};

  for (i = 0; i < cookies.length; ++i) {
    tokens = cookies[i].split(';');
    tokens[0] = tokens[0].trim();
    p = tokens[0].indexOf('=');

    cookie = {
      name: tokens[0].substr(0, p),
      value: tokens[0].substr(p + 1)
    };

    tokens.shift();

    for (j = 0; j < tokens.length; ++j) {
      tokens[j] = tokens[j].trim();
      p = tokens[j].indexOf('=');

      if (p > -1) {
        cookie[tokens[j].substr(0, p).toLowerCase()] = tokens[j].substr(p + 1);
      } else {
        cookie[tokens[j].toLowerCase()] = true;
      }
    }

    if (cookie.expires) {
      cookie.expires = (new Date(cookie.expires)).getTime();
    }

    jar[domain] = jar[domain] || {};
    jar[domain][cookie.name] = cookie;
    response.cookies[cookie.name] = cookie;
  }
};


CookiesPlugin.prototype._setHeader = function(options) {
  var domain = options.request.host;
  var cookies = [];
  var i, keys, tokens;
  var now = Date.now();
  var expired = 0;
  var jar = this.jar;

  if (net.isIP(domain) > 0) {
    tokens = [];
  } else {
    tokens = domain.split('.');
    domain = tokens.splice(tokens.length - 2, 2).join('.');
  }

  // TODO: handle secure flag

  while (jar[domain]) {
    keys = Object.keys(jar[domain]);

    for (i = 0; i < keys.length; ++i) {
      if (jar[domain][keys[i]].expires && jar[domain][keys[i]].expires < now) {
        delete jar[domain][keys[i]];
        ++expired;

        if (keys.length - expired === 0) {
          delete jar[domain];
        }
      } else {
        cookies.push(keys[i] + '=' + jar[domain][keys[i]].value);
      }
    }

    if (tokens.length <= 1) {
      break;
    }

    domain = tokens.splice(tokens.length - 1, 1)[0] + '.' + domain;
  }

  if (cookies.length > 0) {
    options.request.headers.Cookie = cookies.join('; ');
  }
};
