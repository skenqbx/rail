# [RAIL](./README.markdown) ChangeLog

## 2015-04-22, [v0.2.0](https://github.com/skenqbx/rail/tree/v0.2.0) **_<small>unstable</small>_**

### Notable changes

  - **plugin-send-buffer**: A new plugin event to inspect the complete _request_ body & modify the configuration before that request is created and send
  - **globalClient**: A default client object allows calls out-of-the-box using `RAIL.call()`
  - **URL**: An URL can be passed directly to `rail.call()`
  - **doc**: A ton of documentation has been added

### Known issues

  - **servername**: The pending node.js issue [#9368](https://github.com/joyent/node/pull/9368) requires to set `agent=null` when using the `servername` option (affects all versions of node.js).

### Commits

  - [[`3bf59bccc8`](https://github.com/skenqbx/rail/commit/3bf59bccc8fedc1f583930bd5188c6f80af09642)] - **call**: `end()` always returns `this`
  - [[`a96dea97d7`](https://github.com/skenqbx/rail/commit/a96dea97d75f8417993c56513272dcf0c5656802)] - **call**: rename vars for consistency
  - [[`2ded40a574`](https://github.com/skenqbx/rail/commit/2ded40a5745733e548eaa81a76865564a0cf49ef)] - **call**: allow passing of url
  - [[`9bc657bc58`](https://github.com/skenqbx/rail/commit/9bc657bc585b0598db43bf341b9b7d48da78d92f)] - **deps**: lru-cache 2.6.1
  - [[`7b3daf3c4b`](https://github.com/skenqbx/rail/commit/7b3daf3c4b0e30c7e35e967e22f5ab4d8e4df5c6)] - **deps**: changelog42 (dev)
  - [[`222f61414f`](https://github.com/skenqbx/rail/commit/222f61414fd07a2aa51f882c2d520817469e9d27)] - **doc**: updates
  - [[`fbb98653a6`](https://github.com/skenqbx/rail/commit/fbb98653a61002a208b0fd8291f35099207df6ea)] - **doc**: request management & cleanup
  - [[`882bbef690`](https://github.com/skenqbx/rail/commit/882bbef6909599a7f8f72eeb789a8483ebc1aff5)] - **doc**: install
  - [[`783085adfb`](https://github.com/skenqbx/rail/commit/783085adfb79d31bf3b58552e4841f81693bb345)] - **doc**: add NPM badge
  - [[`26965dc7d3`](https://github.com/skenqbx/rail/commit/26965dc7d32b554e89bbbfbc2bb852a90d536ab0)] - **doc**: words
  - [[`abb81eb642`](https://github.com/skenqbx/rail/commit/abb81eb642e621214896917de351c0e02e64a8ba)] - **doc**: reorganize & add better examples
  - [[`6dbbdd6a41`](https://github.com/skenqbx/rail/commit/6dbbdd6a41ebc029bf1a29e695aee4cd5598544b)] - **doc/README**: more API
  - [[`a232966c03`](https://github.com/skenqbx/rail/commit/a232966c03118dcaabacce5d32315c23bce8256c)] - **doc/README**: API
  - [[`08c8246b3c`](https://github.com/skenqbx/rail/commit/08c8246b3c4845d6236dffad54ae10b74928383b)] - **doc/api**: add properties & methods for Call instances
  - [[`d42c887c0d`](https://github.com/skenqbx/rail/commit/d42c887c0d89ee63fd3c9e5b44aa6952f296b3b1)] - **doc/plugin-api**: clarify __emit()
  - [[`b0b7aff4b8`](https://github.com/skenqbx/rail/commit/b0b7aff4b86ba22e0f720d4ed37b7de6a8b36153)] - **doc/plugin-api**: add `call.__request()`
  - [[`a432c053dd`](https://github.com/skenqbx/rail/commit/a432c053dd1884917e574ef4996dbd7089572741)] - **doc/plugin-api**: major overhaul
  - [[`09d9df6b08`](https://github.com/skenqbx/rail/commit/09d9df6b087c09a56c7c5b026543267bcaaa64cb)] - **lib**: add globalClient
  - [[`1d3b06719d`](https://github.com/skenqbx/rail/commit/1d3b06719d1ffc6fae9f9f16ea0563e69e90a8f9)] - **lib**: remove unused require
  - [[`f72b486c20`](https://github.com/skenqbx/rail/commit/f72b486c2072028f46ce8fd59acabf5acc703fd9)] - **lib**: rename send-buffer to replay-buffer
  - [[`3660b3b8fe`](https://github.com/skenqbx/rail/commit/3660b3b8fe4c66947cb0bedb9da6a7cfd9fd16eb)] - **package**: add changelog script
  - [[`0d75f4fc70`](https://github.com/skenqbx/rail/commit/0d75f4fc7023508de9632939cfed47c413c25c67)] - **plugins**: cleanup
  - [[`0d68c38974`](https://github.com/skenqbx/rail/commit/0d68c3897409423b383a8640b3406cf63370f0b0)] - **send-buffer**: initial implementation/integration
  - [[`7f8485a950`](https://github.com/skenqbx/rail/commit/7f8485a950aab360a45357b809584e82f216abf5)] - **send-buffer**: final touches
  - [[`6ed9e1979d`](https://github.com/skenqbx/rail/commit/6ed9e1979dda7d4a40f185dc923afba82c34c4c9)] - **test**: fix readable event for node.js 0.12


## 2015-04-21, [v0.1.0-alpha](https://github.com/skenqbx/rail/tree/v0.1.0-alpha) **_<small>unstable</small>_**

First release.
