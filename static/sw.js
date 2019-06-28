importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/1af14ab48caef25975c0.js",
    "revision": "e35c9031b47d5d16c44b0ce606c62032"
  },
  {
    "url": "/_nuxt/1c29ab79131d91a87f48.js",
    "revision": "da7c73611dc326a18e310194b5c8be57"
  },
  {
    "url": "/_nuxt/36370dbcc7bb0d8f85f9.js",
    "revision": "9b5a41f624a0b674f2ed3ad6517f6611"
  },
  {
    "url": "/_nuxt/4c547fa06ab5794e47ff.js",
    "revision": "e080c886c2e94a9ca9172e5d5a83cd11"
  },
  {
    "url": "/_nuxt/517fc29fc92ca74e2f8b.js",
    "revision": "ab4ccab4fa2b9f63f7b715d46f032409"
  },
  {
    "url": "/_nuxt/66d38ff9d5a35c0b815c.js",
    "revision": "3c56a9e72593fd9d9adac7c0ace084a0"
  },
  {
    "url": "/_nuxt/73600524ac78552f0e0f.js",
    "revision": "984933633469e3f11f3230eb30f1158a"
  },
  {
    "url": "/_nuxt/76fa44eee8989571b597.js",
    "revision": "5398390b5a21d9efb914040a123819fb"
  },
  {
    "url": "/_nuxt/7c7f2fd0d93d106d94a2.js",
    "revision": "97c4e88f0ba29c719d5e781d2de3a6a1"
  },
  {
    "url": "/_nuxt/8cc91bd0c6df464fdc44.js",
    "revision": "8fb69aa65fcf926e468279215442c33c"
  },
  {
    "url": "/_nuxt/90cddba2450aa73856e1.js",
    "revision": "ac1fb30892f4e335999cbd509fe9f387"
  },
  {
    "url": "/_nuxt/9374bf6de7de86abf179.js",
    "revision": "0d784d19ab9bf99396ecbd1103b77dcd"
  },
  {
    "url": "/_nuxt/95b39e7f0c70abdb67f0.js",
    "revision": "7b1129bc7590ae00ee7fbd81b11ab305"
  },
  {
    "url": "/_nuxt/a350f57d37f3b660b945.js",
    "revision": "430ce9c5012d02f04164e67ae0f6bf47"
  },
  {
    "url": "/_nuxt/a3faf4465b349e435d1a.js",
    "revision": "9e1d2625e98283d8bf0cc6e747d5b6ac"
  },
  {
    "url": "/_nuxt/a7cbad775f047e5b1120.js",
    "revision": "22acdd685ff080bb501469fa7e644d3a"
  },
  {
    "url": "/_nuxt/adff2a7a4db51b2a1732.js",
    "revision": "4e4cd21d3200c0de360478577b0aef5f"
  },
  {
    "url": "/_nuxt/b1cd2ed5673ad84e039a.js",
    "revision": "2ee915e81f11f80a321118575b78fcf6"
  },
  {
    "url": "/_nuxt/b5bfc532a0e54414acd0.js",
    "revision": "3806e5774e93cdc8c6cc0d2f20379d8d"
  },
  {
    "url": "/_nuxt/b66399d410c5c168e5ff.js",
    "revision": "f073788940acdccc8c0e518608a13ab1"
  },
  {
    "url": "/_nuxt/c6e0a77892fa37f23aca.js",
    "revision": "27ede6fbb5fccf019f8427279d252c8c"
  },
  {
    "url": "/_nuxt/d55573083b80b3ec19aa.js",
    "revision": "3d7528553b05f771814ac37ccece1618"
  },
  {
    "url": "/_nuxt/e97d3c39dfab2cab5077.js",
    "revision": "57c69a08211dd82a8dc765c80aac72d8"
  },
  {
    "url": "/_nuxt/f0efdf596b18cd6e1f8b.js",
    "revision": "6c6b20e29d514dcc95735432d750ef88"
  },
  {
    "url": "/_nuxt/f4f073075409938fb1f5.js",
    "revision": "0c53a28b3dc9bd6c790314843662049e"
  },
  {
    "url": "/_nuxt/f84512b9aa54e5606c75.js",
    "revision": "3e6c3be0b27e56785637484c5b6c1929"
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
