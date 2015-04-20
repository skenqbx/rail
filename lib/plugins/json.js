'use strict';


function jsonPlugin(rail, opt_options) {
  opt_options = opt_options || {};

  rail.use('buffer');

  var pluginOptions = {
    auto: opt_options.auto || false,
    max: opt_options.max || 1048576 // 1 MiB
  };


  function interceptResponse(call, options, response) {
    if (response.buffer) {
      if (response.buffer.length > pluginOptions.max) {
        call.emit('warn', 'json', 'blocked', 'max length exceeded');
      } else {
        try {
          response.json = JSON.parse(response.buffer);
        } catch (err) {
          call.emit('warn', 'json', 'failed', 'parse error');
        }
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
