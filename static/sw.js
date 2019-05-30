importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/020b58c7393a64af536a.js",
    "revision": "2671af598196e2586fcb364a09b274c7"
  },
  {
    "url": "/_nuxt/11290005f946da37bf5b.js",
    "revision": "4697ddfc46cbfc6403e5f37da66fee88"
  },
  {
    "url": "/_nuxt/196636f14cd5974b2f3f.js",
    "revision": "96c934d251ffd26306cf721431eea9d4"
  },
  {
    "url": "/_nuxt/2db9d6e5e6499f54fa2c.js",
    "revision": "042287179f152ded2c4a851456912ab6"
  },
  {
    "url": "/_nuxt/34aa4e38e4ac7750cafb.js",
    "revision": "b450165f4a4c17a879c99dba54466d62"
  },
  {
    "url": "/_nuxt/38c9260e981fbefc8a40.js",
    "revision": "e8ccf3f858720b91209ca4c0f3506f78"
  },
  {
    "url": "/_nuxt/3fb8662c21512ec1dd19.js",
    "revision": "4e6dca1c13924e6793d2221b7e7e395c"
  },
  {
    "url": "/_nuxt/4b1bd79fdac6208a4f44.js",
    "revision": "7481205bd710e91801e6b1e135e392b7"
  },
  {
    "url": "/_nuxt/59e04633af77e5880260.js",
    "revision": "c398ec64c6ff7c32a0bc68e7f0bff405"
  },
  {
    "url": "/_nuxt/5dd7df975eed188db136.js",
    "revision": "c007f137945dd161b317e8161df63033"
  },
  {
    "url": "/_nuxt/5f3adddd6b62d4af1fc6.js",
    "revision": "e2887a44d010dfc03fd0b3e2e9fa7e6e"
  },
  {
    "url": "/_nuxt/6068c74b4ea6c299df90.js",
    "revision": "7b5d893cbea4a69296b21a2a4c11005c"
  },
  {
    "url": "/_nuxt/611496a94f079d68e094.js",
    "revision": "89d7ad1da4357cd970ca9908dee68575"
  },
  {
    "url": "/_nuxt/61ef2c2a373b539e0c97.js",
    "revision": "3269e5fcbaee2faef88a344e25dc0b58"
  },
  {
    "url": "/_nuxt/79c88be72d0d6386120d.js",
    "revision": "cfb60d2b6a58a56893bdd81311ca5eb7"
  },
  {
    "url": "/_nuxt/7aeec3e569bce8b643b9.js",
    "revision": "81f968537b495f17b9c871fb06f2ab5d"
  },
  {
    "url": "/_nuxt/90dea24277602c424161.js",
    "revision": "88024a1a9fa1662ad1d0a70c00414629"
  },
  {
    "url": "/_nuxt/9431e487a5405265f041.js",
    "revision": "d4a96ea1821a803e78ee8a751e410742"
  },
  {
    "url": "/_nuxt/98ade78484f119c4e8eb.js",
    "revision": "c1f3f669092ad423ff37871d49a526e0"
  },
  {
    "url": "/_nuxt/a646b5b91b39f5c58f6b.js",
    "revision": "c1a9944282c073543beba7275f09d96b"
  },
  {
    "url": "/_nuxt/c3b13282a28fb6ffcdb2.js",
    "revision": "3b91c578813b85b1e33197292715f797"
  },
  {
    "url": "/_nuxt/c45ca315bd169b3ad745.js",
    "revision": "dd992cfba64c293c1a15140a0ea685e3"
  },
  {
    "url": "/_nuxt/c677d13385a7a370ed5a.js",
    "revision": "c506fa6dae1aa1989472924477388a66"
  },
  {
    "url": "/_nuxt/e9ff40060082978c2d9a.js",
    "revision": "68d457765c55037741b2d99e00f1cb3b"
  },
  {
    "url": "/_nuxt/ea01ab18b1d53ea8ad5b.js",
    "revision": "663a75288bcc4755d7307a0aa9218b15"
  },
  {
    "url": "/_nuxt/ee0a06f89c3e2e594d01.js",
    "revision": "dfc6f19522a07d6ef45c85ebebab099d"
  },
  {
    "url": "/_nuxt/ef9fdfb77c748b92000e.js",
    "revision": "4434d6c485e62f1fad57c0403fd8a135"
  },
  {
    "url": "/_nuxt/f73e48c5395d58550e75.js",
    "revision": "bd478bb4305a037813682a524fde01ea"
  },
  {
    "url": "/_nuxt/f92c25f7311d1d00bf50.js",
    "revision": "e46cd136e1ef0ab7b667063fc1f08891"
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
