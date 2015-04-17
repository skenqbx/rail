'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var http = require('http');
var RAIL = require('../');


suite('http:buffer', function() {
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
      }
    });

    server = http.createServer(listener);
    server.listen(common.port, done);
  });


  test('call', function(done) {
    onrequest = function(request, response) {
      response.end('pong');
    };

    rail.call({
      proto: 'http',
      port: common.port
    }, function(response) {
      assert.strictEqual(response.statusCode, 200);

      assert(response.body);
      assert.strictEqual(response.body.length, 4);
      assert.strictEqual(response.body.toString(), 'pong');

      done();
    }).end();
  });


  suiteTeardown(function(done) {
    server.close(done);
  });
});
