# rail

[![NPM version](https://img.shields.io/npm/v/rail.svg?style=flat-square)](https://www.npmjs.com/package/rail)
[![Build Status](https://secure.travis-ci.org/skenqbx/rail.png)](http://travis-ci.org/skenqbx/rail)

**_An enhanced HTTP/RESTful API Client_**

_rail_ is an io.js/node.js HTTP client supporting https, http and [http2](https://www.npmjs.com/package/http2).

A set of built-in plugins, currently featuring [`buffer`](./doc/plugins.markdown#buffer), [`cookies`](./doc/plugins.markdown#cookies), [`json`](./doc/plugins.markdown#json), [`redirect`](./doc/plugins.markdown#redirect), [`retry`](./doc/plugins.markdown#retry), [`timeout`](./doc/plugins.markdown#timeout) & [`validate`](./doc/plugins.markdown#validate) simplify making requests,
and a powerful event-driven plugin interface aids in the implementation of complex automated RESTful API calls.

The concept of _a single request_ is extended to _a possible series of requests_ further referenced as a _call_.
This allows a seamless integration of redirect and authentication mechanisms that require multiple requests to satisfy the original one.

The API is mostly compatible with `https.request()` and allows _rail_ to be used as a [_drop-in replacement_](#use-as-a-drop-in-replacement).
A completely _transparent_ plugin integration enables scenarios with automated retries on _upload_ stream errors, while still exhibiting a behavior similar to `https.request()`.

_rail_ works with [io.js](https://iojs.org/), [node.js](https://nodejs.org/) 0.10.x & 4.1.

## Table of Contents

  - [Installation](#installation)
  - [Examples](#examples)
    - [URL Only](#url-only)
    - [URL & Plugin Options](#url--plugin-options)
    - [Request & Plugin Options](#request--plugin-options)
    - [Custom Client](#custom-client)
  - [Use as a drop-in replacement](#use-as-a-drop-in-replacement)
  - [Plugins](./doc/plugins.markdown)
  - [API](./doc/api.markdown)
  - [Plugin API](./doc/plugin-api.markdown)
  - [Tests](#tests)
  - [ChangeLog](./CHANGELOG.markdown)
  - [License](./LICENSE)

## Installation

```
$ npm install rail --save-exact
```

## Examples

### URL only
Directly pass an URL that gets parsed into `proto`, `host`, `port` & `path`.

```js
var RAIL = require('rail');

RAIL.call('https://www.github.com/skenqbx/rail', function(response) {
  // consume response
}).end();
```

[back to top](#table-of-contents)

### URL & Plugin Options
Again, only pass an URL, but this time as a property to allow passing of plugin options.

```js
var RAIL = require('rail');

RAIL.call({
  url: 'https://www.github.com/skenqbx/rail',
  buffer: true
}, function(response) {
  if (response.buffer) {
    console.log(response.buffer.toString());
  }
}).end();
```

[back to top](#table-of-contents)

### Request & Plugin Options
The usual way of supplying every parameter separately.

```js
var RAIL = require('rail');

RAIL.call({
  host: 'www.github.com',
  path: '/skenqbx/rail',
  buffer: true
}, function(response) {
  if (response.buffer) {
    console.log(response.buffer.toString());
  }
}).end();
```

[back to top](#table-of-contents)

### Custom Client

A custom client allows to define default options and configure a set of plugins for all _calls_ made with that client.

```js
var RAIL = require('rail');

var client = new RAIL({
  // set default request options
  request: {
    host: 'github.com'  // set default host
  },
  // load & configure the buffer plugin
  buffer: {
    default: true // buffer all repsonses by default
  },
  // load & configure the json plugin
  json: {
    auto: true // try to parse all reponses with content-type equal to application/json
  },
  // load & configure the redirect plugin
  redirect: {
    limit: 3 // allow a maximum of three redirects for each call
  }
});

// load custom "my" plugin
client.use('my', MyPlugin/*, pluginOptions */);
```

Now use the custom client the same way as the globalClient above

```js
var call = client.call({
  path: '/skenqbx/rail'
}, function(response) {
  // check if we got a json response
  if (response.json) {
    console.log(response.json);

  // alternatively use the raw response body
  } else if (response.buffer) {
    console.log(response.buffer.toString());

  // ... or if a bailout happend (buffer max size exceeded)
  } else if (response.buffer !== null) {
    // consume the response
    response.on('readable', function() { /* ... */ });
    response.on('end', function() { /* ... */ });
  }
});

call.on('error', function(err) { /* ... */ });

call.end();
```

[back to top](#table-of-contents)

## Use as a drop-in replacement
_rail_ does **not** support the `hostname`, `auth`, `localAddress` & `socketPath` options, see [rail.call()](./doc/api.markdown#railcallopt_options-opt_responselistener) for more information.

When **not** using **https**, make sure to set the correct default protocol

```js
var RAIL = require('rail');
RAIL.globalClient.proto = 'http';
```
... and then replace every call to `http.request` with `RAIL.call`.

_Alternatively_ create a [custom client](#custom-client) with defaults & [plugins](./doc/plugins.markdown) configured to your needs.

[back to top](#table-of-contents)

## Tests

  - **npm run lint** Lint the code using [eslint](https://www.npmjs.com/package/eslint) and these [rules](./.eslintrc)
  - **npm test** Lint the code, run tests with [mocha](https://www.npmjs.com/package/mocha) & collect coverage with [istanbul](https://www.npmjs.com/package/istanbul)
    - detailed coverage report is available at `coverage/lcov-report/index.html`
  - **npm run update** Dependency update tests performed by [next-update](https://www.npmjs.com/package/next-update)
  - run `./tools/cross-test.sh` to test all relevant io.js/node.js versions, uses [nvm](https://github.com/creationix/nvm/)

### Coverage

```
Statements   : 98.03% ( 796/812 )
Branches     : 91.04% ( 376/413 )
Functions    : 100% ( 108/108 )
Lines        : 98.03% ( 796/812 )
```

[back to top](#table-of-contents)
