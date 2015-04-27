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
    assert.deepEqual(options, {retry:
        {codes: [500, 501, 502, 503, 504], interval: 20, limit: 3, validate: false}});

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
    }).on('retry', function(options, response, reason) {
      assert(options.retry);
      assert.strictEqual(response, null);
      assert.strictEqual(reason, 'connect');
      ++retries;
    }).end('TEST', function() {
      ended = true;
    }).end('ERR');
  });


  test('codes', function(done) {
    onrequest = function(request, response) {
      response.writeHead(503);
      response.end();
    };

    var retries = 0;

    rail.call({
      port: common.port
    }, function(response) {
      assert.strictEqual(response.statusCode, 503);
      assert.strictEqual(retries, 3);

      response.on('readable', function() {
        response.read();
      });

      response.on('end', function() {
        done();
      });

    }).on('retry', function(options, response, reason) {
      assert(options.retry);
      assert.strictEqual(response.statusCode, 503);
      assert.strictEqual(reason, 'codes');
      ++retries;
    }).end();
  });

  suiteTeardown(function(done) {
    server.close(done);
  });
});
