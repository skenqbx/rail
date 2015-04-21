'use strict';



function BufferPlugin(rail, opt_options) {
  if (!(this instanceof BufferPlugin)) {
    return new BufferPlugin(rail, opt_options);
  }
  opt_options = opt_options || {};

  this._rail = rail;

  this.default = opt_options.default || false;
  this.max = opt_options.max || 134217728; // 128 MiB

  this._setup();
}
module.exports = BufferPlugin;


BufferPlugin.prototype._setup = function() {
  var self = this;


  this._rail.on('plugin-response', function(call, options, response) {
    // HEAD responses are buffered too, acting as stream terminator
    if (self.default || options.buffer && options.buffer !== false) {
      self.intercept(call);
    }
  });


  this._intercept = function(call, options, response) {
    self._interceptResponse(call, options, response);
  };
};


BufferPlugin.prototype.intercept = function(call) {
  call.__intercept('response', this._intercept);
};


BufferPlugin.prototype._interceptResponse = function(call, options, response) {
  var length = 0;
  var buffer = [];


  function onreadable() {
    var data = response.read();

    if (data) {
      length += data.length;
      buffer.push(data);

      // bailout
      //   aka. stuffing everything back into the readable stream
      if (length > this.max) {
        call.emit('warn', 'buffer', 'bailout', 'max length exceeded');

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
    if (buffer.length) {
      response.buffer = Buffer.concat(buffer);
    } else {
      response.buffer = null;
    }
    call.__emit('response', response);
  }

  response.on('readable', onreadable);
  response.once('end', onend);
};
