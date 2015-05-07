'use strict';
/* global suite: false, setup: false, test: false,
     teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var RAIL = require('../');


suite('solar', function() {
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
});
