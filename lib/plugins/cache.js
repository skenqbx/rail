'use strict';


function cache(rail, opt_options) {
  opt_options = opt_options || {};

  rail.use('buffer');
  rail.plugins.buffer.default = true;

  // on construction, right before configure()
  rail.on('plugin-call', function(call, options) {
    console.log('cache::plugin-call');
  });

  // after configure()
  rail.on('plugin-configure', function(call, options) {
    console.log('cache::plugin-configure');
  });

  // after request()
  rail.on('plugin-request', function(call, options, request) {
    console.log('cache::plugin-request');
  });

  // on response
  rail.on('plugin-response', function(call, options, response) {
    console.log('cache::plugin-response');
  });
}
module.exports = cache;
