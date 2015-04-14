'use strict';


function buffer(rail, opt_options) {
  opt_options = opt_options || {};

  // on construction, right before configure()
  rail.on('plugin-call', function(call, options) {
    console.log('buffer::plugin-call');
  });

  // after configure()
  rail.on('plugin-configure', function(call, options) {
    console.log('buffer::plugin-configure');
  });

  // after request()
  rail.on('plugin-request', function(call, options, request) {
    console.log('buffer::plugin-request');
  });

  // on response
  rail.on('plugin-response', function(call, options, response) {
    console.log('buffer::plugin-response');
  });
}
module.exports = buffer;
