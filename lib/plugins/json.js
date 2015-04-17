'use strict';


function jsonPlugin(rail, opt_options) {
  opt_options = opt_options || {};

  rail.use('buffer');

  var pluginOptions = {

  };


  function interceptResponse(call, options, response) {
    if (response.body) {
      try {
        response.json = JSON.parse(response.body);
      } catch (err) {
        call.emit('error', new Error('json: failed to parse body'));
      }
    }
    call.__emit('response', response);
  }


  rail.on('plugin-request', function(call, options, request) {
    if (options.json) {
      options.buffer = true;
    }
  });


  rail.on('plugin-response', function(call, options, response) {
    if (options.json) {
      call.__intercept('response', interceptResponse);
    }
  });

  return pluginOptions;
}
module.exports = jsonPlugin;
