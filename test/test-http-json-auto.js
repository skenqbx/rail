'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var http = require('http');
var RAIL = require('../');


suite('http:json-auto', function() {
  var rail, server;
  var onrequest;

  var listener = function(request, response) {
    if (typeof onrequest === 'function') {
      onrequest(request, response);
    }
  };

  var onrequestBuilder = function(contentType) {
    return function(request, response) {
      var body = JSON.stringify({
        hello: 'world'
      });

      response.writeHead(200, {
        'Content-Length': body.length,
        'content-type': contentType
      });
      response.end(body);
    };
  };


  suiteSetup(function(done) {
    rail = new RAIL({
      proto: 'http',
      request: {
        host: 'localhost',
        port: common.port
      },
      json: {
        auto: true
      }
    });

    server = http.createServer(listener);
    server.listen(common.port, done);
  });


  test('call application/json', function(done) {
    onrequest = onrequestBuilder('application/json');

    rail.call({
    }, function(response) {
      assert.strictEqual(response.statusCode, 200);

      assert(response.buffer);
      assert(response.json);
      assert(response.json.hello);
      assert.strictEqual(response.json.hello, 'world');

      done();
    }).end();
  });


  test('call application/json; charset=utf-8', function(done) {
    onrequest = onrequestBuilder('application/json; charset=utf-8');

    rail.call({
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
