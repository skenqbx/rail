# RAIL

[![Build Status](https://secure.travis-ci.org/skenqbx/rail.png)](http://travis-ci.org/skenqbx/rail)
[![dependencies](https://david-dm.org/skenqbx/rail.svg)](https://github.com/skenqbx/rail)
[![NPM version](https://img.shields.io/npm/v/rail.svg?style=flat-square)](https://www.npmjs.com/package/rail)

**_Enhanced HTTP Client_**

```js
Stability: 2 - Unstable
```

## Table of Contents

 - [Features](#features)
 - [Examples](#examples)
 - [API](./doc/api.markdown)
 - [Plugins](./doc/plugins.markdown)
 - [Plugin API](./doc/plugin-api.markdown) - _the internals of RAIL_
 - [Tests](#tests)
 - [ChangeLog](./CHANGELOG.markdown)
 - [License](./LICENSE)

## Features

  - **protocols**: `https`, [`http2`](https://www.npmjs.com/package/http2) & `http`
  - **plugins**:
    - [`buffer`](./doc/plugins.markdown#buffer) - response buffering
    - [`cookies`](./doc/plugins.markdown#cookies)
    - [`redirect`](./doc/plugins.markdown#redirect)
    - [`json`](./doc/plugins.markdown#json) - json response parsing
    - `auth` - (wip) authentication & authorization
    - `cache` - (wip) _what the name says_
    - `retry` - (wip) timed multi-target retry
    - `validate` - (wip) response validation

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
Statements   : 85.93% ( 342/398 )
Branches     : 77.24% ( 190/246 )
Functions    : 84.44% ( 38/45 )
Lines        : 85.93% ( 342/398 )
```
