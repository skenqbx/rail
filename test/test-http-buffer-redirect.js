'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var http = require('http');
var RAIL = require('../');


suite('http:buffer:redirect', function() {
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
        port: common.port,
        host: '127.0.0.1'
      }
    });
    rail.use('buffer', {default: true});
    rail.use('redirect', {
      allowUpgrade: false
    });

    server = http.createServer(listener);
    server.listen(common.port, '127.0.0.1', done);
  });


  test('relative', function(done) {
    var c = 0;
    var r = [
      {path: '/home/test', status: 302, location: '../other'},
      {path: '/home/other', status: 200}
    ];

    onrequest = function(request, response) {
      assert.strictEqual(request.url, r[c].path);

      if (r[c].location) {
        response.writeHead(r[c].status, {
          Location: r[c].location
        });
        response.end();
      } else {
        response.writeHead(r[c].status);
        response.end('works!');
      }
      ++c;
    };

    rail.call({
      path: r[c].path
    }, function(response) {
      assert.strictEqual(response.statusCode, 200);
      assert(response.buffer);
      assert.strictEqual(response.buffer.length, 6);
      assert.strictEqual(response.buffer.toString(), 'works!');
      done();
    }).on('warn', function(plugin, status, message) {
      console.log('warn', plugin, status, message);
    }).on('error', function(err) {
      console.log('TEST CALL ERROR', err.stack);
    }).end();
  });


  suiteTeardown(function(done) {
    server.close(done);
  });
});
