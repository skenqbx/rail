'use strict';
var Validate = require('mgl-validate');


function validatePlugin(rail, opt_options) {
  opt_options = opt_options || {};

  rail.use('json');

  var i, err;
  var registry = new Validate();
  var pluginOptions = {
    registry: registry
  };

  if (opt_options.schemas) {
    for (i = 0; i < opt_options.schemas.length; ++i) {
      err = registry.addSchema(opt_options.schemas[i]);

      if (err) {
        throw err;
      }
    }
  }

  return pluginOptions;
}
module.exports = validatePlugin;
