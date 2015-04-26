'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var http = require('http');
var RAIL = require('../');


suite('http:validate:retry', function() {
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

    rail.use('validate', {
      schemas: [
        {
          id: 'headers',
          type: 'object',
          properties: {
            date: {
              type: 'string'
            }
          },
          allowUnknownProperties: true
        }
      ]
    });

    rail.use('retry', {
      validate: true,
      limit: 5,
      interval: 10
    });

    server = http.createServer(listener);
    server.listen(common.port, done);
  });


  test('failed (body)', function(done) {
    onrequest = function(request, response) {
      response.end(JSON.stringify({
        hello: 'world'
      }));
    };

    var retries = 0;

    rail.call({
      validate: {
        headers: 'headers',
        body: {
          id: 'simple-body',
          type: 'object',
          properties: {
            hello: {
              type: 'number'
            }
          }
        }
      }
    }, function(response) {
      assert.strictEqual(response.statusCode, 200);

      assert.strictEqual(retries, 5);

      assert(response.buffer);
      assert(response.json);
      assert(response.json.hello);
      assert.strictEqual(response.json.hello, 'world');

      assert(response.validate);
      assert.strictEqual(response.validate.headers, null);
      assert.deepEqual(response.validate.body,
          [['hello', 'number', 'type', 'world']]);

      done();
    }).on('retry', function(options, response, reason) {
      ++retries;
      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(reason, 'validate');
    }).end();
  });


  suiteTeardown(function(done) {
    server.close(done);
  });
});
