'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var http = require('http');
var RAIL = require('../');


suite('http:json', function() {
  var rail, server;
  var onrequest;

  var listener = function(request, response) {
    if (typeof onrequest === 'function') {
      onrequest(request, response);
    }
  };


  suiteSetup(function(done) {
    rail = new RAIL({
      proto: 'http',
      request: {
        port: common.port
      }
    });
    rail.use('json');

    server = http.createServer(listener);
    server.listen(common.port, done);
  });


  test('call', function(done) {
    onrequest = function(request, response) {
      response.end(JSON.stringify({
        hello: 'world'
      }));
    };

    rail.call({
      json: true
    }, function(response) {
      assert.strictEqual(response.statusCode, 200);

      assert(response.buffer);
      assert(response.json);
      assert(response.json.hello);
      assert.strictEqual(response.json.hello, 'world');

      done();
    }).end();
  });


  suiteTeardown(function(done) {
    server.close(done);
  });
});
