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
    'ECONNRESET',
    'ETIMEDOUT'
  ];

  this.interval = options.interval || 2000;
  this.limit = options.limit || 0;
  this.validate = typeof options.validate === 'boolean' ?
      options.validate : false;

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
        return call.emit('warn', 'retry', 'error', 'failed to enable replay buffer');
      }
      call.__intercept('error', self._intercepterror);
    }
  });

  rail.on('plugin-response', function(call, options, response) {
    if (options.retry.limit > 0 && options.retry.validate) {
      call.__intercept('response', self._interceptresponse);
    }
  });

  this._intercepterror = function(call, options, err) {
    self._interceptError(call, options, err);
  };

  this._interceptrequest = function(call, options, request) {
    request.end();
    // blackhole the event
  };

  this._interceptresponse = function(call, options, response) {
    self._interceptResponse(call, options, response);
  };
};


/**
 * Unconditional retry; just gets it done.
 */
RetryPlugin.prototype._retry = function(call, options) {
  var self = this;

  call.__abort();

  // create a new request configuration
  var config = call.__configure(options);

  // TODO: unref or clear on abort
  setTimeout(function() {
    // create the request & flush replay buffer
    call.__request(function(err2, request) {
      if (request) {
        call.__intercept('request', self._interceptrequest);
      }
    });
  }, config.retry.interval);

  return config;
};


RetryPlugin.prototype._interceptError = function(call, options, err) {
  if (err.syscall === 'connect' && this.connectErrors.indexOf(err.code) > -1) {
    // TODO: try to auto-correct the config
    // TODO: alternate protocols, hosts and/or ports
    options.retry.limit = options.retry.limit - 1;
    this._retry(call, {});
    call.emit('retry', options);
  } else {
    call.__emit('error', err);
  }
};


RetryPlugin.prototype._interceptResponse = function(call, options, response) {
  if (response.validate) {
    options.retry.limit = options.retry.limit - 1;
    this._retry(call, {});
    call.emit('retry', options);
  } else {
    call.__emit('response', response);
  }
};


RetryPlugin.prototype._configure = function(options) {
  if (options.retry) {
    if (options.retry.interval === undefined) {
      options.retry.interval = this.interval;
    }
    if (options.retry.limit === undefined) {
      options.retry.limit = this.limit;
    }
    if (options.retry.validate === undefined) {
      options.retry.validate = this.validate;
    }

  } else if (options.retry === false) {
    options.retry = {
      limit: 0
    };

  } else {
    options.retry = {
      interval: this.interval,
      limit: this.limit,
      validate: this.validate
    };
  }
};
