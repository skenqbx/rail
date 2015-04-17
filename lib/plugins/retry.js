'use strict';


function retryPlugin(rail, opt_options) {
  opt_options = opt_options || {};

  var pluginOptions = {
    interval: opt_options.interval || 2000,
    limit: opt_options.limit || 0
  };

  // TODO: on error: test different protocol

  rail.on('plugin-request', function(call, options, response) {
    if (options.retry) {

    }
  });

  return pluginOptions;
}
module.exports = retryPlugin;
