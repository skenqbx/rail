'use strict';
var crypto = require('crypto');



function AuthPlugin(rail, options) {
  if (!(this instanceof AuthPlugin)) {
    return new AuthPlugin(rail, options);
  }
  this._rail = rail;

  this._setup();
}
module.exports = AuthPlugin;


AuthPlugin.prototype._setup = function() {
  var self = this;
  var rail = this._rail;

  rail.on('plugin-configure', function(call, options) {
    call.__buffer();
  });

  rail.on('plugin-replay-buffer', function(call, options, buffer) {
    var hash = crypto.createHash('sha1');

    buffer.pipe(hash);

    buffer.on('end', function() {
      buffer.unpipe(hash);
      options.request.headers.Authorization = hash.digest('base64');
    });
  });
};
