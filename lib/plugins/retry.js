'use strict';


function retry(rail, opt_options) {
  opt_options = opt_options || {};

  // TODO: on error: test different protocol

  // on construction, right before configure()
  rail.on('plugin-call', function(call, options) {
    console.log('retry::plugin-call');
  });

  // after configure()
  rail.on('plugin-configure', function(call, options) {
    console.log('retry::plugin-configure');
  });

  // after request()
  rail.on('plugin-request', function(call, options, request) {
    console.log('retry::plugin-request');
  });

  // on response
  rail.on('plugin-response', function(call, options, response) {
    console.log('retry::plugin-response');
  });
}
module.exports = retry;
