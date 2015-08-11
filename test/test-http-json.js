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


  test('call fail (no content-type:application/json )', function(done) {
    onrequest = function(request, response) {
      response.end(JSON.stringify({
        hello: 'world'
      }));
    };

    rail.call({
      json: true
    }, function(response) {
      assert.strictEqual(response.statusCode, 200);

      assert(!response.buffer);
      assert(!response.json);

      // we get the response
      var data_ = [];

      response.on('readable', function() {
        data_.push(new Buffer(response.read()).toString('utf8'));
      });

      response.on('end', function() {
        data_ = JSON.parse(Buffer.concat(data_));
        assert(data_.hello);
        assert.strictEqual(data_.hello, 'world');
        done();
      });
    }).end();
  });


  test('call', function(done) {
    onrequest = function(request, response) {
      response.setHeader('Content-Type', 'application/json');
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


  test('call w/ json: auto setup && json: false', function(done) {
    rail = new RAIL({
      proto: 'http',
      request: {
        port: common.port
      },
      json: {
        auto: true,
        max: 10485760
      },
      buffer: {
        default: true,
        max: 134217728
      }
    });


    onrequest = function(request, response) {
      response.setHeader('Content-type', 'application/json');
      response.end(JSON.stringify({
        hello: 'world'
      }));
    };

    rail.call({
      json: false
    }, function(response) {
      assert.strictEqual(response.statusCode, 200);

      assert(!response.buffer);
      assert(!response.json);
      var data_ = [];

      response.on('readable', function() {
        data_.push(new Buffer(response.read()).toString('utf8'));
      });

      response.on('end', function() {
        data_ = JSON.parse(Buffer.concat(data_));
        assert(data_.hello);
        assert.strictEqual(data_.hello, 'world');
        done();
      });

    }).end();
  });


  suiteTeardown(function(done) {
    server.close(done);
  });
});
