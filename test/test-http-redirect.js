'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var http = require('http');
var RAIL = require('../');


suite('http:redirect', function() {
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
    rail.use('redirect');
    rail.use('buffer', {default: true});

    server = http.createServer(listener);
    server.listen(common.port, done);
  });


  test('relative', function(done) {
    var c = 0;
    var r = [
      {path: '/', status: 302, location: 'home/test'},
      {path: '/home/test', status: 200}
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
      path: '/'
    }, function(response) {
      assert.strictEqual(response.statusCode, 200);
      assert(response.body);
      assert.strictEqual(response.body.length, 6);
      assert.strictEqual(response.body.toString(), 'works!');
      done();
    }).on('error', function(err) {
      console.log('TEST CALL ERROR', err.stack);
    }).end();
  });


  test('limit=0', function(done) {
    onrequest = function(request, response) {
      assert.strictEqual(request.url, '/');

      response.writeHead(302, {
        Location: '/home'
      });
      response.end();
    };

    rail.call({
      path: '/',
      redirect: {
        limit: 0
      }
    }, function(response) {
      assert.strictEqual(response.statusCode, 302);
      assert(!response.body);
      done();
    }).on('error', function(err) {
      console.log('TEST CALL ERROR', err.stack);
    }).end();
  });


  suiteTeardown(function(done) {
    server.close(done);
  });
});
