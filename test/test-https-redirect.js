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
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    rail = new RAIL({
      proto: 'https',
      request: {
        port: common.port
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
