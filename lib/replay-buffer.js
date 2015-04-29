'use strict';
var util = require('util');
var events = require('events');



/**
 * ReplayBuffer
 *
 * Buffers chunks of data &
 *   replays them on as many writable stream as needed
 *
 * @param {?number} opt_max
 *
 * @constructor
 * @extends {events.EventEmitter}
 */
function ReplayBuffer(opt_max) {
  events.EventEmitter.call(this);

  this.max = opt_max || 134217728; // 128 MiB

  // status flags
  this.ended = false;
  this.buffer = true;
  this.bailout = false;

  this.pipes = [];
  this.chunks = [];
  this.length = 0;
}
util.inherits(ReplayBuffer, events.EventEmitter);
module.exports = ReplayBuffer;


ReplayBuffer.prototype.push = function(chunk) {
  var i;

  if (this.ended) {
    throw new Error('Trying to push after end');
  }

  if (this.buffer) {
    this.chunks.push(chunk);
    this.length += chunk.length;

    if (this.length > this.max) {
      this.bailout = true;
    }
  }

  if (this.pipes.length > 0) {
    for (i = 0; i < this.pipes.length; ++i) {
      this.pipes[i].write(chunk);
    }
  }

  return !this.bailout;
};


ReplayBuffer.prototype.pipe = function(writable, opt_callback) {
  var self = this;
  var idx = this.pipes.indexOf(writable);

  opt_callback = opt_callback || function() {};

  if (idx === -1) {
    if (this.chunks.length === 0) {
      self.pipes.push(writable);
      self.emit('pipe', writable);
      setImmediate(opt_callback);

    } else {
      this.replay(writable, function() {
        self.pipes.push(writable);
        self.emit('pipe', writable);
        opt_callback();
      });
    }
    return true;
  } else {
    setImmediate(opt_callback);
  }
  return false;
};


ReplayBuffer.prototype.unpipe = function(writable) {
  var idx = this.pipes.indexOf(writable);

  if (idx > -1) {
    this.pipes.splice(idx, 1);
    this.emit('unpipe', writable);
  }
};


/**
 * Writes all buffered chunks onto a writable stream
 */
ReplayBuffer.prototype.replay = function(writable, callback) {
  var chunks = this.chunks;
  var offset = 0;
  var n = chunks.length;

  if (n === 0) {
    return setImmediate(callback);
  }

  // async variation of _duff's device_
  //   https://en.wikipedia.org/wiki/Duff%27s_device
  (function write() {
    var mod = 0;
    var more;

    n = chunks.length - offset;

    if (n === 0) {
      return callback();
    }

    if (n < 4) {
      mod = n % 4;
    }

    switch (mod) {
      case 0:
        writable.write(chunks[offset++]); /* falls through */
      case 3:
        writable.write(chunks[offset++]); /* falls through */
      case 2:
        writable.write(chunks[offset++]); /* falls through */
      case 1:
        more = writable.write(chunks[offset++]);
    }

    if (more) {
      return setImmediate(write);
    }

    writable.once('drain', write);
  })(/* auto-exec */);
};


ReplayBuffer.prototype.dump = function() {
  this.buffer = false;
  this.chunks = [];
  this.length = 0;
};


ReplayBuffer.prototype.end = function() {
  this.ended = true;
  this.emit('end');
};
