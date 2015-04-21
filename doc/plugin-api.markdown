# RAIL Plugin API


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

`function(Call, ?Object=)`

### Event: 'plugin-configure'
Emitted after a new request configuration has been pushed onto the stack.

`function(Call, Object)`

### Event: 'plugin-request'
Emitted directly after the request object has been created.

`function(Call, Object, Request)`

### Event: 'plugin-response'
Emitted when the response headers have been received.

`function(Call, Object, Response)`

## Interceptable Events
Specific events emitted on the `Call` object can be intercepted.
These _interceptable events_ are designed to gain complete control over the request workflow and allow implementing even non-trivial & asynchronous features as a plugin.

As an example for such a non-trivial feature see the [redirect plugin](../lib/plugins/redirect.js).

The methods beginning with two underscores `__` are defined as plugin interface.

### call.\_\_emit(event, var_args)
Invokes the next pending interceptor or emits the event.

On each call to `__emit()` only one interceptor is invoked. This way plugins can _blackhole_ responses by not calling `__emit()`. Creating a new request is obligatory in these cases.

### call.\_\_intercept(event, interceptor)
Registers an interceptor `function(Call, Object, *)` for an event.

### call.\_\_clear()
Removes all registered interceptors.

### call.\_\_request()
Create a request object when no request is pending and a configuration is available. When no configuration is available, a _non-interceptable_ error is emitted.

Returns `true` when a request is pending, otherwise the newly created `request` object.

### Event: 'request'
Emitted one tick after the request object has been created.

### Event: 'response'
Emitted after the response headers have been received.

### Event: 'error'
Emitted on an error in context of a request.
