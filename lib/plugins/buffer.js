'use strict';


function buffer(rail, opt_options) {
  opt_options = opt_options || {};

  var opts = {
    default: opt_options.default || false
  };


  function onResponse(call, options, response) {
    call.__emit('response', response);
  }


  // on response
  rail.on('plugin-response', function(call, options, response) {
    if (opts.default || options.buffer && options.buffer !== false) {
      call.__intercept('response', onResponse);
    }
  });
}
module.exports = buffer;
