# [RAIL](../README.markdown) Plugin API

## Table of Contents

  - [RAIL Plugin Events](#rail-plugin-events)
  - [Interceptable Events](#interceptable-events)
  - [Request Management](#request-management)

## Basics

  - Methods beginning with two underscores `__` are defined as plugin API

## Example

```js
function myPlugin(rail, opt_options) {
  opt_options = opt_options || {};

  var pluginOptions = {

  };


  function interceptResponse(call, options, response) {
    // do something async
    //   ... then
    call.__emit('response', response);
  }


  rail.on('plugin-response', function(call, options, response) {
    if (options.my) {
      call.__intercept('response', interceptResponse);
    }
  });

  return pluginOptions;
}
module.exports = myPlugin;
```

## RAIL Plugin Events

These events are emitted on the `RAIL` object.

### Event: 'plugin-call'
Emitted when a new `Call` object is created.

`function({Call} call, {?Object=} opt_options)`

### Event: 'plugin-configure'
Emitted after a new configuration has been pushed onto the stack.

`function({Call} call, {Object} options)`

### Event: 'plugin-send-buffer'
Emitted right before a request object is created and the buffer is _flushed_ to the `request` object.

`function({Call} call, {Object} options, {ReplayBuffer} buffer)`

_Note_: A call to `__buffer()` is required to enable this event.

### Event: 'plugin-request'
Emitted directly after a request object has been created.

`function({Call} call, {Object} options, {Request} request)`

### Event: 'plugin-response'
Emitted when response headers have been received.

`function({Call} call, {Object} options, {Response} response)`

## Interceptable Events
Specific events emitted on the `Call` object can be intercepted.
These _interceptable events_ are designed to gain complete control over the request workflow and allow implementing even non-trivial & asynchronous features as a plugin.

As an example for such a non-trivial feature see the [redirect plugin](../lib/plugins/redirect.js).

### call.\_\_emit(event, var_args)
Invokes the next pending interceptor or emits the event.

On each call to `__emit()` only one interceptor is invoked. This way plugins can _blackhole_ responses by not calling `__emit()`. Creating a new request is obligatory in these cases.

### call.\_\_intercept(event, interceptor)
Registers an interceptor `function({Call} call, {Object} options, {*} object)` for an event.

### call.\_\_clear()
Removes all registered interceptors.

### Event: 'request'
Emitted one tick after the request object has been created.

### Event: 'response'
Emitted after the response headers have been received.

### Event: 'error'
Emitted on an error in context of a request.

## Request Management
All request configurations are stored in `call._stack`, the current configuration is referenced by `call._pointer`.

### call.\_\_configure(options)
Creates a new request configuration from the given options and increments the internal pointer.

_Note_: Request options are _copied_, plugin options are _referenced_ when not primitive.

### call.\_\_buffer()
Enables the `plugin-send-buffer` event using a `ReplayBuffer`.

Returns `true` on success, `false` otherwise.

### call.\_\_request()
Create a request object when no request is pending and a configuration is available. When no configuration is available, a _non-interceptable_ error is emitted.

Returns `true` when a request is pending, the newly created `request` object otherwise.
