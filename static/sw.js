importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/02fca4a667eca1959a00.js",
    "revision": "4ceffd26d3b07c6b955e47902314626c"
  },
  {
    "url": "/_nuxt/108e6a56cd326a12fef6.js",
    "revision": "b75f2e1fefd158842cbff1722adc26dd"
  },
  {
    "url": "/_nuxt/143d67e0f95ea3764933.js",
    "revision": "318f7e3d37a645d904cb13b4252040db"
  },
  {
    "url": "/_nuxt/309b429d183347a42eb0.js",
    "revision": "7da43dbbd7bd4e74875f1a7ad6ed00d2"
  },
  {
    "url": "/_nuxt/34aa4e38e4ac7750cafb.js",
    "revision": "b450165f4a4c17a879c99dba54466d62"
  },
  {
    "url": "/_nuxt/3ef3d4c1cec1e66a3e42.js",
    "revision": "65716d498e89f9e4186cb059c4106c0d"
  },
  {
    "url": "/_nuxt/4745b377a37a4409d22d.js",
    "revision": "37dafa7b891587607e3a8afdc0ac3103"
  },
  {
    "url": "/_nuxt/57207fc9e3ff88ed55a9.js",
    "revision": "522ee97fabf781381d7a9ed3491f4c06"
  },
  {
    "url": "/_nuxt/604ef9e5db1d4dbd9a4b.js",
    "revision": "685ceba94a4c413645fa7bab6ad2fb27"
  },
  {
    "url": "/_nuxt/70437dfc8450d5f7210f.js",
    "revision": "33eebb70f7b6ba3a863f4e14e24ee939"
  },
  {
    "url": "/_nuxt/7b5abf17d1139ae08f03.js",
    "revision": "b9e49a1916b82b66b3d9db8352a03b81"
  },
  {
    "url": "/_nuxt/80896343a057fc7ad96d.js",
    "revision": "4622eff197fb087b24564a7de71c64e4"
  },
  {
    "url": "/_nuxt/879554d0882bcf45cf2b.js",
    "revision": "a3aa4472c97d8e97890cb393b37b05dd"
  },
  {
    "url": "/_nuxt/88a312124bbaae5305ab.js",
    "revision": "0e0637830a7628838716951d945af50c"
  },
  {
    "url": "/_nuxt/8b63b87d349d91c8fe4e.js",
    "revision": "39a3bf9b518689297d44264386d33ff0"
  },
  {
    "url": "/_nuxt/8f7bdac814dcbea936d8.js",
    "revision": "3313a79a404639acee46a64143df5319"
  },
  {
    "url": "/_nuxt/ad793b71e8b2d6a08ca7.js",
    "revision": "4cced49c1b768f8911e82f26bd608015"
  },
  {
    "url": "/_nuxt/bbd6e125f39f19f621e5.js",
    "revision": "79c3af753c6d4fd0f077bfeffc275ce5"
  },
  {
    "url": "/_nuxt/bcebefb44b5b436aa543.js",
    "revision": "9face2af9d0180d0e698de85bc896b8e"
  },
  {
    "url": "/_nuxt/c0a3a731b5f2084b1e3c.js",
    "revision": "8a4f5deea9de208b76603d16a67c69fc"
  },
  {
    "url": "/_nuxt/c5df44c13a5e65b7ec9d.js",
    "revision": "b47d3d33e1c87d5dda96105bb105c3f3"
  },
  {
    "url": "/_nuxt/ced3c1af8674c68eb52f.js",
    "revision": "60b8454573a3aa88b7e113872e765858"
  },
  {
    "url": "/_nuxt/df6565372894882113a2.js",
    "revision": "76215926c679c4e73b9b45328921ae40"
  },
  {
    "url": "/_nuxt/e34089d9da8da5c9f1b3.js",
    "revision": "97615213cbad050e16beff660f44583f"
  },
  {
    "url": "/_nuxt/ebfc67091a6faedccbda.js",
    "revision": "f4c6a24f03cfd6c9bd7b2472222d11d1"
  },
  {
    "url": "/_nuxt/ed78a7f2a8cca488a609.js",
    "revision": "bcd7b78f39a308d7bfc06eeadeaad7cd"
  },
  {
    "url": "/_nuxt/eeb16fe04d47cccd7ca4.js",
    "revision": "92291d3e26d1115e96d9e45223057af5"
  },
  {
    "url": "/_nuxt/ef9fdfb77c748b92000e.js",
    "revision": "4434d6c485e62f1fad57c0403fd8a135"
  },
  {
    "url": "/_nuxt/f099e740b632cca71262.js",
    "revision": "e64afe8f59eb6a0ed0fba58f5e3b9fcf"
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
