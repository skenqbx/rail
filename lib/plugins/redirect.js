'use strict';


function redirect(rail, opt_options) {
  opt_options = opt_options || {};

  // on construction, right before configure()
  rail.on('plugin-call', function(call, options) {
    console.log('redirect::plugin-call');
  });

  // after configure()
  rail.on('plugin-configure', function(call, options) {
    console.log('redirect::plugin-configure');
  });

  // after request()
  rail.on('plugin-request', function(call, options, request) {
    console.log('redirect::plugin-request');
  });

  // on response
  rail.on('plugin-response', function(call, options, response) {
    console.log('redirect::plugin-response');
  });
}
module.exports = redirect;
