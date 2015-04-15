# RAIL

[![Build Status](https://secure.travis-ci.org/skenqbx/rail.png)](http://travis-ci.org/skenqbx/rail)

**_Enhanced HTTP Client_**

```js
Stability: 1 - Experimental
```

## _Planned_ Features

  - **protocols**: `https`, [`http2`](https://www.npmjs.com/package/http2) & `http`
  - **plugins**:
    - `auth` - authentication & authorization
    - `buffer` - response buffers
    - `cache` - _what the name says_
    - `cookies` - [rfc6265](https://tools.ietf.org/html/rfc6265) compliant
    - `json` - json & json+stream parsing
    - `redirect` - _what the name says_
    - `retry` - timed multi-target retry
    - `validate` - response validation

## Usage

```js
var rail = require('rail');

var client = rail({
  request: {
    host: 'github.com'  // set default host
  },
  buffer: {
    default: true // buffer responses by default
  },
  redirect: {
    max: 2,
    codes: [301, 302, 308]
  }
});

var call = client.call({
  request: {
    proto: 'https',
    method: 'GET',
    path: '/',
    host: '127.0.0.1',
    port: 442
  },
  buffer: false,  // disable buffering for this call
  redirect: {
    max: 1        // allow only one redirect
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
Statements   : XX.XX% ( YY/ZZ )
Branches     : XX.XX% ( YY/ZZ )
Functions    : XX.XX% ( YY/ZZ )
Lines        : XX.XX% ( YY/ZZ )
```
