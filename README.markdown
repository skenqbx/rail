# rail

[![NPM version](https://img.shields.io/npm/v/rail.svg?style=flat-square)](https://www.npmjs.com/package/rail)
[![dependencies](https://david-dm.org/skenqbx/rail.svg)](https://github.com/skenqbx/rail)
[![devDependencies](https://david-dm.org/skenqbx/rail/dev-status.svg)](https://github.com/skenqbx/rail)
[![Build Status](https://secure.travis-ci.org/skenqbx/rail.png)](http://travis-ci.org/skenqbx/rail)

**_An enhanced HTTP/RESTful API Client_**

_rail_ is an io.js/node.js HTTP client supporting https, http and [http2](https://www.npmjs.com/package/http2).

A set of built-in plugins, currently featuring [`buffer`](./doc/plugins.markdown#buffer), [`cookies`](./doc/plugins.markdown#cookies), [`json`](./doc/plugins.markdown#json), [`redirect`](./doc/plugins.markdown#redirect), [`retry`](./doc/plugins.markdown#retry), [`timeout`](./doc/plugins.markdown#timeout) & [`validate`](./doc/plugins.markdown#validate) simplify making requests,
and a powerful event-driven plugin interface aids in the implementation of complex automated RESTful API calls.

The concept of _a single request_ is extended to _a possible series of requests_ further referenced as a _call_.
This allows a seamless integration of redirect and authentication mechanisms that require multiple requests to satisfy the original one.

The API is mostly compatible with `http.request()` & `https.request()` and allows _rail_ to be used as a _drop-in replacement_.
A completely _transparent_ plugin integration enables scenarios with automated retries on _upload_ stream errors, while still exhibiting a `https.request()` compatible behavior.

_rail_ works with [io.js](https://iojs.org/) 1.x and [node.js](https://nodejs.org/) 0.10.x/0.12.x.

```js
Stability: 2 - Unstable
```

## Table of Contents

  - [Installation](#installation)
  - [Examples](#examples)
    - [URL Only](#url-only)
    - [URL & Plugin Options](#url--plugin-options)
    - [Request & Plugin Options](#request--plugin-options)
    - [Custom Client](#custom-client)
  - [Use as a drop-in replacement](#use-as-a-drop-in-replacement)
  - [Plugins](./doc/plugins.markdown)
  - [API](./doc/api.markdown)
  - [Plugin API](./doc/plugin-api.markdown)
  - [Tests](#tests)
  - [ChangeLog](./CHANGELOG.markdown)
  - [License](./LICENSE)

## Installation

```
$ npm install rail
```

## Examples

### URL only
Directly pass an URL that gets parsed into `proto`, `host`, `port` & `path`.

```js
var RAIL = require('rail');

RAIL.call('https://www.github.com/skenqbx/rail', function(response) {
  // consume response
}).end();
```

[back to top](#table-of-contents)

### URL & Plugin Options
Again, only pass an URL, but this time as a property to allow passing of plugin options.

```js
var RAIL = require('rail');

RAIL.call({
  url: 'https://www.github.com/skenqbx/rail',
  buffer: true
}, function(response) {
  if (response.buffer) {
    console.log(response.buffer.toString());
  }
}).end();
```

[back to top](#table-of-contents)

### Request & Plugin Options
The usual way of supplying every parameter separately.

```js
var RAIL = require('rail');

RAIL.call({
  host: 'www.github.com',
  path: '/skenqbx/rail',
  buffer: true
}, function(response) {
  if (response.buffer) {
    console.log(response.buffer.toString());
  }
}).end();
```

[back to top](#table-of-contents)

### Custom Client

```js
var RAIL = require('rail');

// create a client that holds defaults & plugins
var client = new RAIL({
  request: {
    host: 'github.com'  // set default host
  },
  json: { // configured plugins are loaded on client creation
    auto: true
  }
});

// load plugins
client.use('redirect');

// create a call (that might result in multiple requests)
var call = client.call({
  path: '/skenqbx/rail',
  redirect: {
    allowDowngrade: true,
    limit: 5
  }
}, function(response) {
  if (response.json) {
    console.log(response.json);
  } else if (response.buffer) { // buffer might still be available
                                //   because json uses the buffer plugin
    console.log(response.buffer.toString());
  }
});

call.on('error', function(err) { /* ... */ });

call.on('warn', function(plugin, status, opt_message) {
  console.log(plugin, status, opt_message);
});

call.write('hello');
call.end('world');
```

[back to top](#table-of-contents)

## Use as a drop-in replacement
_rail_ does **not** support the `hostname`, `localAddress` & `socketPath` options, see [rail.call()](./doc/api.markdown#railcallopt_options-opt_responselistener) for more information.

When **not** using **https**, make sure to set the correct default protocol

```js
var RAIL = require('rail');
RAIL.globalClient.proto = 'http';
```
... and then replace every call to `http.request` with `RAIL.call`.

_Alternatively_ create a custom client with defaults & plugins configured to your needs.

[back to top](#table-of-contents)

## Tests

```bash
npm test
firefox coverage/lcov-report/index.html
```

### Coverage

```
Statements   : 94.79% ( 637/672 )
Branches     : 88.83% ( 342/385 )
Functions    : 97.70% ( 85/87 )
Lines        : 94.79% ( 637/672 )
```

[back to top](#table-of-contents)
