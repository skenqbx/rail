'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var https = require('https');
var RAIL = require('../');


suite('https:redirect', function() {
  var rail, server;
  var onrequest;

  var listener = function(request, response) {
    if (typeof onrequest === 'function') {
      onrequest(request, response);
    }
  };


  suiteSetup(function(done) {
    rail = new RAIL({
      proto: 'https',
      request: {
        port: common.port,
        rejectUnauthorized: false
      }
    });
    rail.use('redirect', {
      allowDowngrade: false
    });
    rail.use('buffer', {default: true});

    var options = {
      key: common.serverKey,
      cert: common.serverCert
    };
    server = https.createServer(options, listener);
    server.listen(common.port, done);
  });


  test('allowDowngrade=false', function(done) {
    var warn;

    onrequest = function(request, response) {
      assert.strictEqual(request.url, '/home/test');

      response.writeHead(302, {
        Location: 'http://localhost:' + common.port + '/home/other'
      });
      response.end();
    };

    rail.call({
      path: '/home/test'
    }, function(response) {
      assert.strictEqual(response.statusCode, 302);
      assert.deepEqual(warn, ['redirect', 'blocked', 'protocol downgrade']);
      done();
    }).on('warn', function(plugin, status, message) {
      warn = [plugin, status, message];
    }).end();
  });


  suiteTeardown(function(done) {
    server.close(done);
  });
});
