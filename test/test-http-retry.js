'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var http = require('http');
var RAIL = require('../');


suite('http:retry', function() {
  var rail, server;
  var onrequest;

  var listener = function(request, response) {
    if (typeof onrequest === 'function') {
      onrequest(request, response);
    }
  };


  suiteSetup(function(done) {
    rail = new RAIL();
    rail.use('retry', {
      limit: 3,
      interval: 20
    });

    server = http.createServer(listener);
    server.listen(common.port, done);
  });


  test('configure', function() {
    var options = {
      retry: {}
    };
    rail.plugins.retry._configure(options);
    assert.deepEqual(options, {retry: {interval: 20, limit: 3}});

    options = {
      retry: false
    };
    rail.plugins.retry._configure(options);
    assert.deepEqual(options, {retry: {limit: 0}});
  });


  test('call', function(done) {
    var retries = 0;

    rail.call({
      proto: 'http',
      port: 55555
    }).on('error', function(err) {
      assert(err);
      assert.strictEqual(retries, 3);
      assert.strictEqual(err.code, 'ECONNREFUSED');
      done();
    }).on('retry', function(options) {
      assert(options);
      assert(options.retry);
      ++retries;
    }).end();
  });


  suiteTeardown(function(done) {
    server.close(done);
  });
});
