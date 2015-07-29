'use strict';



function BufferPlugin(rail, options) {
  if (!(this instanceof BufferPlugin)) {
    return new BufferPlugin(rail, options);
  }
  this._rail = rail;

  this.default = options.default || false;
  this.max = options.max || 134217728; // 128 MiB

  this._setup();
}
module.exports = BufferPlugin;


BufferPlugin.prototype._setup = function() {
  var self = this;

  this._rail.on('plugin-response', function(call, options, response) {
    // HEAD responses are buffered too, acting as stream terminator
    if (self.default && options.buffer !== false ||
        !self.default && options.buffer === true) {
      self.intercept(call, options, response);
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
  var self = this;
  var length = 0;
  var buffer = [];


  function onreadable() {
    var data = response.read();

    if (data) {
      length += data.length;
      buffer.push(data);

      // bailout
      // aka. stuffing everything back into the readable stream
      if (length > self.max) {
        call.emit('warn', 'buffer', 'bailout', 'max length exceeded');

        response.removeListener('readable', onreadable);
        response.removeListener('end', onend);

        do {
          response.unshift(buffer.pop());
        } while (buffer.length);

        /** ************** Note ***************
         * Once the stream.Readable was consumed and even though it was unshifted,
         * the following ReadableState states remain `true` after the unshift call:
         *
         * response._readableState.reading
         * response._readableState.calledRead
         * response._readableState.emittedReadable
         * response._readableState.readableListening
         *
         * Resetting `readableListening` will enable re-attaching listeners for:
         * - nodejs: v0.10.x, v0.12.x
         * - iojs: v2.5.x
         */
        response._readableState.readableListening = false;

        // indicator for stream consumer
        response.bailout = true;
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
