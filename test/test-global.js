'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var https = require('https');
var RAIL = require('../');


suite('global', function() {
  var server;
  var onrequest;

  var listener = function(request, response) {
    if (typeof onrequest === 'function') {
      onrequest(request, response);
    }
  };


  suiteSetup(function(done) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    var options = {
      key: common.serverKey,
      cert: common.serverCert
    };

    server = https.createServer(options, listener);
    server.listen(common.port, done);
  });


  test('call(url)', function(done) {
    var path = '/some/path/on/the/service';
    var url = 'https://localhost:' + common.port + path;

    onrequest = function(request, response) {
      assert.strictEqual(request.url, path);
      response.end('pong');
    };

    RAIL.call(url, function(response) {
      var body = [];

      response.on('readable', function() {
        var data = response.read();
        body.push(data);
      });

      response.on('end', function() {
        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(Buffer.concat(body).toString(), 'pong');
        done();
      });
    }).end();
  });


  test('call(options-with-url)', function(done) {
    var path = '/some/other/path/on/the/service';
    var url = 'https://localhost:' + common.port + path;

    onrequest = function(request, response) {
      assert.strictEqual(request.url, path);
      response.end('pong');
    };

    RAIL.call({
      url: url,
      buffer: true
    }, function(response) {
      assert.strictEqual(response.statusCode, 200);
      assert(response.buffer);
      assert.strictEqual(response.buffer.toString(), 'pong');
      done();
    }).end();
  });


  suiteTeardown(function(done) {
    delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;

    server.close(done);
  });
});
