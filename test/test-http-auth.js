'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var crypto = require('crypto');
var common = require('./common');
var http = require('http');
var RAIL = require('../');


suite('http:auth', function() {
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

    rail.use('auth');

    server = http.createServer(listener);
    server.listen(common.port, done);
  });


  test('call', function(done) {
    onrequest = function(request, response) {
      assert(request.headers.hello);
      assert.strictEqual(request.headers.hello, 'World');

      var hash = crypto.createHash('sha1');

      request.pipe(hash, {
        end: false
      });

      request.on('end', function() {
        assert.strictEqual(request.headers.authorization, hash.digest('base64'));
        response.end('pong');
      });
    };

    var call = rail.call({
      proto: 'http',
      method: 'PUT',
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
  });


  suiteTeardown(function(done) {
    server.close(done);
  });
});
