'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var http = require('http');
var rail = require('../');


suite('public-api', function() {

  test('constructor', function() {
    rail();
    rail({});

    rail({
      proto: 'https',
      request: {
        cert: 'cert',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      buffer: {
        defaults: true
      }
    });
  });


  test('rail.call', function() {
    var client = rail();

    client.call();
    client.call({});
    client.call(null);
    client.call(null, function() {});
    client.call(function() {});
    client.call({
      headers: {
        Test: 'X1'
      }
    }, function() {});
  });
});
