'use strict';



/**
 * ReplayBuffer
 * Buffers a readable stream &
 *   replays chunks on as many writable stream as needed
 *
 * @param {?number} opt_max
 *
 * @constructor
 */
function ReplayBuffer(opt_max) {
  this.max = opt_max || 134217728; // 128 MiB

  this.chunks = [];
  this.encodings = [];
  this.length = 0; // number of chunk bytes

  // status flags
  this.closed = false;
  this.bailout = false;

  // @type {stream.Writable}
  this._writable = null;
}
module.exports = ReplayBuffer;


ReplayBuffer.prototype.out = function(writable, opt_callback) {
  var self = this;

  if (!this._writable) {
    this.replay(writable, function() {
      self._writable = writable;

      if (opt_callback) {
        opt_callback();
      }
    });
    return true;
  }
  return false;
};


ReplayBuffer.prototype.push = function(chunk, opt_encoding) {
  if (this.closed) {
    return false;
  }

  if (this._writable) {
    this._writable.write(chunk, opt_encoding);
  }

  this.chunks.push(chunk);
  this.length += chunk.length;
  this.encodings.push(opt_encoding);

  if (this.bailout) {
    return false;

  } else if (this.length >= this.max) {
    this.bailout = true;

    // dump the buffer when there is a writable stream getting the data anyway
    if (this._writable) {
      this.dump();
    }
    return false;
  }

  return true;
};


ReplayBuffer.prototype.replay = function(writable, callback) {
  var chunks = this.chunks;
  var encodings = this.encodings;
  var offset = 0;
  var n = chunks.length;

  if (!n) {
    return setImmediate(callback);
  }

  // async variation of _duff's device_
  //   https://en.wikipedia.org/wiki/Duff%27s_device
  setImmediate(write);

  function write() {
    var mod = 0;
    var more;

    if (n < 4) {
      mod = n % 4;
    }

    switch (mod) {
      case 0:
        writable.write(chunks[offset], encodings[offset++]); /* falls through */
      case 3:
        writable.write(chunks[offset], encodings[offset++]); /* falls through */
      case 2:
        writable.write(chunks[offset], encodings[offset++]); /* falls through */
      case 1:
        more = writable.write(chunks[offset], encodings[offset++]);
    }

    n = chunks.length - offset;

    if (n === 0) {
      return callback();
    } else if (more) {
      return setImmediate(write);
    }

    writable.once('drain', write);
  }
};


ReplayBuffer.prototype.dump = function() {
  this.chunks = [];
  this.encodings = [];
  this.length = 0;
};


ReplayBuffer.prototype.close = function() {
  this.closed = true;
  this._writable = null;
};
