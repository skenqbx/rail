'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var https = require('https');
var RAIL = require('../');


suite('https', function() {
  var rail, server;
  var onrequest;

  var listener = function(request, response) {
    if (typeof onrequest === 'function') {
      onrequest(request, response);
    }
  };


  suiteSetup(function(done) {
    rail = new RAIL();

    var options = {
      key: common.serverKey,
      cert: common.serverCert,
      rejectUnauthorized: false
    };

    server = https.createServer(options, listener);
    server.listen(57647, done);
  });


  test('call', function(done) {
    onrequest = function(request, response) {
      response.end('pong');
    };

    rail.call({
      proto: 'https',
      port: 57647,
      rejectUnauthorized: false
    }, function(response) {
      response.on('readable', function() {
        response.read();
      });
      response.on('end', function() {
        assert.strictEqual(response.statusCode, 200);
        done();
      });
    }).end('ping');
  });


  suiteTeardown(function(done) {
    server.close(done);
  });
});
