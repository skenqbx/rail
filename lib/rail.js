'use strict';
var util = require('util');
var events = require('events');
var Call = require('./call');
var plugins = require('./plugins');



/**
 * The RAIL aka. REST As In Lazy
 *
 * @param {?Object=} opt_options
 *
 * @constructor
 * @extends {events.EventEmitter}
 */
function RAIL(opt_options) {
  if (!(this instanceof RAIL)) {
    return new RAIL(opt_options);
  }
  events.EventEmitter.call(this);
  opt_options = opt_options || {};

  this.defaults = opt_options.defaults;
  this.plugins = {};
}
util.inherits(RAIL, events.EventEmitter);
module.exports = RAIL;


RAIL.prototype.use = function(name, opt_options) {
  if (this.plugins[name]) {
    return null;
  } else if (plugins[name]) {
    this.plugins[name] = plugins[name](this, opt_options) || true;
    return true;
  }
  return false;
};


RAIL.prototype.call = function(options, opt_responseListener) {
  var call = new Call(this, options);

  if (opt_responseListener) {
    call.on('response', opt_responseListener);
  }

  return call;
};
