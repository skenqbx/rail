'use strict';
var RAIL = require('./rail');
var globalClient = new RAIL();

module.exports = exports = RAIL;

exports.Call = require('./call');
exports.ReplayBuffer = require('./replay-buffer');
exports.plugins = require('./plugins');

globalClient.use('buffer');
globalClient.use('json');
globalClient.use('redirect');
globalClient.use('cookies');

exports.globalClient = globalClient;


function call(urlOrOptions, responseListener) {
  return globalClient.call(urlOrOptions, responseListener);
}
exports.call = call;
