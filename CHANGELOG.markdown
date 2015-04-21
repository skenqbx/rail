# [RAIL](./README.markdown) ChangeLog

## 2015-04-XX, [v0.2.0-alpha](https://github.com/skenqbx/rail/tree/v0.2.0-alpha) **_<small>unstable</small>_**

### Notable changes

  - **globalClient**: The addition of a globalClient enables calls without instantiating a client
  - **URL**: An URL can now be passed directly to `rail.call()`

### Known issues

  - **servername**: The pending node.js issue [#9368](https://github.com/joyent/node/pull/9368) requires to set `agent=null` when using the `servername` option (affects all versions of node.js).

## Commits

## 2015-04-21, [v0.1.0-alpha](https://github.com/skenqbx/rail/tree/v0.1.0-alpha) **_<small>unstable</small>_**

First release.
