# RAIL

[![Build Status](https://secure.travis-ci.org/skenqbx/rail.png)](http://travis-ci.org/skenqbx/rail)
![dependencies](https://david-dm.org/skenqbx/rail.svg)

**_Enhanced HTTP Client_**

```js
Stability: 2 - Unstable
```

## Table of Contents

 - [Features](#features)
 - [Usage](#usage)
 - [API](#api)
 - [Plugins](./doc/plugins.markdown)
 - [Plugin API](./doc/plugin-api.markdown)
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

## Usage

```js
var rail = require('rail');

// create a client that holds defaults & plugins
var client = rail({
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

## API

### new RAIL(opt_options)
Creates a new `RAIL` object.

**opt_options**

  - `{string} proto`
  - `{Object} request` - holding default request options, see `https.request()`
  - `{Object} *` - plugin options

#### rail.plugins
An object holding loaded plugins.

#### rail.proto
The default protocol for all calls.

#### rail.defaults
The default request options for all calls.

### rail.use(plugin, opt_options)
Loads a plugin. Currently only built-in plugins are supported (you could patch `RAIL.plugins` though).

### rail.call(opt_options, opt_responseListener)
Factory method to create new `Call` objects, think `https.request()`.

**opt_options**

  - `{string} proto`
  - `{Object} request` - request options, see `https.request()`
  - `{Object|boolean} *` - plugin options

_Note: For convenience & compatibility with node core API, all request options can also be provided directly besides proto & plugin options._

### new Call(rail, opt_options)
Creates a new `Call` object. `Call` extends `stream.Writable`.

### Event 'request'
### Event 'response'
### Event 'warn'

`function({string} plugin, {string} status, {?string} opt_message)`

### Event 'error'

## Tests

```bash
npm test
firefox coverage/lcov-report/index.html
```

### Coverage

```
Statements   : 85.48% ( 318/372 )
Branches     : 75.21% ( 179/238 )
Functions    : 83.72% ( 36/43 )
Lines        : 85.48% ( 318/372 )
```
