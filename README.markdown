# RAIL

[![Build Status](https://secure.travis-ci.org/skenqbx/rail.png)](http://travis-ci.org/skenqbx/rail)
![dependencies](https://david-dm.org/skenqbx/rail.svg)

**_Enhanced HTTP Client_**

```js
Stability: 1 - Experimental
```

## Features

  - **protocols**: `https`, [`http2`](https://www.npmjs.com/package/http2) & `http`
  - **plugins**:
    - `buffer` - response buffers
    - `cookies` - _what the name says_ (no expiry)
    - `redirect` - _what the name says_ (unlimited)

## _Planned_ Features

  - **plugins**:
    - `auth` - authentication & authorization
    - `cache` - _what the name says_
    - `json` - json & json+stream parsing
    - `retry` - timed multi-target retry
    - `validate` - response validation

## Usage

```js
var rail = require('rail');

// create a client that holds defaults & plugins
var client = rail({
  proto: 'https',
  request: {
    method: 'GET',
    path: '/',
    host: 'github.com'  // set default host
  },
  buffer: { // auto-loads buffer plugin
    default: true // buffer responses by default
  },
  redirect: {
    limit: 2,
    codes: [301, 302, 308]
  }
});

// create a request
var call = client.call({
  request: {
    host: '127.0.0.1'   // overwrite default host
  },
  buffer: false,  // disable buffering for this call
  redirect: {
    limit: 1        // allow only one redirect
  }
}, function(response) {
  // ... consume the response
});

call.on('error', function(err) { /* ... */ });

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
Statements   : 84.81% ( 240/283 )
Branches     : 73.72% ( 115/156 )
Functions    : 81.08% ( 30/37 )
Lines        : 84.81% ( 240/283 )
```
