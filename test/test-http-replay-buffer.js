'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var http = require('http');
var RAIL = require('../');


suite('http:replay-buffer', function() {
  var rail, server;
  var onrequest;

  var listener = function(request, response) {
    if (typeof onrequest === 'function') {
      onrequest(request, response);
    }
  };


  suiteSetup(function(done) {
    rail = new RAIL();

    server = http.createServer(listener);
    server.listen(common.port, done);
  });


  test('call', function(done) {
    onrequest = function(request, response) {
      var body = [];

      request.on('readable', function() {
        var data = request.read();

        if (data) {
          body.push(data);
        }
      });

      request.once('end', function() {
        body = Buffer.concat(body);
        assert.strictEqual(body.toString(), 'abcdefg');
        response.end('pong');
      });
    };

    var replayBuffer;

    rail.once('plugin-replay-buffer', function(call_, options, buffer) {
      replayBuffer = buffer;
    });

    var call = rail.call({
      proto: 'http',
      port: common.port,
      method: 'POST'
    }, function(response) {
      assert.strictEqual(response.statusCode, 200);
      var body = [];

      response.on('readable', function() {
        var data = response.read();

        if (data) {
          body.push(data);
        }
      });

      response.on('end', function() {
        body = Buffer.concat(body);
        assert.strictEqual(body.length, 4);
        assert.strictEqual(body.toString(), 'pong');

        assert(replayBuffer);
        assert.strictEqual(
            Buffer.concat(replayBuffer.chunks).toString(), 'abcdefg');
        done();
      });
    });

    call.__buffer();

    call.write('a');
    call.write('b');
    call.write('c');
    call.write('d');
    call.write('e');
    call.write('f');
    call.end('g');
  });


  test('abort', function() {
    onrequest = function(request, response) {
    };

    var call = rail.call({
      proto: 'http',
      port: common.port,
      method: 'POST'
    });

    call.__buffer();

    call.write('a');
    call.write('b');
    call.write('c');
    call.abort();
    assert(call._buffer === null);
  });


  suiteTeardown(function(done) {
    server.close(done);
  });
});
