'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var http = require('http');
var https = require('https');
var RAIL = require('../');


suite('http:redirect', function() {
  var rail, server, SSLServer;
  var onrequest, onSSLRequest;

  var listener = function(request, response) {
    if (typeof onrequest === 'function') {
      onrequest(request, response);
    }
  };

  var SSLListener = function(request, response) {
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
    rail.use('redirect', {
      allowUpgrade: false
    });
    rail.use('buffer', {default: true});

    server = http.createServer(listener);
    server.listen(common.port, '127.0.0.1', function(err) {
      if (err) {
        return done(err);
      }

      SSLServer = https.createServer({
        key: common.serverKey,
        cert: common.serverCert
      }, SSLListener);
      SSLServer.listen(common.sslPort, '127.0.0.1', done);
    });
  });


  test('configure', function() {
    var options = {
      redirect: {}
    };
    rail.plugins.redirect._configure(options);
    assert.deepEqual(options,
        {redirect: {limit: 1, sameHost: false, allowDowngrade: false, allowUpgrade: false}});

    options = {
      redirect: false
    };
    rail.plugins.redirect._configure(options);
    assert.deepEqual(options, {redirect: {limit: 0}});
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
    }).end();
  });


  test('absolute', function(done) {
    var c = 0;
    var r = [
      {path: '/', status: 302, location: 'http://localhost:' + common.port + '/home/test'},
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
      assert(response.buffer);
      assert.strictEqual(response.buffer.length, 6);
      assert.strictEqual(response.buffer.toString(), 'works!');
      done();
    }).on('redirect', function(options, response) {
      assert.strictEqual(response.statusCode, 302);
    }).end();
  });


  test('absolute - no port', function(done) {
    var c = 0;
    var r = [
      {path: '/', status: 302, location: 'https://localhost/home/test'},
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
      path: '/',
      redirect: {
        allowUpgrade: true
      }
    }, function(response) {
      assert.strictEqual(response.statusCode, 200);
      assert(response.buffer);
      assert.strictEqual(response.buffer.length, 6);
      assert.strictEqual(response.buffer.toString(), 'works!');
      done();
    }).on('redirect', function(options, response) {
      assert.strictEqual(response.statusCode, 302);
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
      assert.strictEqual(response.buffer, null);
      done();
    }).end();
  });


  test('sameHost', function(done) {
    var warn;

    onrequest = function(request, response) {
      assert.strictEqual(request.url, '/');

      response.writeHead(302, {
        Location: 'http://localhost:' + common.port + '/home'
      });

      response.end();
    };

    rail.call({
      path: '/',
      redirect: {
        sameHost: true
      }
    }, function(response) {
      assert.strictEqual(response.statusCode, 302);
      assert.strictEqual(response.buffer, null);
      assert.deepEqual(['redirect', 'blocked', 'different host'], warn);
      done();
    }).on('warn', function(plugin, status, message) {
      warn = [plugin, status, message];
    }).end();
  });


  test('allowUpgrade=false', function(done) {
    var warn;

    onrequest = function(request, response) {
      assert.strictEqual(request.url, '/');

      response.writeHead(302, {
        Location: 'https://localhost:' + common.port + '/home'
      });

      response.end();
    };

    rail.call({
      path: '/',
      redirect: {
        allowUpgrade: false
      }
    }, function(response) {
      assert.strictEqual(response.statusCode, 302);
      assert.strictEqual(response.buffer, null);
      assert.deepEqual(['redirect', 'blocked', 'protocol upgrade'], warn);
      done();
    }).on('warn', function(plugin, status, message) {
      warn = [plugin, status, message];
    }).end();
  });


  suiteTeardown(function(done) {
    server.close(done);
  });
});
