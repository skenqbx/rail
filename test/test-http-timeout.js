'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var http = require('http');
var RAIL = require('../');


suite('http:timeout', function() {
  var rail, server;
  var onrequest;

  var listener = function(request, response) {
    if (typeof onrequest === 'function') {
      onrequest(request, response);
    }
  };


  suiteSetup(function(done) {
    rail = new RAIL();
    rail.use('timeout', {
      response: 20,
      socket: 20
    });

    server = http.createServer(listener);
    server.listen(common.port, done);
  });


  test('repsonse timeout', function(done) {
    onrequest = function(request, response) {
      response.end('pong');
    };

    var call = rail.call({
      proto: 'http',
      host: 'github.com',
      port: 55555,
      timeout: {
        socket: 0
      }
    }).on('timeout', function(type) {
      assert.strictEqual(type, 'response');
      call.abort();
    }).on('abort', done).end();
  });


  test('socket timeout', function(done) {
    onrequest = function(request, response) {
      response.end('pong');
    };

    var call = rail.call({
      proto: 'http',
      host: 'github.com',
      port: 55555,
      timeout: {
        response: 0
      }
    }).on('timeout', function(type) {
      assert.strictEqual(type, 'socket');
      call.abort();
    }).on('abort', done).end();
  });


  suiteTeardown(function(done) {
    server.close(done);
  });
});
