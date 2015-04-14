'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
var assert = require('assert');
var common = require('./common');
var RAIL = require('../');


suite('RAIL', function() {
  var rail;

  test('new RAIL', function() {
    rail = new RAIL();

    rail.use('auth');
    rail.use('buffer');
    rail.use('cache');
    rail.use('cookies');
    rail.use('json');
    rail.use('redirect');
    rail.use('retry');
    rail.use('validate');
  });

  // test('call', function() {
  //   var call = rail.call({
  //
  //   }, function(response) {
  //
  //   });
  //
  //   call.on('error', function(err) {
  //
  //   });
  // });
});
