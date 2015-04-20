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
    default: true // buffer response bodies by default
  }
});

// load redirect plugin
client.use('redirect');

// load json plugin
client.use('json', {
  auto: true
});

// create a call (that might result in multiple requests)
var call = client.call({
  request: {
    host: '127.0.0.1'   // overwrite default host
  },
  redirect: {
    limit: 1        // allow only one redirect
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
Statements   : 85.48% ( 318/372 )
Branches     : 75.21% ( 179/238 )
Functions    : 83.72% ( 36/43 )
Lines        : 85.48% ( 318/372 )
```
