'use strict';



function RetryPlugin(rail, options) {
  if (!(this instanceof RetryPlugin)) {
    return new RetryPlugin(rail, options);
  }
  this._rail = rail;

  this._intercepterror = null;
  this._interceptrequest = null;
  this._interceptresponse = null;

  this.connectErrors = [
    'ECONNREFUSED',
    'ETIMEDOUT'
  ];

  this.interval = options.interval || 2000;
  this.limit = options.limit || 0;

  this._setup();
}
module.exports = RetryPlugin;


RetryPlugin.prototype._setup = function() {
  var self = this;
  var rail = this._rail;

  rail.on('plugin-configure', function(call, options) {
    self._configure(options);

    if (options.retry.limit > 0) {
      if (!call.__buffer()) {
        return call.emit('warn', 'retry', 'error', 'failed to enable send-buffer');
      }
      call.__intercept('error', self._intercepterror);
    }
  });

  // rail.on('plugin-response', function(call, options) {
  //   if (options.retry.limit > 0) {
  //     call.__intercept('response', self._interceptresponse);
  //   }
  // });

  this._intercepterror = function(call, options, err) {
    self._interceptError(call, options, err);
  };

  this._interceptrequest = function(call, options, request) {
    // blackhole
  };

  // this._interceptresponse = function(call, options, response) {
  //   self._interceptResponse(call, options, response);
  // };
};


RetryPlugin.prototype._interceptError = function(call, options, err) {
  var self = this;
  var config;
  var syscall = err.syscall;

  if (syscall === 'connect' && this.connectErrors.indexOf(err.code) > -1) {
    call.__abort(err.code);
    options.retry.limit = options.retry.limit - 1;

    // TODO: try to auto-correct the config
    // TODO: alternate protocols, hosts and/or ports

    // create a new request configuration
    config = call.__configure(options);

    call.emit('retry', options);

    setTimeout(function() {
      // create the request & flush send-buffer
      call.__request(function(err2, request) {
        if (request) {
          call.__intercept('request', self._interceptrequest);
          request.end();
        }
      });
    }, options.retry.interval);

  } else {
    call.__emit('error', err);
  }
};


// RetryPlugin.prototype._interceptResponse = function(call, options, response) {
//   call.__emit('response', response);
// };


RetryPlugin.prototype._configure = function(options) {
  if (options.retry) {
    if (options.retry.interval === undefined) {
      options.retry.interval = this.interval;
    }
    if (options.retry.limit === undefined) {
      options.retry.limit = this.limit;
    }

  } else if (options.retry === false) {
    options.retry = {
      limit: 0
    };

  } else {
    options.retry = {
      interval: this.interval,
      limit: this.limit
    };
  }
};
