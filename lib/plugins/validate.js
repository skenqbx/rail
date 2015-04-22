'use strict';
var Validate = require('mgl-validate');



function ValidatePlugin(rail, options) {
  if (!(this instanceof ValidatePlugin)) {
    return new ValidatePlugin(rail, options);
  }
  rail.use('buffer');
  rail.use('json');

  this._rail = rail;
  this._intercept = null;

  this.registry = new Validate({
    breakOnError: options.breakOnError === false ? false : true
  });

  var i, err;

  if (options.schemas) {
    for (i = 0; i < options.schemas.length; ++i) {
      err = this.registry.addSchema(options.schemas[i]);

      if (err) {
        throw err;
      }
    }
  }

  this._setup();
}
module.exports = ValidatePlugin;


ValidatePlugin.prototype._setup = function() {
  var self = this;
  var rail = this._rail;


  rail.on('plugin-configure', function(call, options) {
    options.validate = options.validate || {};

    if (options.validate.body) {
      options.json = true;
    }
  });


  rail.on('plugin-response', function(call, options, response) {
    var err;
    response.validate = true;

    if (options.validate.headers) {
      err = self._validate(options.validate.headers, response.headers);

      if (err) {
        response.validate = false;
        call.emit('warn', 'validate', 'error', err.message, err.validation);
      }
    }

    if (options.validate.body) {
      call.__intercept('response', self._intercept);
    }
  });


  this._intercept = function(call, options, response) {
    self._interceptResponse(call, options, response);
  };
};


ValidatePlugin.prototype._interceptResponse = function(call, options, response) {
  var err;

  if (response.json) {
    err = this._validate(options.validate.body, response.json);

    if (err) {
      response.validate = false;
      call.emit('warn', 'validate', 'error', err.message, err.validation);
    }
  } else {
    response.validate = false;
    call.emit('warn', 'validate', 'erro', 'no json data available');
  }

  call.__emit('response', response);
};


ValidatePlugin.prototype._validate = function(schema, data) {
  var err, id;

  if (typeof schema === 'string') {
    return this.registry.test(schema, data);

  } else if (typeof schema === 'object') {
    id = schema.id;

    err = this.registry.addSchema(schema);
    if (err) {
      return err;
    }

    err = this.registry.test(id, data);
    this.registry.removeSchema(id);

  } else {
    return new Error('Invalid schema');
  }
};
