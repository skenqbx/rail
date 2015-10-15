'use strict';
var parse_url = require('url').parse;


function copyHeaders(target, source, defaults) {
  var i, keys;

  source = source || {};
  defaults = defaults || {};

  keys = Object.keys(source).concat(Object.keys(defaults));

  for (i = 0; i < keys.length; ++i) {
    if (source[keys[i]] !== undefined) {
      target[keys[i]] = source[keys[i]];
    } else if (defaults[keys[i]] !== undefined) {
      target[keys[i]] = defaults[keys[i]];
    }
  }
}
exports.copyHeaders = copyHeaders;


function copy(target, source, defaults, keys) {
  var i;

  source = source || {};

  for (i = 0; i < keys.length; ++i) {
    if (source[keys[i]] !== undefined) {
      target[keys[i]] = source[keys[i]];
    } else if (defaults[keys[i]] !== undefined) {
      target[keys[i]] = defaults[keys[i]];
    }
  }
}
exports.copy = copy;


function parseURL(url) {
  var parsed = parse_url(url);
  var proto = parsed.protocol.substr(0, parsed.protocol.length - 1);
  var port = parsed.port;

  if (port) {
    port = parseInt(port, 10);
  } else if (!port && proto === 'http') {
    port = 80;
  } else if (!port && proto === 'https') {
    port = 443;
  } else {
    port = undefined;
  }

  return {
    proto: proto,
    host: parsed.hostname,
    port: port,
    path: parsed.path
  };
}
exports.parseURL = parseURL;


function applyURL(target, url) {
  var parsed = parseURL(url);

  target.host = parsed.host;
  target.port = parsed.port;
  target.path = parsed.path;

  return parsed.proto;
}
exports.applyURL = applyURL;
