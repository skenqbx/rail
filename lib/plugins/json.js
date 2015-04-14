'use strict';


function json(rail, opt_options) {
  opt_options = opt_options || {};

  // on construction, right before configure()
  rail.on('plugin-call', function(call, options) {
    console.log('json::plugin-call');
  });

  // after configure()
  rail.on('plugin-configure', function(call, options) {
    console.log('json::plugin-configure');
  });

  // after request()
  rail.on('plugin-request', function(call, options, request) {
    console.log('json::plugin-request');
  });

  // on response
  rail.on('plugin-response', function(call, options, response) {
    console.log('json::plugin-response');
  });
}
module.exports = json;
