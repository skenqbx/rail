'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var http = require('http');
var RAIL = require('../');


suite('http:https:redirect', function() {
  var rail, httpServer;
  var onHTTPrequest;

  function httpListener(request, response) {
    if (typeof onHTTPrequest === 'function') {
      onHTTPrequest(request, response);
    }
  }


  suiteSetup(function(done) {
    rail = new RAIL({
      proto: 'http',
      request: {
        port: common.port,
        rejectUnauthorized: false
      }
    });

    rail.use('redirect');
    rail.use('buffer', {default: true});

    httpServer = http.createServer(httpListener);
    httpServer.listen(common.port, done);
  });


  test('upgrade http to https', function(done) {
    onHTTPrequest = function(request, response) {
      assert.strictEqual(request.url, '/home/test');

      response.writeHead(302, {
        Location: 'https://duckduckgo.com/'
      });

      response.end();
    };

    rail.call({
      path: '/home/test'
    }, function(response) {
      assert.strictEqual(response.statusCode, 200);
      done();
    }).on('redirect', function(options) {
      assert.strictEqual(options.request.port, 443);
    }).end();
  });


  suiteTeardown(function(done) {
    httpServer.close(done);
  });
});
