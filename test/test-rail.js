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
