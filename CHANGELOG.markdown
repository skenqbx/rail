# [rail](./README.markdown) ChangeLog

## 2015-04-23, [v0.3.0](https://github.com/skenqbx/rail/tree/v0.3.0) **_<small>unstable</small>_**

_rail_ is ready for some _real-world_ aka. production testing. All _public_ API's are documented and
the plugin interface is _generally stable (besides one or two timing issues)_.

### Notable changes

  - Response & socket timeout _detection_ with the **timeout plugin**
  - The **validate plugin** adds response header & JSON body validation realized with [mgl-validate](https://www.npmjs.com/package/mgl-validate)
  - Addition of a call/request **abort mechanism**; Use `call.abort()` or `call.__abort(opt_reason)` for plugins
  - **retry plugin**: Experimental _retry_ support for connect errors

### Commits

  - [[`8e21193b03`](https://github.com/skenqbx/rail/commit/8e21193b03d8d2e1357ddb2116f7f6c0a5f89d20)] - **call**: better handle connection errors
  - [[`1aa7841048`](https://github.com/skenqbx/rail/commit/1aa784104876503a903d6576205fb5c49d643b76)] - **call**: add abort mechanism
  - [[`8d12bfeb7d`](https://github.com/skenqbx/rail/commit/8d12bfeb7ddd1a1b76e7b1249311a928ee300653)] - **call**: add support for keepAlive & keepAliveMsecs options
  - [[`b2ab7182f9`](https://github.com/skenqbx/rail/commit/b2ab7182f9990efc66e206b593e7e6c6f4621522)] - **call**: remove unused property
  - [[`67564e96b1`](https://github.com/skenqbx/rail/commit/67564e96b15626cb6faa7a19d0f49c4f618e820b)] - **call**: move plugin interface to top
  - [[`552091de14`](https://github.com/skenqbx/rail/commit/552091de14d08b2dae0cbdee163f20502ac4fc91)] - **call**: fix `__buffer()` return value
  - [[`b7c33d7f40`](https://github.com/skenqbx/rail/commit/b7c33d7f408b4a60c00c921ba65f9ee914dfa49a)] - **deps**: changelog42 git -> 0.3.0 (dev)
  - [[`beb13cbca0`](https://github.com/skenqbx/rail/commit/beb13cbca0f31f943d78a73f8846448af9e97992)] - **doc**: add more
  - [[`bf25e6fcf2`](https://github.com/skenqbx/rail/commit/bf25e6fcf2fc322bddba9056b2230da2336a36c5)] - **doc**: minor updates
  - [[`96b441b0f6`](https://github.com/skenqbx/rail/commit/96b441b0f6843225f05a74477e1a005cc38c542f)] - **doc**: fix
  - [[`1dbd73f95b`](https://github.com/skenqbx/rail/commit/1dbd73f95bc31cfd7f437099d919a4c77fcc299e)] - **doc**: add validate plugin
  - [[`7341e7ff62`](https://github.com/skenqbx/rail/commit/7341e7ff62bf325b41916b8dab7ab99a092266cf)] - **doc**: back to top
  - [[`2a312967c8`](https://github.com/skenqbx/rail/commit/2a312967c832e41192ae4700331099987adcb291)] - **doc**: s/Install/Installation
  - [[`b68c1d2604`](https://github.com/skenqbx/rail/commit/b68c1d2604274291cc459015e9f2883852dccf43)] - **doc**: clarifications
  - [[`e5fde54ba3`](https://github.com/skenqbx/rail/commit/e5fde54ba3d0cd0b4404f605d571a1033307af9d)] - **doc**: sanitize example
  - [[`945b426418`](https://github.com/skenqbx/rail/commit/945b426418d883ce4c763b75e2a6090117a33d73)] - **doc**: add devDependencies badge
  - [[`7d5fc7899a`](https://github.com/skenqbx/rail/commit/7d5fc7899a6c57328b543c8a5e558aecc162695f)] - **doc/README**: intro & coverage
  - [[`212d9a83ef`](https://github.com/skenqbx/rail/commit/212d9a83ef2fe6ece5598535ac1f2036b31b41bc)] - **doc/README**: update intro & add drop-in replacement
  - [[`ca24c5b504`](https://github.com/skenqbx/rail/commit/ca24c5b50451b7dbfde3d69d6fb24d43bb7a4753)] - **doc/README**: add examples to toc
  - [[`317fb04914`](https://github.com/skenqbx/rail/commit/317fb04914cc51b0c3df231ef0934030614e3f2c)] - **doc/README**: add words to examples
  - [[`7d4e2115ee`](https://github.com/skenqbx/rail/commit/7d4e2115eefdfd56d1b50bbdbc08984cd2c67fe1)] - **doc/api**: add table of contents
  - [[`b55498539e`](https://github.com/skenqbx/rail/commit/b55498539ecab6cf76a631785793d7551e350750)] - **doc/plugins**: fix retry event
  - [[`7140c7f115`](https://github.com/skenqbx/rail/commit/7140c7f11586cfa3ba38fae14f51c8c7e3c80bcd)] - **globalClient**: pre-load timeout plugin
  - [[`43b7711a7f`](https://github.com/skenqbx/rail/commit/43b7711a7fc160a181d8fa6804f93db2d1ffb6df)] - **globalClient**: pre-load validate plugin
  - [[`4912088ead`](https://github.com/skenqbx/rail/commit/4912088ead51b729860f8d46ebc9dd7be7dcec93)] - **plugins**: fixes
  - [[`e49dd98c63`](https://github.com/skenqbx/rail/commit/e49dd98c63cf253ba3c2f713296745f2e37284dd)] - **plugins**: update & disable not implemented plugins
  - [[`38ad72a941`](https://github.com/skenqbx/rail/commit/38ad72a9415ffbe0c226f5c1077b02a215b80de5)] - **plugins/buffer**: update constructor
  - [[`6d00ca7765`](https://github.com/skenqbx/rail/commit/6d00ca776559158de952d68388d234f246becab6)] - **plugins/cookies**: rewrite as class
  - [[`9ccda3c03f`](https://github.com/skenqbx/rail/commit/9ccda3c03fb8c0a4d44bc344e908e81c15cbeca9)] - **plugins/json**: rewrite as class
  - [[`2cc2e94e30`](https://github.com/skenqbx/rail/commit/2cc2e94e301923a7485f179fe54e8bf0ec0bee0b)] - **plugins/retry**: see doc/plugins.markdown
  - [[`c0e52bc533`](https://github.com/skenqbx/rail/commit/c0e52bc533448cfac922385d823e10005d12d6e9)] - **plugins/timeout**: release response timeout on error
  - [[`43df26f3f3`](https://github.com/skenqbx/rail/commit/43df26f3f3d096d32f05cef6690df925d6661e1b)] - **plugins/timeout**: response & socket timeout detection
  - [[`755fdcf619`](https://github.com/skenqbx/rail/commit/755fdcf619b4757c472312702eb5b65843bc7f00)] - **plugins/validate**: update API, test & doc
  - [[`8eb1551ed7`](https://github.com/skenqbx/rail/commit/8eb1551ed75316156d2efa82a59cbd63cec5a082)] - **plugins/validate**: headers & body validation
  - [[`9e199de81f`](https://github.com/skenqbx/rail/commit/9e199de81fab04214e6d7df6852b151505f5cdd6)] - **rail**: plugin options now default to an empty object
  - [[`259b01ec06`](https://github.com/skenqbx/rail/commit/259b01ec06c05cdd6956cbefdbcd7fac8ef1dc5e)] - **replay-buffer**: remove unused requires
  - [[`42634f535f`](https://github.com/skenqbx/rail/commit/42634f535f4074f34c87c38fd9c60b17636548c5)] - **replay-buffer**: fix duff's device
  - [[`2432c70ada`](https://github.com/skenqbx/rail/commit/2432c70ada549867b178186743360f0f994f5594)] - **test**: add retry plugin tests
  - [[`d8c2012f08`](https://github.com/skenqbx/rail/commit/d8c2012f08fca4e24269c702d69b62ac5817dbdf)] - **test**: fix validate test for io.js
  - [[`537e9ba1e0`](https://github.com/skenqbx/rail/commit/537e9ba1e0af15b53864200cef0b347a6162f713)] - **test**: better send-buffer test


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
