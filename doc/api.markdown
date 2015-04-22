# [RAIL](../README.markdown) API

### RAIL.plugins
An object holding all built-in [plugins](./doc/plugins.markdown).

### RAIL.globalClient
A global `RAIL` object pre-loaded with `buffer`, `json`, `redirect` & `cookies` plugin.

### RAIL.call(urlOrOptions, responseListener)
A convenience method ala. `https.request()` using `RAIL.globalClient`.

See [rail.call()](#railcallopt_options-opt_responselistener).

## Class: RAIL
`RAIL` extends `events.EventEmitter`.

### new RAIL(opt_options)
Creates a new `RAIL` object.

**opt_options**

  - `{string} proto` - One of `https`, `http2` or `http`, defaults to `https`
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

When `opt_options` is a string, it is handled like `opt_options.url`.

  - `{string} proto` - See [`new RAIL(opt_options)`](#new-railopt_options)
  - `{string} url` - When given, the request options are set accordingly
  - `{Object} request` - request options, see `https.request()`
  - `{Object|boolean} *` - plugin options

_Note: For convenience & compatibility with node core API, all request options can also be provided directly besides proto & plugin options._

[back to top](#railplugins)

## Class: Call
`Call` extends `stream.Writable`.

### new Call(rail, opt_options)
Creates a new `Call` object.

#### call.ended
A boolean indicating the state of the writable stream.

#### call.request
The currently active `request` stream, if any.

#### call.response
The currently active `response` stream, if any.

### call.write(chunk, encoding, opt_callback)
See [writable.write()](https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback).

### call.end(chunk, encoding, opt_callback)
See [writable.end()](https://nodejs.org/api/stream.html#stream_writable_end_chunk_encoding_callback).
Always returns `this`.

### Event 'request'

`function({Object} request)`

### Event 'response'

`function({Object} response)`

### Event 'warn'

`function({string} plugin, {string} status, {?string} opt_message)`

### Event 'error'

[back to top](#railplugins)
