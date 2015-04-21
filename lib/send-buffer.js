'use strict';
var util = require('util');
var events = require('events');



/**
 * SendBuffer
 * Buffers & replays the request body
 *
 * @param {?Object=} opt_options
 *
 * @constructor
 */
function SendBuffer(opt_options) {
  opt_options = opt_options || {};

  this.max = opt_options.max || 134217728; // 128 MiB

  this.chunks = [];
  this.encodings = [];
  this.length = 0; // number of chunk bytes

  this.closed = false;
}
module.exports = SendBuffer;


SendBuffer.prototype.push = function(chunk, encoding) {
  if (this.closed) {
    return false;
  }
  this.chunks.push(chunk);
  this.length += chunk.length;
  this.encodings.push(encoding);

  if (this.length > this.max) {
    return false;
  }

  return true;
};


SendBuffer.prototype.replay = function(writable, callback) {
  var self = this;
  var i = 0;

  if (!this.chunks.length) {
    return setImmediate(function() {
      callback();
    });
  }


  // async variation of _duff's device_
  //   https://en.wikipedia.org/wiki/Duff%27s_device
  (function next() {
    var mod = 0;

    if (self.chunks.length < 4) {
      mod = (self.chunks.length - i) % 4;
    }
    // TODO: write callback!

    switch (mod) {
      case 0:
        writable.write(self.chunks[i], self.encodings[i++]); /* falls through */
      case 3:
        writable.write(self.chunks[i], self.encodings[i++]); /* falls through */
      case 2:
        writable.write(self.chunks[i], self.encodings[i++]); /* falls through */
      case 1:
        writable.write(self.chunks[i], self.encodings[i++]); /* falls through */
    }

    if (self.chunks[i]) {
      setImmediate(next);
    } else {
      setImmediate(callback);
    }
  })(/* auto-exec */);
};
