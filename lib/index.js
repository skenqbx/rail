'use strict';
var RAIL = require('./rail');
var globalClient = new RAIL();

module.exports = exports = RAIL;

exports.Call = require('./call');
exports.Configuration = require('./configuration');
exports.RequestOptions = require('./request-options');
exports.ReplayBuffer = require('./replay-buffer');
exports.plugins = require('./plugins');
exports.tools = require('./tools');

globalClient.use('buffer');
globalClient.use('json');
globalClient.use('redirect');
globalClient.use('cookies');
globalClient.use('timeout');
globalClient.use('validate');
globalClient.use('retry');

exports.globalClient = globalClient;


function call(urlOrOptions, responseListener) {
  return globalClient.call(urlOrOptions, responseListener);
}
exports.call = call;
