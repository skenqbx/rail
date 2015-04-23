'use strict';



function TimeoutPlugin(rail, options) {
  if (!(this instanceof TimeoutPlugin)) {
    return new TimeoutPlugin(rail, options);
  }
  this._rail = rail;

  this.response = options.response || 60000; // 1 min
  this.socket = options.socket || 120000; // 2 min

  this._setup();
}
module.exports = TimeoutPlugin;


TimeoutPlugin.prototype._setup = function() {
  var self = this;
  var rail = this._rail;

  rail.on('plugin-configure', function(call, options) {
    options.timeout = options.timeout || {};

    if (options.timeout.response === undefined) {
      options.timeout.response = self.response;
    }

    if (options.timeout.socket === undefined) {
      options.timeout.socket = self.socket;
    }
  });

  rail.on('plugin-request', function(call, options, request) {
    if (options.timeout) {
      self._enable(call, options, request);
    }
  });
};


TimeoutPlugin.prototype._enable = function(call, options, request) {
  var responseTimeoutId;

  function onResponseTimeout() {
    call.emit('timeout', 'response', options);
  }

  function onSocketTimeout() {
    call.emit('timeout', 'socket', options);
  }

  function releaseResponseTimeout() {
    clearTimeout(responseTimeoutId);
  }

  // enable socket timeout
  if (options.timeout.socket > 0 &&
      options.proto === 'http' || options.proto === 'https') {
    request.setTimeout(options.timeout.socket, onSocketTimeout);
  }

  // enable response timeout
  if (options.timeout.response > 0) {
    // TODO: figure out when to actually start the timeout
    responseTimeoutId = setTimeout(onResponseTimeout, options.timeout.response);
    request.once('response', releaseResponseTimeout);
  }
};
