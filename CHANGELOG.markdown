# [rail](./README.markdown) ChangeLog

## 2015-07-29, [v0.6.6](https://github.com/skenqbx/rail/tree/v0.6.6) **_<small>unstable</small>_**

### Commits

  - [[`d5ec31aeb5`](https://github.com/skenqbx/rail/commit/d5ec31aeb5fd75aa163240eeb2f9c8ed01d234cc)] - **doc/plugins**: document bailout state for exceeded buffer
  - [[`fbb20d2dfd`](https://github.com/skenqbx/rail/commit/fbb20d2dfda1afd95ac45e670d1263dd5de0d15f)] - **plugins.buffer**: fix test for maximum length && add ability to reattach listeners

## 2015-07-29, [v0.6.5](https://github.com/skenqbx/rail/tree/v0.6.5) **_<small>unstable</small>_**

### Commits

  - [[`ff19bab386`](https://github.com/skenqbx/rail/commit/ff19bab386b5b2c3296827e8a975ccec0fbb46ea)] - **plugins.buffer**: do not ignore `buffer:false` on request level


## 2015-07-28, [v0.6.4](https://github.com/skenqbx/rail/tree/v0.6.4) **_<small>unstable</small>_**

### Commits

  - [[`99b8169c20`](https://github.com/skenqbx/rail/commit/99b8169c20d4f5a0b28bf5a558c3df7a6fea8944)] - **json**: handle application/json media-types containing parameters


## 2015-05-08, [v0.6.3](https://github.com/skenqbx/rail/tree/v0.6.3) **_<small>unstable</small>_**

### Commits

  - [[`225eee008b`](https://github.com/skenqbx/rail/commit/225eee008b1d4d1cd0c4241448d817e69b1a8080)] - **call**: fix __abort() timing issue


## 2015-05-07, [v0.6.2](https://github.com/skenqbx/rail/tree/v0.6.2) **_<small>unstable</small>_**

### Commits

  - [[`f2ccecdf50`](https://github.com/skenqbx/rail/commit/f2ccecdf50897bdc2a0aa9f81cf2c677a7587116)] - **call**: fix write on error
  - [[`b467b09d88`](https://github.com/skenqbx/rail/commit/b467b09d8894d4fbe416123d609f2390d2bf587e)] - **package**: npm 2.9.0


## 2015-04-29, [v0.6.1](https://github.com/skenqbx/rail/tree/v0.6.1) **_<small>unstable</small>_**

### Commits

  - [[`1bbdb9092a`](https://github.com/skenqbx/rail/commit/1bbdb9092a0874632c9e3478c6cff604e78c1150)] - **call**: fix write() for active request
  - [[`8a61521d20`](https://github.com/skenqbx/rail/commit/8a61521d20b5aaf3e42c590db063874ad50366cc)] - **doc**: fix typos


## 2015-04-27, [v0.6.0](https://github.com/skenqbx/rail/tree/v0.6.0) **_<small>unstable</small>_**
### Notable changes

  - Add `maxReplayBuffer` option for `RAIL` and `Call` to control buffer size

### Commits

  - [[`254dd1b660`](https://github.com/skenqbx/rail/commit/254dd1b660b49ac2cad4e8118d046d1e5fcc8585)] - **call**: unpipe request on end/bailout
  - [[`b56b4a5a17`](https://github.com/skenqbx/rail/commit/b56b4a5a179b2bab8b7b1fd8245a5107ad335260)] - **deps**: mgl-validate 1.0.1
  - [[`4e00b06fdc`](https://github.com/skenqbx/rail/commit/4e00b06fdc4811210ff5eefa2e865fcbbecd93a6)] - **doc**: better custom client example and api additions
  - [[`1b9ff60ea6`](https://github.com/skenqbx/rail/commit/1b9ff60ea6c33152411218c696bd67daf749fbd2)] - **doc**: describe opt_max argument
  - [[`bc7c3a9535`](https://github.com/skenqbx/rail/commit/bc7c3a953523941cc78ab6de78da818d68477b5e)] - **rail, call**: add maxReplayBuffer option
  - [[`1e79d2617e`](https://github.com/skenqbx/rail/commit/1e79d2617efa51574010d0c18db55be446e56bde)] - **retry**: add 504 to default retry codes
  - [[`8ba0ce71dd`](https://github.com/skenqbx/rail/commit/8ba0ce71dd14ed11ea47777aad83a18192be1938)] - **test**: add new replay-buffer bailout test


## 2015-04-26, [v0.5.0](https://github.com/skenqbx/rail/tree/v0.5.0) **_<small>unstable</small>_**
### Notable changes

  - Differences in io.js/node.js `request.abort()` API have been addressed; Additionally new **abort** & **plugin-abort** events have been added.
  - The **replay-buffer** has received _major aka. breaking_  improvements and is now fully tested & documented
  - **plugin-send-buffer** event has been **removed** in favor of a **plugin-replay-buffer** event to better expose the new replay-buffer API
  - A new **configuration management** simplifies request configuration and corrects inheritance behaviour
  - An upgraded **retry plugin** now supports retries on **validation** failures and http **status codes**

### Commits

  - [[`ce523fa891`](https://github.com/skenqbx/rail/commit/ce523fa891da8dbb9ff52565b5ea028b241b431a)] - **call**: fix plugin-configure event
  - [[`e14ae0efb7`](https://github.com/skenqbx/rail/commit/e14ae0efb7b9b332939c3c78fe1c2afb7a90b8ec)] - **call**: close buffer before ending the stream
  - [[`36af6779ec`](https://github.com/skenqbx/rail/commit/36af6779ecde00f965db00cbeaa99f0948995d0b)] - **call**: refactor abort() to handle differences in node versions
  - [[`ad9137c6eb`](https://github.com/skenqbx/rail/commit/ad9137c6ebcdfe47ee2cd750574c196bf283417f)] - **call**: actually cleanup the send-buffer on abort
  - [[`960ce2d15a`](https://github.com/skenqbx/rail/commit/960ce2d15aab0657837b884d907b173251a488e1)] - **deps**: eslint 0.20.0
  - [[`d38075d13a`](https://github.com/skenqbx/rail/commit/d38075d13a4081349a57949878a9daef54061ca7)] - **deps**: changelog42 0.5.0
  - [[`7c7de2eef4`](https://github.com/skenqbx/rail/commit/7c7de2eef4bb3d55eb59ad97054c535f6bd50c55)] - **deps**: lru-cache 2.6.2
  - [[`f43a4d51b8`](https://github.com/skenqbx/rail/commit/f43a4d51b845a7df8ce71036c56abda63bb1e880)] - **doc**: typos & fixes
  - [[`93e5e4455c`](https://github.com/skenqbx/rail/commit/93e5e4455ce9e5888c0a7977c7d20728fc6a6d66)] - **doc**: update tests and add missing replay-buffer API
  - [[`35a71b4979`](https://github.com/skenqbx/rail/commit/35a71b49790e253277f6e24ccc33b3074787b842)] - **doc**: cleanup example & update tests
  - [[`cec05fdc74`](https://github.com/skenqbx/rail/commit/cec05fdc74f10bc58e94055df254ba3024938093)] - **doc**: add tools
  - [[`6d1625ae80`](https://github.com/skenqbx/rail/commit/6d1625ae805c8037ece87de174f9ead87cdcc2a6)] - **lib**: lint'd
  - [[`b542b74bd9`](https://github.com/skenqbx/rail/commit/b542b74bd92563b76b3514690c10075f1bdcc014)] - **lib**: new configuration management
  - [[`8fc4f167ef`](https://github.com/skenqbx/rail/commit/8fc4f167ef115f5a8c5451878812c525332e96f2)] - **package**: add tools to npmignore
  - [[`b54e681685`](https://github.com/skenqbx/rail/commit/b54e6816855385cc5746c4bbd52e722115200db5)] - **package**: update engines and scripts
  - [[`041bda66d6`](https://github.com/skenqbx/rail/commit/041bda66d63b9bcf1a260f0d2371a6d7ae8ab3d4)] - **package**: add new keywords
  - [[`8646b7d488`](https://github.com/skenqbx/rail/commit/8646b7d488be0802b295995db9319cda4077b4f6)] - **plugins**: wip
  - [[`06e83c3e82`](https://github.com/skenqbx/rail/commit/06e83c3e82f365dde8399f04b60fc690f39d82d8)] - **redirect**: add response to redirect event arguments
  - [[`914a0d5f30`](https://github.com/skenqbx/rail/commit/914a0d5f30ae7337924b674a228d8ebb3e9fd4ed)] - **redirect**: rewrite as class
  - [[`3cda5ae72c`](https://github.com/skenqbx/rail/commit/3cda5ae72ca217dfa6d1a29eab17dacd7b1a76de)] - **replay-buffer**: inherit EE plus end event and pipe & unpipe
  - [[`020c208581`](https://github.com/skenqbx/rail/commit/020c208581bd400deefff7bb2de8ff5ecddc155f)] - **replay-buffer**: allow writable streams to be replaced
  - [[`8f8c0fb128`](https://github.com/skenqbx/rail/commit/8f8c0fb12893368e2a5e77c4299eb2519b26554e)] - **reply-buffer**: upgrade, document & update affected plugins
  - [[`19df59c299`](https://github.com/skenqbx/rail/commit/19df59c299117784f969c49439a50d595e8910ef)] - **request-options**: un-support auth option
  - [[`1fd99987d5`](https://github.com/skenqbx/rail/commit/1fd99987d5180cc63b87a3938a8eb7f329624900)] - **retry**: remove obsolete error code check
  - [[`7f5e7b860a`](https://github.com/skenqbx/rail/commit/7f5e7b860af58607a327576f3f26a8d3faab623c)] - **retry**: support retry on status code
  - [[`3dbd78a550`](https://github.com/skenqbx/rail/commit/3dbd78a550056f71faae04506f94a35ead6e11ff)] - **retry**: support for validation triggered retries
  - [[`ceeee0afbc`](https://github.com/skenqbx/rail/commit/ceeee0afbc53d60ad3c32ff92d13a002616fac90)] - **retry**: add ECONNRESET support and remove obsolete argument
  - [[`a1f461b6c3`](https://github.com/skenqbx/rail/commit/a1f461b6c337cf2d85005a425f495619cea7dd13)] - **test**: fix redirect tests
  - [[`70fb672f89`](https://github.com/skenqbx/rail/commit/70fb672f89307edfa435a9022b7eca0e5d484ba2)] - **test**: adapt to new abort event
  - [[`17b31fbae4`](https://github.com/skenqbx/rail/commit/17b31fbae4befa68b071f301345c1fff5830ee40)] - **tools**: add cross-test.sh


## 2015-04-24, [v0.4.0](https://github.com/skenqbx/rail/tree/v0.4.0) **_<small>unstable</small>_**
### Notable changes

  - Use **custom plugins** with the upgraded `rail.use()`

### Commits
  - [[`6a325e2376`](https://github.com/skenqbx/rail/commit/6a325e2376adad4d73f9fed67821c7cb64875d94)] - **call**: update abort mechanism
  - [[`df2fc9954e`](https://github.com/skenqbx/rail/commit/df2fc9954ec60b3f123e68cdc2c5b128755cbe6e)] - **deps**: changelog42 0.3.0 -> 0.4.0
  - [[`8592de21a8`](https://github.com/skenqbx/rail/commit/8592de21a856ed886132f18e06138c9e15875890)] - **doc**: fix drop-in default protocol
  - [[`3785c454d8`](https://github.com/skenqbx/rail/commit/3785c454d82dfb0a903fa5fb37a9da84cfea2590)] - **rail**: add support for custom plugins to `rail.use()`
  - [[`e8b5e1dec4`](https://github.com/skenqbx/rail/commit/e8b5e1dec4c12702efd42b03fe230f1e48d728a2)] - **retry**: comment out unused code
  - [[`74e5eb2291`](https://github.com/skenqbx/rail/commit/74e5eb22913c7fcd6080a3c455ae01fde48e2bb9)] - **test**: extend retry, timeout & call tests


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

---

_The commit log is generated with [changelog42](https://www.npmjs.com/package/changelog42)._
