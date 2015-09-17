'use strict';
/* global suite: false, setup: false, test: false,
     teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var RAIL = require('../');


suite('issues', function() {
  var client;

  suiteSetup(function() {
    client = new RAIL({
      timeout: {
        response: 50
      }
    });
  });


  test('sockethangup', function(done) {
    var call = client.call({
      url: 'http://www.github.com:1234/',
      method: 'GET'
    });

    call.on('error', function(err) {
      done(err);
    });

    call.once('timeout', function(type) {
      assert.strictEqual(type, 'response');

      call.__abort();
      call.__configure();
      call.__request(function() {
        call.__abort();
        done();
      });
    });

    call.end();
  });


  test('ENOTFOUND', function(done) {
    var call = RAIL.call({
      url: 'http://www.does-not-exist-trust-me-seriously.com/',
      method: 'POST'
    });

    call.on('error', function(err) {
      assert.strictEqual(err.code, 'ENOTFOUND');
      done();
    });

    call.write('no way');
    call.end();
  });


  test('cb is not a function', function(done) {
    var call = RAIL.call({
      host: '127.0.0.1',
      port: 24945
    });

    call.on('error', function(err) {
      assert.strictEqual(err.code, 'ECONNREFUSED');
      setImmediate(done);
    });

    call.end('no way');
  });
});
