# RAIL

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
    - `cookies` - _what the name says_
    - `json` - json & json+stream parsing
    - `redirect` - _what the name says_
    - `retry` - timed multi-target retry
    - `validate` - response validation

## Usage

```js
var rail = require('rail');

var client = rail();

var call = client.call({

}, function(response) {

});
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
