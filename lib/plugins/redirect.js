'use strict';


function redirect(rail, opt_options) {
  opt_options = opt_options || {};


  function onResponse(call, options, response) {
    call.__emit('response', response);
  }


  // after configure()
  rail.on('plugin-configure', function(call, options) {
  });


  // on response
  rail.on('plugin-response', function(call, options, response) {
    call.__intercept('response', onResponse);
  });
}
module.exports = redirect;
