# RAIL Plugins

## buffer

**options**

  - `{boolean} default` enable buffering for all requests, defaults to `false`
  - `{number} max` max buffer size, defaults to `134217728` (128 MiB)

**request options**

  - `{boolean} buffer` en-/disable buffering

## cookies

**options**

  - `{Object} jar` the cookie jar to use, defaults to `{}`

## json

**request options**

  - `{boolean} json` enable json parsing

## redirect

**options**

  - `{number} limit` max number of redirects, defaults to `1`
  - `{Array} codes` codes to react on, defaults to `[301, 302, 308]`

**request options**

  - `{Object} redirect`
    - `{number} limit` see `options`
