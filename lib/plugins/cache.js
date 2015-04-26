'use strict';
var lru = require('lru-cache');



function CachePlugin(rail, options) {
  if (!(this instanceof CachePlugin)) {
    return new CachePlugin(rail, options);
  }
  rail.use('buffer');

  this._rail = rail;
  this._intercept = null;

  this.methods = ['HEAD', 'GET', 'POST'];
  this.enablePOST = options.enablePOST || false;

  this.cache = lru({
    max: options.max || 134217728 // 128 MiB
  });

  this._setup();
}
module.exports = CachePlugin;


CachePlugin.prototype._setup = function() {
  var self = this;
  var rail = this._rail;

  rail.on('plugin-configure', function(call, options) {
    var data, key = self._key(options);

    if (key) {
      data = self.cache.get(key);

      if (data) {
        call.emit('cache', data);
      }
    }
  });

  rail.on('plugin-response', function(call, options, response) {
  });
};


CachePlugin.prototype._interceptResponse = function() {

};


CachePlugin.prototype._key = function(options) {

};
