'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var http = require('http');
var RAIL = require('../');


suite('http:buffer', function() {
  var rail, server;
  var onrequest;

  var listener = function(request, response) {
    if (typeof onrequest === 'function') {
      onrequest(request, response);
    }
  };


  suiteSetup(function(done) {
    rail = new RAIL({
      buffer: {
        default: true,
        max: 10
      }
    });

    server = http.createServer(listener);
    server.listen(common.port, done);
  });


  test('call', function(done) {
    onrequest = function(request, response) {
      response.end('pong');
    };

    rail.call({
      proto: 'http',
      port: common.port
    }, function(response) {
      assert.strictEqual(response.statusCode, 200);

      assert(response.buffer);
      assert.strictEqual(response.buffer.length, 4);
      assert.strictEqual(response.buffer.toString(), 'pong');

      done();
    }).end();
  });


  test('call w/ buffer exceeding given max size', function(done) {
    var warningEmitted = false;
    onrequest = function(request, response) {
      response.end('pongpongpong');
    };

    var call = rail.call({
      proto: 'http',
      port: common.port
    }, function(response) {
      assert(!response.buffer);
      assert(response.bailout);
      assert(response instanceof http.IncomingMessage);
      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(warningEmitted, true);

      var data = [];
      response.on('readable', function() {
        data.push(response.read());
      });

      response.on('end', function() {
        var data_ = Buffer.concat(data);
        assert.strictEqual(data_.length, 12);
        assert.strictEqual(data_.toString(), 'pongpongpong');
        done();
      });
    }).end();


    call.on('warn', function(plugin, type, message) {
      if (plugin === 'buffer' && type === 'bailout' && message === 'max length exceeded') {
        warningEmitted = true;
      }
    });

    call.end();
  });


  test('call w/ buffer=false (request)', function(done) {
    onrequest = function(request, response) {
      response.end('pong');
    };

    rail.call({
      proto: 'http',
      port: common.port,
      buffer: false
    }, function(response) {
      assert.strictEqual(response.statusCode, 200);

      assert(!response.buffer);
      assert(response instanceof http.IncomingMessage);

      var data = [];
      response.on('readable', function() {
        data.push(response.read());
      });

      response.on('end', function() {
        var data_ = Buffer.concat(data);
        assert.strictEqual(data_.length, 4);
        assert.strictEqual(data_.toString(), 'pong');
        done();
      });

    }).end();
  });


  suiteTeardown(function(done) {
    server.close(done);
  });
});
