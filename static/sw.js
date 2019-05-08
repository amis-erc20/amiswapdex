importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/05498fb438ad510f7ffd.js",
    "revision": "8ae1445e482ec91f640e36c4082938b4"
  },
  {
    "url": "/_nuxt/080a3b81c453aa19546a.js",
    "revision": "1e45536ae4e7a93ef99172c1504039f7"
  },
  {
    "url": "/_nuxt/0b8b034f2d2fa949c1fd.js",
    "revision": "02c15a1485b7be12e4b5329ac8f350d5"
  },
  {
    "url": "/_nuxt/107a94b8d4ef396354d2.js",
    "revision": "57c6edb644790872705a0c65f45fb352"
  },
  {
    "url": "/_nuxt/19b0a6e26120f27e16e4.js",
    "revision": "c3af4f88058f72a9fae770b55dca3622"
  },
  {
    "url": "/_nuxt/22d5cd5585d947fb1b6d.js",
    "revision": "11793e9c89c4e4193400e9b1c1f823fe"
  },
  {
    "url": "/_nuxt/2cac392bbd098da2e408.js",
    "revision": "5ff36a1bd4189166f3a2d556de501a18"
  },
  {
    "url": "/_nuxt/45fa931a391223ea4437.js",
    "revision": "31f3633e05ce6f297957f9294ac4acce"
  },
  {
    "url": "/_nuxt/4fd2d637829c0efa1b14.js",
    "revision": "664249f3ae9b62c1cc48679e1ec65043"
  },
  {
    "url": "/_nuxt/5b12ea952c28201a21b3.js",
    "revision": "0b813a9b27786bfd50baa58e9592babe"
  },
  {
    "url": "/_nuxt/6242298ce90a4c65c168.js",
    "revision": "a672100e0be5b1214d6e7efd5c8c2bf5"
  },
  {
    "url": "/_nuxt/6b397397b808691d26bb.js",
    "revision": "321e9f6fcae46a967e10bb3ca714f57a"
  },
  {
    "url": "/_nuxt/738cb45e49f3fa763b51.js",
    "revision": "98b05d49227454e41277f026e64d4298"
  },
  {
    "url": "/_nuxt/73ca55d243fc7bbfd4b1.js",
    "revision": "0ed61619fbba98fd0f1852c0ba04e517"
  },
  {
    "url": "/_nuxt/752a3a2dc39871c8d56c.js",
    "revision": "5366c803acb3fae2e292125ebbbefde6"
  },
  {
    "url": "/_nuxt/79c649ddbf46afbe83e8.js",
    "revision": "8de1b2550786956337489018bb63ed8f"
  },
  {
    "url": "/_nuxt/7a8fc9526eaa99f66017.js",
    "revision": "673b98975aa6fd9a218b96bd2faaa6c8"
  },
  {
    "url": "/_nuxt/7b65b61d0fafb82aa50b.js",
    "revision": "a240d66667c661ba64213aefdccca570"
  },
  {
    "url": "/_nuxt/80ce045f7d7c8fe7a464.js",
    "revision": "8ac11182c9008b5bc5443f20efbb1c6b"
  },
  {
    "url": "/_nuxt/aa30abf9b5f5b18021b1.js",
    "revision": "6e31dfd134a6fcd62ad202d96c06018f"
  },
  {
    "url": "/_nuxt/dcee0636e6847dbd58c0.js",
    "revision": "f9f3bf46c6650a7305dfbf943f17a34c"
  },
  {
    "url": "/_nuxt/e34fcdb15e7e1ea92bad.js",
    "revision": "811fedbcc7a226dc0f3ae87ed7984902"
  },
  {
    "url": "/_nuxt/e439882cb40b993b95e4.js",
    "revision": "114bcf1cd9e0990d4fea74cc6762496e"
  },
  {
    "url": "/_nuxt/e67d2272669765a97840.js",
    "revision": "a4c8f7c780488a9dce198341d0ed42b6"
  },
  {
    "url": "/_nuxt/e8fb62cf3b0f018dbc70.js",
    "revision": "cfa355a908411fe61ef004e18c96062a"
  },
  {
    "url": "/_nuxt/eb197ec79216985d29dc.js",
    "revision": "f21aa7752755cd56524d751b3b055a60"
  },
  {
    "url": "/_nuxt/f4e2bccd55be1194c00f.js",
    "revision": "c2e649822e1d073e26c66159b3fdf80e"
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
