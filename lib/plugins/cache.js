'use strict';


function cache(rail, opt_options) {
  opt_options = opt_options || {};

  rail.use('buffer');
  // rail.plugins.buffer.default = true;
}
module.exports = cache;
