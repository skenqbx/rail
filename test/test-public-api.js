'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var http = require('http');
var rail = require('../');


suite('public-api', function() {

  test('constructor', function() {
    rail();
    rail({});

    rail({
      proto: 'https',
      request: {
        cert: 'cert',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      buffer: {
        defaults: true
      }
    });
  });


  test('rail.use', function() {
    var client = rail();
    var buffer = client.use('buffer', rail.plugins.buffer);
    var validate = client.use('validate');

    assert(buffer);
    assert.strictEqual(typeof buffer._setup, 'function');

    assert(validate);
    assert.strictEqual(typeof validate._setup, 'function');
  });


  test('rail.call', function() {
    var client = rail();

    client.call();
    client.call({});
    client.call(null);
    client.call(null, function() {});
    client.call(function() {});
    client.call({
      headers: {
        Test: 'X1'
      }
    }, function() {});
  });


  test('call.abort() -> __request()', function() {
    var client = rail();
    var call = client.call();
    call.abort();
    var ret = call.__request();
    assert(ret === false);
  });


  test('call.__intercept "interceptor should be a function"', function() {
    var client = rail();
    var call = client.call();

    assert.throws(function() {
      call.__intercept('response');
    }, TypeError, 'interceptor should be a function');
  });


  test('call.__request "No configuration available"', function(done) {
    var client = rail();
    var call = client.call();

    call.on('error', function(err) {
      assert(err);
      assert(err.message, 'No configuration available');
      done();
    });

    ++call._pointer;
    call.__request();
  });
});
