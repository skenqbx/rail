'use strict';
var Validate = require('mgl-validate');


function validate(rail, opt_options) {
  opt_options = opt_options || {};

  var registry = new Validate();

  rail.use('buffer');
  // rail.plugins.buffer.default = true;
}
module.exports = validate;
