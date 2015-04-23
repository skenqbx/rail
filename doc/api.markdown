# [rail](../README.markdown) API

## Table of Contents

  - [Exports](#exports)
    - [RAIL.plugins](#railplugins)
    - [RAIL.globalClient](#railglobalclient)
    - [RAIL.call(urlOrOptions, responseListener)](#railcallurloroptions-responselistener)
  - [Class: RAIL](#class-rail)
    - [new RAIL(opt_options)](#new-railopt_options)
      - [rail.plugins](#railplugins-1)
      - [rail.proto](#railproto)
      - [rail.defaults](#raildefaults)
    - [rail.use(name, opt_plugin, opt_options)](#railusename-opt_plugin-opt_options)
    - [rail.call(opt_options, opt_responseListener)](#railcallopt_options-opt_responselistener)
  - [Class: Call](#class-call)
    - [new Call(rail, opt_options)](#new-callrail-opt_options)
      - [call.aborted](#callaborted)
      - [call.ended](#callended)
      - [call.request](#callrequest)
      - [call.response](#callresponse)
    - [call.abort()](#callabort)
    - [call.write(chunk, encoding, opt_callback)](#callwritechunk-encoding-opt_callback)
    - [call.end(chunk, encoding, opt_callback)](#callendchunk-encoding-opt_callback)
    - [Event: 'request'](#event-request)
    - [Event: 'response'](#event-repsonse)
    - [Event: 'warn'](#event-warn)
    - [Event: 'error'](#event-error)

## Exports

### RAIL.plugins
An object holding all built-in [plugins](./doc/plugins.markdown).

### RAIL.globalClient
A global `RAIL` object pre-loaded with `buffer`, `json`, `redirect`, `cookies`, `timeout`, `validate` & `retry` plugin.

### RAIL.call(urlOrOptions, responseListener)
A convenience method ala. `https.request()` using `RAIL.globalClient`.

See [rail.call()](#railcallopt_options-opt_responselistener).

[back to top](#table-of-contents)

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

### rail.use(name, opt_plugin, opt_options)
Loads a plugin.

  - `{string} name` The name of the plugin
  - `{?function=} opt_plugin` A plugin constructor
  - `{?Object=} opt_options` Optional plugin options

Returns the newly loaded plugin on success, `null` when the plugin is already loaded and `false` when no constructor could be located.

```js
rail.use('buffer'/*, opt_options */);        // load built-in plugin
rail.use('my', MyPlugin/*, opt_options */);  // load a custom plugin
```

### rail.call(opt_options, opt_responseListener)
Factory method to create new `Call` objects, think `https.request()`.

**opt_options**

When `opt_options` is a string, it is handled like `opt_options.url`.

  - `{string} proto` See [`new RAIL(opt_options)`](#new-railopt_options)
  - `{string} url` When given, the request options are set accordingly
  - `{Object} request` The request options, see [io.js](https://iojs.org/api/https.html#https_https_request_options_callback) or [node.js](https://nodejs.org/api/https.html#https_https_request_options_callback)
  - `{Object|boolean} *` Any plugin options, configured plugins are auto-loaded

_Notes_

  - _request options `hostname`, `localAddress` & `socketPath` are not supported_
  - _request options can also be provided directly besides proto & plugin options_

[back to top](#table-of-contents)

## Class: Call
`Call` extends `stream.Writable`.

### new Call(rail, opt_options)
Creates a new `Call` object.

#### call.aborted
A boolean indicating the state of the call.

#### call.ended
A boolean indicating the state of the writable stream.

#### call.request
The currently active `request` stream, if any.

#### call.response
The currently active `response` stream, if any.

### call.abort()
Immediately abort any request, free the send-buffer & prevent any further requests.

_Note_: An `error` is very likely to be emitted after a call to `abort()`.

### call.write(chunk, encoding, opt_callback)
See [writable.write()](https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback).

### call.end(chunk, encoding, opt_callback)
See [writable.end()](https://nodejs.org/api/stream.html#stream_writable_end_chunk_encoding_callback).

Returns `this`.

### Event 'request'

`function({Object} request)`

### Event 'response'

`function({Object} response)`

### Event 'warn'

`function({string} plugin, {string} status, {?string} opt_message)`

### Event 'error'

[back to top](#table-of-contents)
