'use strict';



function RetryPlugin(rail, options) {
  if (!(this instanceof RetryPlugin)) {
    return new RetryPlugin(rail, options);
  }
  rail.use('timeout');

  this._rail = rail;

  this._intercepterror = null;
  this._interceptrequest = null;

  this.interval = options.interval || 2000;
  this.limit = options.limit || 0;

  this._setup();
}
module.exports = RetryPlugin;


RetryPlugin.prototype._setup = function() {
  var self = this;
  var rail = this._rail;

  rail.on('plugin-configure', function(call, options) {
    if (options.retry) {
      if (!call.__buffer()) {
        return call.emit('warn', 'retry', 'error', 'failed to enable send-buffer');
      }
      call.__intercept('error', self._intercepterror);
    }
  });

  this._intercepterror = function(call, options, err) {
    self._interceptError(call, options, err);
  };

  this._interceptrequest = function(call, options, request) {
    self._interceptRequest(call, options, request);
  };
};


RetryPlugin.prototype._interceptError = function(call, options, err) {
  var config, req;
  var syscall = err.syscall;

  if (syscall === 'connect') {
    config = call.__configure(options);

    // TODO: try to auto-correct the config

    call.__clear();
    req = call.__request();

    if (req && req !== true) {
      call.__intercept('request', this._interceptrequest);
    } else {
      call.__emit('error', err);
    }

  } else {
    call.__emit('error', err);
  }
};


RetryPlugin.prototype._interceptRequest = function(call, options, request) {

};
