'use strict';
var util = require('util');
var stream = require('stream');



function Writable() {
  stream.Writable.call(this, {
    highWaterMark: 1
  });

  this.chunks = [];
  this.encodings = [];
}
util.inherits(Writable, stream.Writable);
module.exports = Writable;


Writable.prototype._write = function(chunk, encoding, callback) {
  this.chunks.push(chunk);
  this.encodings.push(encoding);
  callback();
};
