'use strict';



function JSONPlugin(rail, options) {
  if (!(this instanceof JSONPlugin)) {
    return new JSONPlugin(rail, options);
  }
  rail.use('buffer');

  this._rail = rail;

  this.auto = options.auto || false;
  this.max = options.max || 1048576; // 1 MiB

  this._setup();
}
module.exports = JSONPlugin;


JSONPlugin.prototype._setup = function() {
  var self = this;
  var rail = this._rail;
  var jsonHeader_ = false;

  rail.on('plugin-response', function(call, options, response) {
    if (response.headers['content-type'] &&
        response.headers['content-type'].indexOf('application/json') === 0) {
      jsonHeader_ = true;
    }

    if (self.auto && options.json !== false && jsonHeader_ ||
          !self.auto && options.json === true && jsonHeader_) {
      self.intercept(call);
    }
  });

  this._intercept = function(call, options, response) {
    self._interceptResponse(call, options, response);
  };
};


JSONPlugin.prototype.intercept = function(call) {
  this._rail.plugins.buffer.intercept(call);
  call.__intercept('response', this._intercept);
};


JSONPlugin.prototype._interceptResponse = function(call, options, response) {
  if (response.buffer) {

    if (response.buffer.length > this.max) {
      call.emit('warn', 'json', 'blocked', 'max length exceeded');

    } else {
      try {
        response.json = JSON.parse(response.buffer);
      } catch (err) {
        call.emit('warn', 'json', 'failed', 'parse error');
      }
    }
  }

  call.__emit('response', response);
};
