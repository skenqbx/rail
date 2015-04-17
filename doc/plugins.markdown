# RAIL Plugins


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

### 'plugin-call'

`function(Call, ?Object=)`

### 'plugin-configure'

`function(Call, Object)`

### 'plugin-request'

`function(Call, Object, Request)`

### 'plugin-response'

`function(Call, Object, Response)`

## Interceptable Events

### 'request'

### 'response'

### 'error'
