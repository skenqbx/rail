'use strict';



function CachePlugin(rail, options) {
  if (!(this instanceof CachePlugin)) {
    return new CachePlugin(rail, options);
  }
  this._rail = rail;
  this._intercept = null;

  this._setup();
}
module.exports = CachePlugin;


CachePlugin.prototype._setup = function() {
  var self = this;
  var rail = this._rail;

  // rail.on('plugin-configure', function(call, options, request) {
  //
  // });
};
