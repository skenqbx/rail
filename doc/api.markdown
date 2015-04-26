# [rail](../README.markdown) API

## Table of Contents

  - [Exports](#exports)
    - [RAIL.plugins](#railplugins)
    - [RAIL.tools](#railtools)
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
    - [Event: 'response'](#event-response)
    - [Event: 'warn'](#event-warn)
    - [Event: 'error'](#event-error)
  - [Class: ReplayBuffer](#class-replaybuffer)
    - [new ReplayBuffer(opt_max)](#new-replaybufferopt_max)
      - [replayBuffer.max](#replaybuffermax)
      - [replayBuffer.length](#replaybufferlength)
      - [replayBuffer.buffer](#replaybufferbuffer)
      - [replayBuffer.ended](#replaybufferended)
      - [replayBuffer.bailout](#replaybufferbailout)
    - [replayBuffer.pipe(writable, opt_callback)](#replaybufferpipewritable-opt_callback)
    - [replayBuffer.unpipe(writable)](#replaybufferunpipewritable)
    - [replayBuffer.push(chunk)](#replaybufferpushchunk)
    - [replayBuffer.replay(writable, callback)](#replaybufferreplaywritable-callback)
    - [replayBuffer.dump()](#replaybufferdump)
    - [replayBuffer.end()](#replaybufferend)
    - [Event: 'end'](#event-end)

## Exports

### RAIL.plugins
An object holding all built-in [plugins](./doc/plugins.markdown).

### RAIL.tools

#### tools.copyHeaders(target, source, defaults)
Copies all properties, _headers_ in this case, from either the `source` or the `defaults` to the `target`.

#### tools.copy(target, source, defaults, keys)
Copies all properties in `keys` from either the `source` or the `defaults` to the `target`.

#### tools.parseURL(url)
Parses an URL into an object with `proto`, `host`, `port` & `path`.

#### tools.applyURL(target, url)
Applies `proto`, `host`, `port` & `path` of an URL to the `target`.

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
  - `{number} maxReplayBuffer` The maximum size of a buffered request body, see [Class: ReplayBuffer](#class-replaybuffer)

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
  - `{number} maxReplayBuffer` The maximum size of a buffered request body, see [Class: ReplayBuffer](#class-replaybuffer)

_Notes_

  - _request options `hostname`, `auth`, `localAddress` & `socketPath` are not supported_
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
Immediately abort any request, free the `ReplayBuffer` and prevent any further requests.
Internally `request.abort()` is called.

_Note_: An `error` is very likely to be emitted after a call to `abort()`.

### call.write(chunk, encoding, opt_callback)
See [writable.write()](https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback).

### call.end(chunk, encoding, opt_callback)
See [writable.end()](https://nodejs.org/api/stream.html#stream_writable_end_chunk_encoding_callback).

Returns `this`.

### Event 'request'
Emitted after the request object has been created and the `ReplayBuffer` has been flushed.

`function({Object} request)`

### Event 'abort'
Emitted when a pending connect or active request is aborted.

### Event 'response'
Emitted after the response headers have been received.

`function({Object} response)`

### Event 'warn'

`function({string} plugin, {string} status, {?string} opt_message)`

### Event 'error'

[back to top](#table-of-contents)

## Class: ReplayBuffer
The `ReplayBuffer` is used to buffer the request body in case of redirects, retries or other use-cases.

The plugin API offers [call.__buffer()](./plugin-api.markdown#call__buffer) to enable this buffer.

### new ReplayBuffer(opt_max)
Creates a new `ReplayBuffer` object.

  - `{number} opt_max` is the maximum size of all buffered chunks, defaults to `134217728` (128 MiB)

#### replayBuffer.max
The maximum number of bytes allowed to buffer.

#### replayBuffer.length
The current number of bytes buffered.

#### replayBuffer.buffer
A boolean _controlling_ if the buffer is active or in streaming mode.

#### replayBuffer.ended
A boolean indicating if the buffer accepts more data.

#### replayBuffer.bailout
A boolean indicating that the buffer size is exceeding the maximum allowed size.

### replayBuffer.pipe(writable, opt_callback)
Copy buffered chunks to `writable` using `replayBuffer.replay()` and relay all future chunks to `writable`.

### replayBuffer.unpipe(writable)

### replayBuffer.push(chunk)
Push a new chunk to the buffer.

Throws an error when the buffer has already `ended`.
Returns `false` when the buffer size exceeds `max`, otherwise `true`.

### replayBuffer.replay(writable, callback)
_Copy_ all buffered chunks to `writable`.

### replayBuffer.dump()
Empties the buffer and sets `replayBuffer.buffer` to `false`.

### replayBuffer.end()
Prevents further additon of chunks and clear the writable stream.

### Event: 'end'

[back to top](#table-of-contents)
