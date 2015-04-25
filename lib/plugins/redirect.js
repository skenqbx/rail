'use strict';
var parseURL = require('url').parse;
var path = require('path');
var tools = require('../tools');



function RedirectPlugin(rail, options) {
  if (!(this instanceof RedirectPlugin)) {
    return new RedirectPlugin(rail, options);
  }
  this._rail = rail;

  this._interceptrequest = null;
  this._interceptresponse = null;

  this.limit = options.limit || 1;
  this.codes = options.codes || [301, 302, 308];
  this.sameHost = options.sameHost || false;
  this.allowUpgrade = options.allowUpgrade === false ? false : true;
  this.allowDowngrade = options.allowDowngrade || false;

  this._setup();
}
module.exports = RedirectPlugin;


RedirectPlugin.prototype._setup = function() {
  var self = this;
  var rail = this._rail;

  rail.on('plugin-configure', function(call, options) {
    self._configure(options);
  });

  rail.on('plugin-response', function(call, options, response) {
    // check if request has been redirected
    if (options.request.method === 'GET' &&
        response.headers.location &&
        self.codes.indexOf(response.statusCode) > -1) {

      options.redirect = options.redirect || {};

      if (options.redirect.limit > 0) {
        --options.redirect.limit;
        // intercept to give other plugins a chance to do their work
        //   as we are going to kill the response in the intercept
        call.__intercept('response', self._interceptresponse);
      } else {
        call.emit('warn', 'redirect', 'blocked', 'limit reached');
      }
    }
  });

  this._interceptrequest = function(call, options, request) {
    // blackhole
  };

  this._interceptresponse = function(call, options, response) {
    self._interceptResponse(call, options, response);
  };
};


RedirectPlugin.prototype._interceptResponse = function(call, options, response) {
  var self = this;
  var p, url;
  var location = response.headers.location;

  if (!location) {
    return call.__emit('response', response);
  }
  // create a new request configuration on the stack
  p = location.indexOf('://');

  if (p > 0) {
    url = tools.parseURL(location);

    if (url.host !== options.request.host &&
        options.redirect.sameHost === true) {
      call.emit('warn', 'redirect', 'blocked', 'different host');
      return call.__emit('response', response);

    } else if (options.proto !== url.proto) {

      if (url.proto === 'http' &&
          options.redirect.allowDowngrade === false) {
        call.emit('warn', 'redirect', 'blocked', 'protocol downgrade');
        return call.__emit('response', response);

      } else if (options.proto === 'http' &&
          options.redirect.allowUpgrade === false) {
        call.emit('warn', 'redirect', 'blocked', 'protocol upgrade');
        return call.__emit('response', response);
      }
    }

    call.__configure({
      proto: url.proto,
      host: url.host,
      port: url.port,
      path: url.path
    });

  } else {
    call.__configure({
      path: path.resolve(options.request.path, location)
    });
  }

  function onEnd() {
    call.__clear();
    call.__request(function(err2, request) {
      if (request) {
        call.__intercept('request', self._interceptrequest);
        request.end();
        call.emit('redirect', options);
      } else {
        call.__emit('response', response);
      }
    });
  }

  // check if buffer plugin already handled the response body
  if (response.buffer !== undefined) {
    onEnd();

  } else {
    // dump obsolete response
    response.on('readable', function() {
      // TODO: check & warn (a redirect shouldn't have a body)
      response.read();
    });

    // send next request
    response.once('end', onEnd);
  }
};


RedirectPlugin.prototype._configure = function(options) {
  if (options.redirect) {
    if (options.redirect.limit === undefined) {
      options.redirect.limit = this.limit;
    }
    if (options.redirect.sameHost === undefined) {
      options.redirect.sameHost = this.sameHost;
    }
    if (options.redirect.allowDowngrade === undefined) {
      options.redirect.allowDowngrade = this.allowDowngrade;
    }
    if (options.redirect.allowUpgrade === undefined) {
      options.redirect.allowUpgrade = this.allowUpgrade;
    }

  } else if (options.redirect === false) {
    options.redirect = {
      limit: 0
    };

  } else {
    options.redirect = {
      limit: this.limit,
      sameHost: this.sameHost,
      allowDowngrade: this.allowDowngrade,
      allowUpgrade: this.allowUpgrade
    };
  }
};
