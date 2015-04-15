'use strict';


function bufferPlugin(rail, opt_options) {
  opt_options = opt_options || {};

  var opts = {
    default: opt_options.default || false,
    max: opt_options.max || 134217728 // 128 MiB
  };


  function onResponse(call, options, response) {
    var length = 0;
    var buffer = [];


    function onreadable() {
      var data = response.read();

      if (data) {
        length += data.length;
        buffer.push(data);

        if (length > opts.max) { // bailout
          response.removeListener('readable', onreadable);
          response.removeListener('end', onend);

          do {
            response.unshift(buffer.pop());
          } while (buffer.length);

          call.__emit('response', response);
        }
      }
    }


    function onend() {
      response.body = Buffer.concat(buffer);

      call.__emit('response', response);
    }

    response.on('readable', onreadable);
    response.once('end', onend);
  }


  // on response
  rail.on('plugin-response', function(call, options, response) {
    if (opts.default || options.buffer && options.buffer !== false) {
      call.__intercept('response', onResponse);
    }
  });

  return opts;
}
module.exports = bufferPlugin;
