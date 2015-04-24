# [rail](../README.markdown) Plugin API

The `RAIL` object emits `plugin-*` events that correspond to different states of a single request inside a call.
These events enable plugins to monitor the state of a request, as well as modify the request configuration and when necessary intercept _user_ events on the `Call` object.

The `Call` object provides a plugin interface for interception of _user_ events & request management.

All methods for the plugin interface begin with two underscores `__`.

## Table of Contents

  - [Plugin Events](#plugin-events)
  - [Interceptable Events](#interceptable-events)
  - [Request Management](#request-management)

## Example
A _class_ implementing a very simple plugin that emits `my` event every time a request configuration has been created.

```js
function MyPlugin(rail, options) {
  if (!(this instanceof MyPlugin)) {
    return new MyPlugin(rail, options);
  }
  this._rail = rail;

  this._setup();
}
module.exports = MyPlugin;


MyPlugin.prototype._setup = function() {
  var self = this;
  var rail = this._rail;

  rail.on('plugin-configure', function(call, options) {
    if (options.my) {
      call.emit('my', 'works!');
    }
  });
};
```

[back to top](#table-of-contents)

## Plugin Events

These events are emitted on the `RAIL` object.

### Event: 'plugin-call'
Emitted when a new `Call` object is created.

`function({Call} call, {Object} options)`

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

[back to top](#table-of-contents)

## Interceptable Events
Specific events emitted on the `Call` object can be intercepted.
These _interceptable events_ are designed to gain complete control over the request workflow and allow implementing even non-trivial & asynchronous features as a plugin.

As an example for such a non-trivial feature see the [redirect plugin](../lib/plugins/redirect.js).

### call.\_\_emit(event, var_args)
Invokes the next pending interceptor or emits the event.

On each call to `__emit()` only one interceptor is invoked. This way plugins can _blackhole_ responses by not calling `__emit()`. Creating a new request is obligatory in these cases.

### call.\_\_intercept(event, interceptor)
Registers an interceptor for an event.

### call.\_\_clear()
Removes all registered interceptors.

### Event: 'request'
Emitted after the request object has been created and the send-buffer has been flushed.

`function({Call} call, {Object} options, {Object} request)`

### Event: 'response'
Emitted after the response headers have been received.

`function({Call} call, {Object} options, {Object} response)`

### Event: 'error'
Emitted on an error.

`function({Error} err)`

[back to top](#table-of-contents)

## Request Management
All request configurations are stored in `call._stack`, the current configuration is referenced by `call._pointer`.

### call.\_\_configure(options)
Creates a new request configuration from the given options and increments the internal pointer.

_Note_: Request options are _copied_, plugin options are _referenced_ when not primitive.

### call.\_\_buffer()
Enables the `plugin-send-buffer` event using a `ReplayBuffer`.

Returns `true` on success or when buffering is already enabled, `false` otherwise.

### call.\_\_request(opt_callback)
Create a request object when no request is pending and a configuration is available. When no configuration is available, a _non-interceptable_ error is emitted.

  - `{function({?Error} err, {?Object=} request)} opt_callback` Called after the request object has been created and the send-buffer has been flushed, a possible connect error is passed to the callback _(that error has already been emitted)_

Returns `true` when a request is pending, the newly created `request` object otherwise.

### call.\_\_abort(opt_reason)
Aborts the current request and response, if any.

_Note_: An _interceptable_ `error` is very likely to be emitted after a call to `__abort()`.

[back to top](#table-of-contents)
