'use strict';
var parseURL = require('url').parse;
var path = require('path');


function redirect(rail, opt_options) {
  opt_options = opt_options || {};

  var pluginOptions = {
    limit: opt_options.limit || 1,
    codes: opt_options.codes || [301, 302, 308],
    allowUpgrade: opt_options.allowUpgrade === false ? false : true,
    allowDowngrade: opt_options.allowDowngrade || false,
    permanent: {}
  };

  // TODO: permanent redirects

  function interceptRequest(call, options, request) {
    // send the request made in `interceptResponse` below
    request.end();
  }


  function interceptResponse(call, options, response) {
    var p, config, url;
    var location = response.headers.location;

    if (!location) {
      return call.__emit('response', response);
    }

    p = location.indexOf('://');

    // create a new request configuration on the stack
    config = call.__configure(options);

    if (p > 0) {
      url = parseURL(location);

      // TODO: handle/allow proto switching

      config.request.host = url.hostname;
      config.request.port = url.port; // TODO: vaildate port
      config.request.path = url.path;

    } else {
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
      }
    }
  });

  return pluginOptions;
}
module.exports = redirect;
