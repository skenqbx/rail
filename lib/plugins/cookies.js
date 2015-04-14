'use strict';


function cookies(rail, opt_options) {
  opt_options = opt_options || {};

  // on construction, right before configure()
  rail.on('plugin-call', function(call, options) {
    console.log('cookies::plugin-call');
  });

  // after configure()
  rail.on('plugin-configure', function(call, options) {
    console.log('cookies::plugin-configure');
  });

  // after request()
  rail.on('plugin-request', function(call, options, request) {
    console.log('cookies::plugin-request');
  });

  // on response
  rail.on('plugin-response', function(call, options, response) {
    console.log('cookies::plugin-response');
  });
}
module.exports = cookies;
