'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var http = require('http');
var RAIL = require('../');


suite('http:validate', function() {
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

    server = http.createServer(listener);
    server.listen(common.port, done);
  });


  test('OK', function(done) {
    onrequest = function(request, response) {
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({
        hello: 'world'
      }));
    };

    rail.call({
      validate: {
        headers: 'headers',
        body: {
          id: 'simple-body',
          type: 'object',
          properties: {
            hello: 'world'
          }
        }
      }
    }, function(response) {
      assert.strictEqual(response.statusCode, 200);

      assert(response.buffer);
      assert(response.json);
      assert(response.json.hello);
      assert.strictEqual(response.json.hello, 'world');

      assert.strictEqual(response.validate, null);

      done();
    }).end();
  });


  test('failed (body)', function(done) {
    onrequest = function(request, response) {
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({
        hello: 'world'
      }));
    };

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

      assert(response.buffer);
      assert(response.json);
      assert(response.json.hello);
      assert.strictEqual(response.json.hello, 'world');

      assert(response.validate);
      assert.strictEqual(response.validate.headers, null);
      assert.deepEqual(response.validate.body,
          [['hello', 'number', 'type', 'world']]);

      done();
    }).end();
  });


  test('failed (headers)', function(done) {
    onrequest = function(request, response) {
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({
        hello: 'world'
      }));
    };

    rail.call({
      validate: {
        headers: {
          id: 'failing-headers',
          type: 'object',
          properties: {
            hello: {
              type: 'number'
            }
          },
          allowUnknownProperties: true
        }
      },
      buffer: true
    }, function(response) {
      assert.strictEqual(response.statusCode, 200);

      assert(response.buffer);

      assert(response.validate);
      assert.strictEqual(response.validate.body, null);
      assert.deepEqual(response.validate.headers,
          [[null, 'object', 'undefined', 'hello']]);

      done();
    }).end();
  });


  test('failed (no-body)', function(done) {
    onrequest = function(request, response) {
      response.setHeader('Content-Type', 'application/json');
      response.end();
    };

    rail.call({
      validate: {
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

      assert(response.validate);
      assert.strictEqual(response.validate.headers, null);
      assert.deepEqual(response.validate.body,
          [[null, 'object', 'undefined', null]]);

      done();
    }).end();
  });


  test('invalid schema #1', function(done) {
    onrequest = function(request, response) {
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({
        hello: 'world'
      }));
    };

    rail.call({
      validate: {
        body: 1234
      }
    }).on('error', function(err) {
      assert(err);
      assert.strictEqual(err.message, 'Invalid schema');
      done();
    }).end();
  });


  test('invalid schema #2', function(done) {
    onrequest = function(request, response) {
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({
        hello: 'world'
      }));
    };

    rail.call({
      validate: {
        body: {
          xyz: 1
        }
      }
    }).on('error', function(err) {
      assert(err);
      assert.strictEqual(err.message, 'Invalid schema id');
      done();
    }).end();
  });


  test('invalid schema #3', function(done) {
    onrequest = function(request, response) {
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({
        hello: 'world'
      }));
    };

    rail.call({
      validate: {
        body: {
          id: 'invalid-schema'
        }
      }
    }).on('error', function(err) {
      assert(err);
      assert.strictEqual(err.message, 'Invalid type definition');
      done();
    }).end();
  });


  suiteTeardown(function(done) {
    server.close(done);
  });
});
