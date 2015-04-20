'use strict';
var parseURL = require('url').parse;
var path = require('path');


function redirect(rail, opt_options) {
  opt_options = opt_options || {};

  var pluginOptions = {
    limit: opt_options.limit || 1,
    codes: opt_options.codes || [301, 302, 308],
    sameHost: opt_options.sameHost || false,
    allowUpgrade: opt_options.allowUpgrade === false ? false : true,
    allowDowngrade: opt_options.allowDowngrade || false
  };


  function interceptRequest(call, options, request) {
    call.emit('redirect', options);
    // send the request made in `interceptResponse` below
    request.end();
  }


  function interceptResponse(call, options, response) {
    var p, config, url, proto1, proto2;
    var location = response.headers.location;

    if (!location) {
      return call.__emit('response', response);
    }

    // create a new request configuration on the stack
    p = location.indexOf('://');

    if (p > 0) {
      url = parseURL(location);
      proto1 = options.proto;
      proto2 = url.protocol.substr(0, url.protocol.length - 1);

      if (url.hostname !== options.request.host &&
          (options.redirect.sameHost === true ||
              pluginOptions.sameHost === true &&
              options.redirect.sameHost !== false)) {
        call.emit('warn', 'redirect', 'blocked', 'different host');
        return call.__emit('response', response);

      } else if (proto1 !== proto2) {

        if (proto2 === 'http' &&
            (options.redirect.allowDowngrade === false ||
                pluginOptions.allowDowngrade === false &&
                options.redirect.allowDowngrade !== true)) {
          call.emit('warn', 'redirect', 'blocked', 'protocol downgrade');
          return call.__emit('response', response);

        } else if (proto1 === 'http' &&
            (options.redirect.allowUpgrade === false ||
                pluginOptions.allowUpgrade === false &&
                options.redirect.allowUpgrade !== true)) {
          call.emit('warn', 'redirect', 'blocked', 'protocol upgrade');
          return call.__emit('response', response);
        }

        options.proto = proto2;
      }

      config = call.__configure(options);
      config.request.host = url.hostname;
      config.request.port = url.port; // TODO: vaildate port
      config.request.path = url.path;
      // XXX: revert options to original proto
      options.proto = proto1;

    } else {
      config = call.__configure(options);
      config.request.path = path.resolve(options.request.path, location);
    }

    function onEnd() {
      var req;

      call.__clear();
      req = call.__request();

      if (req && req !== true) {
        call.__intercept('request', interceptRequest);
      } else {
        call.emit('warn', 'redirect', 'failed', 'could not create request');
        call.__emit('response', response);
      }
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
  }


  // on response
  rail.on('plugin-response', function(call, options, response) {

    // check if request has been redirected
    if (options.request.method === 'GET' &&
        response.headers.location &&
        pluginOptions.codes.indexOf(response.statusCode) > -1) {

      options.redirect = options.redirect || {};

      // set initial redirect limit
      if (options.redirect.limit === undefined) {
        options.redirect.limit = pluginOptions.limit;
      }
      if (options.redirect.limit > 0) {
        --options.redirect.limit;
        // intercept to give other plugins a chance to do their work
        //   as we are going to kill the response in the intercept
        call.__intercept('response', interceptResponse);
      } else {
        call.emit('warn', 'redirect', 'blocked', 'limit reached');
      }
    }
  });

  return pluginOptions;
}
module.exports = redirect;
