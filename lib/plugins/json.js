'use strict';


function jsonPlugin(rail, opt_options) {
  opt_options = opt_options || {};

  rail.use('buffer');

  var pluginOptions = {
    auto: opt_options.auto || false
  };


  function interceptResponse(call, options, response) {
    if (response.buffer) {
      try {
        response.json = JSON.parse(response.buffer);
      } catch (err) {
        call.emit('error', new Error('json: failed to parse buffer'));
      }
    }
    call.__emit('response', response);
  }


  rail.on('plugin-response', function(call, options, response) {
    if (options.json || pluginOptions.auto &&
        response.headers['content-type'] === 'application/json') {
      rail.plugins.buffer.intercept(call);
      call.__intercept('response', interceptResponse);
    }
  });

  return pluginOptions;
}
module.exports = jsonPlugin;
