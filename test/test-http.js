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
      buffer: {
        default: true
      },
      request: {
        headers: {
          'Hello': 'World'
        }
      }
    });
    rail.use('cookies');
    rail.use('redirect');

    server = http.createServer(listener);
    server.listen(57647, done);
  });


  test('call', function(done) {
    onrequest = function(request, response) {
      assert(request.headers.hello);
      assert.strictEqual(request.headers.hello, 'World');
      response.writeHead(200, {
        'set-cookie': 'name=value; Path=/; Secure'
      });
      response.end('pong');
    };

    rail.call({
      proto: 'http',
      port: 57647
    }, function(response) {
      assert(response.cookies);
      assert(response.cookies.name);
      assert.strictEqual(response.cookies.name.name, 'name');
      assert.strictEqual(response.cookies.name.value, 'value');
      assert.strictEqual(response.cookies.name.path, '/');
      assert.strictEqual(response.cookies.name.secure, true);

      response.on('readable', function() {
        response.read();
      });
      response.on('end', function() {
        assert.strictEqual(response.statusCode, 200);
        done();
      });
    }).end('ping');
  });


  suiteTeardown(function(done) {
    server.close(done);
  });
});
