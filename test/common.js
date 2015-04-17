'use strict';
var fs = require('fs');
var path = require('path');

exports.fixtures = path.resolve(__dirname, 'fixtures');

exports.serverKey = fs.readFileSync(exports.fixtures + '/server.key');
exports.serverCert = fs.readFileSync(exports.fixtures + '/server.crt');

exports.port = 57647;
