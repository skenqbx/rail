'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var http = require('http');
var RAIL = require('../');


suite('http', function() {
  var rail, server;
  var onrequest;

  var listener = function(request, response) {
    if (typeof onrequest === 'function') {
      onrequest(request, response);
    }
  };


  suiteSetup(function(done) {
    rail = new RAIL({
      request: {
        headers: {
          'Hello': 'World'
        }
      }
    });

    server = http.createServer(listener);
    server.listen(common.port, done);
  });


  test('call', function(done) {
    onrequest = function(request, response) {
      assert(request.headers.hello);
      assert.strictEqual(request.headers.hello, 'World');
      response.end('pong');
    };

    var call = rail.call({
      proto: 'http',
      port: common.port
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
        done();
      });
    });

    call.write('start');

    setImmediate(function() {
      call.end('ping');
    });

    assert(call);
    assert.strictEqual(typeof call.end, 'function');
  });


  suiteTeardown(function(done) {
    server.close(done);
  });
});
