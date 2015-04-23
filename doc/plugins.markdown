# [rail](../README.markdown) Plugins

## Table of Contents

  - [buffer](#buffer)
  - [cookies](#cookies)
  - [json](#json)
  - [redirect](#redirect)
  - [timeout](#timeout)
  - [validate](#validate)

## buffer
Buffers the response body and exports it as `response.buffer`.
When the body is empty its value is `null`, otherwise a `Buffer`.

**options**

  - `{boolean} default` Enable buffering for all requests, defaults to `false`
  - `{number} max` The maximum buffer size, defaults to `134217728` (128 MiB)

**request options**

  - `{boolean} buffer` En-/disable buffering

### buffer.intercept(call)
Manually intercept (buffer the response body). To be used by other plugins.

[back to top](#table-of-contents)

## cookies
Get/Set cookies. Received cookies are exported as `response.cookies`.

**options**

  - `{Object} jar` The cookie jar to use, defaults to `{}`


**request options**

  - `{boolean} cookies` When `false`, the plugin is disabled for this _call_

[back to top](#table-of-contents)

## json
Parse response body. Parsed body is exported as `response.json`.

Uses the `buffer` plugin.

**options**

  - `{boolean} auto` Enable auto-parsing when `Content-Type: application/json`
  - `{number} max` The maximum buffer size, defaults to `1048576` (1 MiB)

**request options**

  - `{boolean} json` Enable JSON parsing

### json.intercept(call)
Manually intercept (buffer the response body & try to parse). To be used by other plugins.

[back to top](#table-of-contents)

## redirect
A configurable redirect mechanism.

**options**

  - `{Array} codes` HTTP status codes to react on, defaults to `[301, 302, 308]`
  - `{number} limit` The maximum number of redirects, defaults to `1`
  - `{boolean} sameHost` Only allow redirects to the current host, defaults to `false`
  - `{boolean} allowUpgrade` Allow switch from `http` to `https/2`, defaults to `true`
  - `{boolean} allowDowngrade` Allow switch from `https/2` to `http`, defaults to `false`

**request options**

  - `{Object} redirect`
    - `{number} limit` See `options`
    - `{boolean} sameHost` See `options`
    - `{boolean} allowUpgrade` See `options`
    - `{boolean} allowDowngrade` See `options`

_Note_: When no request options are supplied, the plugin defaults apply.

### Event: 'redirect'
Emitted when `request.end()` of a redirected request has been called.

`function({Object} options)`

[back to top](#table-of-contents)

## timeout
Response & socket timeout detection.

**options**

  - `{number} response` The response timeout in ms, defaults to `60000` (1 min)
  - `{number} socket` The socket idle timeout in ms, defaults to `120000` (2 min)

_Note_: The socket idle timeout is only supported for https & http.

**request options**

  - `{number} response` Set to `0` to disable the timeout, also see `options`
  - `{number} socket` Set to `0` to disable the timeout, also see `options`

_Note_: When no request options are supplied, the plugin defaults apply.

### Event: 'timeout'
Emitted on the `call` object when a timeout occurs. It is up to the user to abort the call.

`function({string} type, {Object} options)`

Where `type` is either `'response'` or `'socket'`, and `options` is the request configuration.

[back to top](#table-of-contents)

## validate
Response header & JSON body validation.

Schema definitions & validation are provided by [mgl-validate](https://www.npmjs.com/package/mgl-validate).

  - Body validation only supports JSON responses
  - Every schema requires a unique `id`
  - Consider setting `allowUnknownProperties = true` when validating headers

Uses the `buffer` & `json` plugin.

**options**

  - `{Array.<Object>} schemas` An array of schema definitions
  - `{boolean} breakOnError` Whether to return on first validation error or not, defaults to `true`

**request options**

  - `{Object|string} headers` An existing schema id or a schema definition
  - `{Object|string} body` An existing schema id or a schema definition

Validation results are exported as `response.validate = null` when all validations passed, and an object when a validation failed;

```js
response.validate = {
  headers: null,
  body: [
    ['hello', 'number', 'type', 'world']
  ]
};
```

**Headers Schema Definition Example**

This example shows how-to validate that the `Content-Type` header equals `'application/json'`.

```js
{
  type: 'object',
  properties: {
    'content-type': 'application/json'
  },
  allowUnknownProperties: true
}
```

### validate.registry
The [mgl-validate](https://www.npmjs.com/package/mgl-validate) schema registry.

[back to top](#table-of-contents)
