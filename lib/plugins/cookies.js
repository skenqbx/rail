'use strict';
var qs = require('querystring');


function cookiesPlugin(rail, opt_options) {
  opt_options = opt_options || {};

  var cookies = {
    jar: opt_options || {}
  };

  // after configure()
  rail.on('plugin-configure', function(call, options) {
    // TODO: send cookies to server (set Cookie header)
  });

  // on response
  rail.on('plugin-response', function(call, options, response) {
    parse(cookies.jar, response);
  });

  return cookies;
}
module.exports = cookiesPlugin;


function parse(jar, response) {
  var i, j, p;
  var tokens, cookie, domain;
  var cookies = response.headers['set-cookie'];

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

    jar[domain] = jar[domain] || {};
    jar[domain][cookie.name] = cookie;
    response.cookies[cookie.name] = cookie;
  }
}
