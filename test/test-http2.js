'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var http2 = require('http2');
var RAIL = require('../');


suite('http2', function() {
  var rail, server;
  var onrequest;

  var listener = function(request, response) {
    if (typeof onrequest === 'function') {
      onrequest(request, response);
    }
  };


  test('server', function(done) {
    rail = new RAIL();

    var options = {
      key: common.serverKey,
      cert: common.serverCert
    };
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    server = http2.createServer(options, listener)
        .listen(57647, done);
  });


  test('call', function(done) {
    onrequest = function(request, response) {
      response.end('pong');
    };

    rail.call({
      proto: 'http2',
      port: 57647
    }, function(response) {
      assert.strictEqual(response.statusCode, 200);
      done();
    }).end('ping');
  });
});
