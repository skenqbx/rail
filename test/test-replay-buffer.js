'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var crypto = require('crypto');
var common = require('./common');
var RAIL = require('../');


suite('replay-buffer', function() {


  test('push', function() {
    var buffer = new RAIL.ReplayBuffer();

    assert.strictEqual(buffer.length, 0);
    assert.strictEqual(buffer.chunks.length, 0);

    var more = buffer.push(new Buffer('123'));
    assert(more);
    assert.strictEqual(buffer.length, 3);
    assert.strictEqual(buffer.chunks.length, 1);
  });


  test('push - bailout', function() {
    var buffer = new RAIL.ReplayBuffer(5);
    var more;

    more = buffer.push(new Buffer('123'));
    assert(more);
    assert.strictEqual(buffer.length, 3);
    assert.strictEqual(buffer.chunks.length, 1);
    assert.strictEqual(buffer.chunks[0].length, 3);

    more = buffer.push(new Buffer('456'));
    assert(!more);
    assert.strictEqual(buffer.length, 6);
    assert.strictEqual(buffer.chunks.length, 2);

    more = buffer.push(new Buffer('789'));
    assert(!more);
    assert.strictEqual(buffer.length, 9);
    assert.strictEqual(buffer.chunks.length, 3);
  });


  test('push - bailout - writable', function(done) {
    var buffer = new RAIL.ReplayBuffer(2055);
    var writable = new common.Writable();

    buffer.push(crypto.randomBytes(256));
    buffer.push(crypto.randomBytes(256));
    buffer.push(crypto.randomBytes(256));
    buffer.push(crypto.randomBytes(256));

    buffer.push(crypto.randomBytes(256));
    buffer.push(crypto.randomBytes(256));
    buffer.push(crypto.randomBytes(256));
    buffer.push(crypto.randomBytes(256));

    assert.strictEqual(buffer.length, 2048);

    buffer.pipe(writable, function() {
      var more;

      assert.strictEqual(writable.chunks.length, 8);
      assert.strictEqual(writable.chunks[0].length, 256);

      more = buffer.push(new Buffer('456'));
      assert(more);
      more = buffer.push(new Buffer('789'));
      assert(more);
      more = buffer.push(new Buffer('0ab'));
      assert(!more);

      assert(buffer.bailout);

      buffer.dump();

      assert.strictEqual(buffer.length, 0);
      assert.strictEqual(buffer.chunks.length, 0);

      done();
    });
  });


  test('push - end', function() {
    var buffer = new RAIL.ReplayBuffer();

    buffer.end();
    assert.throws(function() {
      buffer.push(new Buffer('123'));
    });
  });
});
