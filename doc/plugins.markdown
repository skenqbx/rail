# RAIL Plugins

## buffer
Buffers the response body and exports it as `response.buffer`.
When the body is empty its value is `null`, otherwise a `Buffer`.

**options**

  - `{boolean} default` enable buffering for all requests, defaults to `false`
  - `{number} max` max buffer size, defaults to `134217728` (128 MiB)

**request options**

  - `{boolean} buffer` en-/disable buffering

### buffer.intercept(call)
Manually intercept (buffer the response body). To be used by other plugins.

## cookies
Get/Set cookies. Received cookies are exported as `response.cookies`.

**options**

  - `{Object} jar` the cookie jar to use, defaults to `{}`

## json
Parse response body. Parsed body is exported as `response.json`.

**options**

  - `{boolean} auto` enable auto-parsing when `Content-Type: application/json`

**request options**

  - `{boolean} json` enable json parsing

## redirect

**options**

  - `{Array} codes` codes to react on, defaults to `[301, 302, 308]`
  - `{number} limit` max number of redirects, defaults to `1`
  - `{boolean} sameHost` only allow redirects to the current host, defaults to `false`
  - `{boolean} allowUpgrade` allow switch from `http` to `https`, defaults to `true`
  - `{boolean} allowDowngrade` allow switch from `https` to `http`, defaults to `false`

**request options**

  - `{Object} redirect`
    - `{number} limit` see `options`
    - `{boolean} sameHost` see `options`
    - `{boolean} allowUpgrade` see `options`
    - `{boolean} allowDowngrade` see `options`

### Event: 'redirect'
