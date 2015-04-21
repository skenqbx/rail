# RAIL

[![Build Status](https://secure.travis-ci.org/skenqbx/rail.png)](http://travis-ci.org/skenqbx/rail)
[![dependencies](https://david-dm.org/skenqbx/rail.svg)](https://github.com/skenqbx/rail)
[![NPM version](https://img.shields.io/npm/v/rail.svg?style=flat-square)](https://www.npmjs.com/package/rail)

**_An enhanced HTTP/RESTful API Client_**

RAIL is a _mostly_ io.js/node.js core compatible HTTP/RESTful API client and supports the current `https`, `http` and [`http2`](https://www.npmjs.com/package/http2) protocols.

The concept of _a single request_ is extended to _a possible series of requests_ further referenced as a _call_.
This allows a seamless integration of redirect and authentication mechanisms that require multiple requests to satisfy the original one.

A set of built-in plugins, currently featuring [`buffer`](./doc/plugins.markdown#buffer), [`cookies`](./doc/plugins.markdown#cookies), [`redirect`](./doc/plugins.markdown#redirect) & [`json`](./doc/plugins.markdown#json) make simple requests even simpler,
and a powerful event-driven plugin interface aids in the implementation of complex RESTful API calls.

RAIL works with [io.js](https://iojs.org/) 1.x and [node.js](https://nodejs.org/) 0.10.x/0.12.x.

```js
Stability: 2 - Unstable
```

## Table of Contents

  - [Install](#install)
  - [Examples](#examples)
  - [API](./doc/api.markdown)
  - [Plugins](./doc/plugins.markdown)
  - [Plugin API](./doc/plugin-api.markdown) - _the internals of RAIL_
  - [Tests](#tests)
  - [ChangeLog](./CHANGELOG.markdown)
  - [License](./LICENSE)

## Install

```
$ npm install rail
```

## Examples

### globalClient - URL only

```js
var RAIL = require('rail');

RAIL.call('https://www.github.com/', function(response) {
  // consume response
}).end();
```

### globalClient - URL & plugin options

```js
var RAIL = require('rail');

RAIL.call({
  url: 'https://www.github.com/',
  buffer: true
}, function(response) {
  if (response.buffer) {
    console.log(response.buffer.toString());
  }
}).end();
```

### globalClient - request & plugin options

```js
var RAIL = require('rail');

RAIL.call({
  host: 'www.github.com',
  buffer: true
}, function(response) {
  if (response.buffer) {
    console.log(response.buffer.toString());
  }
}).end();
```

### Custom client

```js
var RAIL = require('rail');

// create a client that holds defaults & plugins
var client = new RAIL({
  request: {
    host: 'github.com'  // set default host
  },
  buffer: { // auto-loads buffer plugin
    default: true
  }
});

// load plugins (another way)
client.use('redirect');
client.use('json', {
  auto: true
});

// create a call (that might result in multiple requests)
var call = client.call({
  path: '/',
  redirect: {
    allowDowngrade: true,
    limit: 5
  }
}, function(response) {
  // ... consume the response
});

call.on('error', function(err) { /* ... */ });

call.on('warn', function(plugin, status, opt_message) {
  console.log(plugin, status, opt_message);
});

call.write('hello');
call.end('world');
```

## Tests

```bash
npm test
firefox coverage/lcov-report/index.html
```

### Coverage

```
Statements   : 84.91% ( 394/464 )
Branches     : 78.06% ( 217/278 )
Functions    : 83.93% ( 47/56 )
Lines        : 84.91% ( 394/464 )
```
