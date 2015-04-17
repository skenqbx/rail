'use strict';
var parseURL = require('url').parse;
var path = require('path');


function redirect(rail, opt_options) {
  opt_options = opt_options || {};

  var opts = {
    limit: opt_options.limit || 0,
    codes: opt_options.codes || [301, 302, 308]
  };


  function interceptRequest(call, options, request) {
    request.end();
  }


  function interceptResponse(call, options, response) {
    var p, config, url;
    var location = response.headers.location;

    if (!location) {
      return call.__emit('response', response);
    }

    p = location.indexOf('://');

    if (p > 0) {
      url = parseURL(p);

      config = call.configure(options);
      config.request.host = url.hostname;
      config.request.port = url.port; // TODO: vaildate port
      config.request.path = url.path;

    } else {
      config = call.configure(options);
      config.request.path = path.resolve(options.request.path, location);
    }

    // dump obsolete response
    response.on('readable', function() {
      response.read();
      // TODO: maybe: close the connection
    });

    // send next request
    response.once('end', function() {
      var req;

      call.__clear();
      req = call.__request();

      if (req && req !== true) {
        call.__intercept('request', interceptRequest);
      } else {
        console.log('redirect:interceptResponse:PANIC');
      }
    });
  }


  // on response
  rail.on('plugin-response', function(call, options, response) {
    if (options.request.method === 'GET' &&
        opts.codes.indexOf(response.statusCode) > -1) {
      // intercept to give other plugins a chance to do their work
      //   as we are going to kill the response in the intercept
      call.__intercept('response', interceptResponse);
    }
  });

  return opts;
}
module.exports = redirect;
