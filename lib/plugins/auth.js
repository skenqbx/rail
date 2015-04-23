'use strict';



function AuthPlugin(rail, options) {
  if (!(this instanceof AuthPlugin)) {
    return new AuthPlugin(rail, options);
  }
  this._rail = rail;
  this._intercept = null;

  this._setup();
}
module.exports = AuthPlugin;


AuthPlugin.prototype._setup = function() {
  var self = this;
  var rail = this._rail;

  // rail.on('plugin-configure', function(call, options) {
  //
  // });
};
