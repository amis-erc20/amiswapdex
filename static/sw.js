importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/1063cd470c3c3414e5ca.js",
    "revision": "528f59e590976ecd4c02885a8d1aa0f8"
  },
  {
    "url": "/_nuxt/1eb556c682188e8a033a.js",
    "revision": "8d1e003ce5ebb9b207c950761bb0c9fd"
  },
  {
    "url": "/_nuxt/20da213f492d1298dd31.js",
    "revision": "6e114d74902edbb421a982145c399b7e"
  },
  {
    "url": "/_nuxt/23f393b641b34b7e3b48.js",
    "revision": "8719ff53b75a129591fdabeb15c58fee"
  },
  {
    "url": "/_nuxt/41b163e17a70573bd2e0.js",
    "revision": "4ac45ea7338fbd62327726cbbc03898d"
  },
  {
    "url": "/_nuxt/46e9700ba9717b5f5bbb.js",
    "revision": "1965cb748aa60e1b34811523bf189612"
  },
  {
    "url": "/_nuxt/5365cabe3430e8d273b0.js",
    "revision": "b78a2441dbc3ed96918bcb73ae826b51"
  },
  {
    "url": "/_nuxt/56f724a0ef547d9eb2e8.js",
    "revision": "3cf01c5c12ed33f8cdc1c287b02fb966"
  },
  {
    "url": "/_nuxt/65fe3fdd34ff308ce276.js",
    "revision": "22d1eb7b257ccec85e33f08619495a15"
  },
  {
    "url": "/_nuxt/6dfdaf69ac268fefc713.js",
    "revision": "be64619b3698e1ae1a03b5bcff9b3276"
  },
  {
    "url": "/_nuxt/7235babfbe89390a45e9.js",
    "revision": "1f567d126bc78ec24edf0d817f5ad860"
  },
  {
    "url": "/_nuxt/73f4842a185b01f6e146.js",
    "revision": "c6a4ee8fff480f5aeb2f43f8a2f360e9"
  },
  {
    "url": "/_nuxt/743a14b88fe7bd2dc8c4.js",
    "revision": "b89578093df689bdbe36f653227231be"
  },
  {
    "url": "/_nuxt/77b91b41a1b92df30761.js",
    "revision": "c9cbe3fce3415731bacfc0570a6b2f24"
  },
  {
    "url": "/_nuxt/9008055eda2610fc099d.js",
    "revision": "9036f5e288a592a8fbdb418589b0f503"
  },
  {
    "url": "/_nuxt/9560e3edd4954f753a72.js",
    "revision": "ef03b6dfe77f72f08de76e11ba18f8a5"
  },
  {
    "url": "/_nuxt/a1c226da9b6bc277da90.js",
    "revision": "bf6ea79142f34e026beddef41a0dac6b"
  },
  {
    "url": "/_nuxt/a2514f37e49134971156.js",
    "revision": "1e823fb248ba7e49658ca73ee9661592"
  },
  {
    "url": "/_nuxt/adcced9a007816bd1ca6.js",
    "revision": "cd36935a3d7a1785e35bc15f4c90a596"
  },
  {
    "url": "/_nuxt/bed241e248b423b703bc.js",
    "revision": "b433f153a3c107ad53e96fc7d7531839"
  },
  {
    "url": "/_nuxt/c0d74a7e3e9dd7db0d78.js",
    "revision": "6338167871c61b291b5810282909702d"
  },
  {
    "url": "/_nuxt/c10f9b40bad050c72c38.js",
    "revision": "faa1af003ff776c443a224af349ad725"
  },
  {
    "url": "/_nuxt/d1bc8eeb0a569b7f0893.js",
    "revision": "13400d512f90cc31aa258885f596b7ba"
  },
  {
    "url": "/_nuxt/d56114a1933fa9bc22b4.js",
    "revision": "0b77ccd69f9a0c9841d3ff7aa9279db0"
  },
  {
    "url": "/_nuxt/ee685cce7107f971b6c4.js",
    "revision": "cebfa4cd1732d2cffa2f77bf8fd513ed"
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
