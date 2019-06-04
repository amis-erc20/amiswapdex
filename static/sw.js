importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/09b2d669ef6285127e65.js",
    "revision": "313f4f8911185b55b93e1d415218cccd"
  },
  {
    "url": "/_nuxt/1114bd80f2d16f49ec28.js",
    "revision": "947e503e80b99fb9b23a12dfc5077691"
  },
  {
    "url": "/_nuxt/1c4ca38acd6482f4a91a.js",
    "revision": "a6ad563d9aa9b0bbdb761410becbee96"
  },
  {
    "url": "/_nuxt/242aa48ccb78ef425bba.js",
    "revision": "04fa4e34c2567b35bd64b2970b0abf2b"
  },
  {
    "url": "/_nuxt/2dac5912451855d9f538.js",
    "revision": "fa99053f75c6f6b169e7ba6663fcc53c"
  },
  {
    "url": "/_nuxt/3f8031cc28f7033c11a5.js",
    "revision": "8d7d9645a5fe3d8c3b37d6182b3b9154"
  },
  {
    "url": "/_nuxt/3febd3619b5ac2b22f2d.js",
    "revision": "c64b3dd7b581d0cac5e7a37cca645ee6"
  },
  {
    "url": "/_nuxt/44e1fca15d67ae9a884c.js",
    "revision": "80e9f5ae7799e56d9f1c63255daed65f"
  },
  {
    "url": "/_nuxt/4c7891e7e9191463257d.js",
    "revision": "16ac429a3ac38e850786f31e9e680083"
  },
  {
    "url": "/_nuxt/4da928fa43d33cce0353.js",
    "revision": "183a3daf3a204add91291b6c1ec3901b"
  },
  {
    "url": "/_nuxt/52bab6b75b2d38076c67.js",
    "revision": "d50f1851789ff899ee2c8246c2c45d5b"
  },
  {
    "url": "/_nuxt/57e2793ae33a56aacaee.js",
    "revision": "b765809dcc9556bc4a015cdf16fa1a64"
  },
  {
    "url": "/_nuxt/610c0b9672148332acc6.js",
    "revision": "911aaadf954f829e94d1c496f07625fe"
  },
  {
    "url": "/_nuxt/74c253f339bdb17a11df.js",
    "revision": "82fea45a886dc0d7f2fc90b30d86a631"
  },
  {
    "url": "/_nuxt/7b11db954f16e8a0c401.js",
    "revision": "d9a7325c8b44d5a76393421a8b8692c2"
  },
  {
    "url": "/_nuxt/90367a70f82a1e0db03d.js",
    "revision": "9e0cfc0166fe1e0e732c027e6a0715c4"
  },
  {
    "url": "/_nuxt/943ae63c6219116d6413.js",
    "revision": "d141d1da76621d8fbc110f635bbac6e0"
  },
  {
    "url": "/_nuxt/94902ff1261c8f5bf16f.js",
    "revision": "46b67796acd0698f1773193e07fbc401"
  },
  {
    "url": "/_nuxt/a0c23eea6cc43ae7fce4.js",
    "revision": "eab25b4a7342e7b1a8d5780865b29387"
  },
  {
    "url": "/_nuxt/a40c07e5f89b94aef57d.js",
    "revision": "beeb3b218c2b31f9c1e6f3eeda32d75a"
  },
  {
    "url": "/_nuxt/c3948c160713d815db2e.js",
    "revision": "f449d537e32d9c66976f396c5705a4f6"
  },
  {
    "url": "/_nuxt/c5bb0618958400fc5c71.js",
    "revision": "ed066335623deea066601a2aa7f63fa6"
  },
  {
    "url": "/_nuxt/cc6367179c26db16af7b.js",
    "revision": "4084498fef527cb25aa0629d33b67467"
  },
  {
    "url": "/_nuxt/d3d8a42b239fd3e2fc9c.js",
    "revision": "d8b81858c875fe5cc7daacb3887f683f"
  },
  {
    "url": "/_nuxt/df1732c9e4f50710820f.js",
    "revision": "60c0008f569557ee3e37740c2801d8ac"
  },
  {
    "url": "/_nuxt/e8d321f0f8fc4c39ffb1.js",
    "revision": "6e10ef13bf4b03d7de3a83f6bbdcff09"
  },
  {
    "url": "/_nuxt/fd4b1cd1a83efa755bf3.js",
    "revision": "97a2661c450726902fed6592aa366bce"
  },
  {
    "url": "/_nuxt/fd5ae787aa0095792ed0.js",
    "revision": "1499adf763a1afc55307ddbd37da49c6"
  }
], {
  "cacheId": "uniswapdex",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
