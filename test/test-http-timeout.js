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
      response: 50
    });

    server = http.createServer(listener);
    server.listen(common.port, done);
  });


  test('call', function(done) {
    onrequest = function(request, response) {
      response.end('pong');
    };

    var call = rail.call({
      proto: 'http',
      host: 'github.com',
      port: 55555
    }).on('timeout', function(type) {
      call.abort();
    }).on('error', function(err) {
      assert(err);
      assert.strictEqual(err.reason, 'user');
      done();
    }).end();
  });


  suiteTeardown(function(done) {
    server.close(done);
  });
});
