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
    rail = new RAIL({
      proto: 'http'
    });

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


  test('connect errors', function(done) {
    var retries = 0;
    var errors = 0;
    var ended = false;

    rail.call({
      port: 55555
    }).on('error', function(err) {
      assert(err);

      switch (++errors) {
        case 1:
          assert.strictEqual(err.message, 'Trying to write after end');
          break;
        case 2:
          assert(ended);
          assert.strictEqual(retries, 3);
          assert.strictEqual(err.code, 'ECONNREFUSED');
          done();
          break;
      }
    }).on('retry', function(options) {
      assert(options);
      assert(options.retry);
      ++retries;
    }).end('TEST', function() {
      ended = true;
    }).end('ERR');
  });


  suiteTeardown(function(done) {
    server.close(done);
  });
});
