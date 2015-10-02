'use strict';



function RetryPlugin(rail, options) {
  if (!(this instanceof RetryPlugin)) {
    return new RetryPlugin(rail, options);
  }
  this._rail = rail;

  this._intercepterror = null;
  this._interceptrequest = null;
  this._interceptresponse = null;

  this.codes = options.codes !== undefined ?
      options.codes : [500, 501, 502, 503, 504];

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
    if (options.retry.limit > 0 &&
        (options.retry.validate || options.retry.codes)) {
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
  if (err.syscall === 'connect') {
    options.retry.limit = options.retry.limit - 1;
    call.emit('retry', options, null, 'connect', err.code);
    this._retry(call, options);
  } else {
    call.__emit('error', err);
  }
};


RetryPlugin.prototype._interceptResponse = function(call, options, response) {
  var self = this;
  var retry = options.retry;
  var reason = '';
  var code;

  if (retry.validate && response.validate) {
    reason = 'validate';
  } else if (retry.codes && retry.codes.indexOf(response.statusCode) > -1) {
    reason = 'codes';
    code = response.statusCode;
  } else {
    return call.__emit('response', response);
  }

  function finish() {
    retry.limit = retry.limit - 1;
    call.emit('retry', options, response, reason, code);
    self._retry(call, options);
  }

  // check if buffer plugin already handled the response body
  if (response.buffer !== undefined) {
    finish();

  } else {
    // dump obsolete response
    response.on('readable', function() {
      response.read();
    });

    // send next request
    response.on('end', finish);
  }
};


RetryPlugin.prototype._configure = function(options) {
  var retry;

  if (options.retry) {
    retry = options.retry;

    if (retry.interval === undefined) {
      retry.interval = this.interval;
    }
    if (retry.limit === undefined) {
      retry.limit = this.limit;
    }
    if (retry.validate === undefined) {
      retry.validate = this.validate;
    }
    if (retry.codes === undefined) {
      retry.codes = this.codes ? this.codes.slice() : false;
    } else if (retry.codes !== false) {
      retry.codes = this.codes.concat(retry.codes);
    }

  } else if (options.retry === false) {
    options.retry = {
      limit: 0
    };

  } else {
    options.retry = {
      interval: this.interval,
      limit: this.limit,
      validate: this.validate,
      codes: this.codes ? this.codes.slice() : false
    };
  }
};
