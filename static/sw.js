importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/071244406d8fac41d2ff.js",
    "revision": "3ae64819ffe6996b6d8f6d3a390b8851"
  },
  {
    "url": "/_nuxt/170944465a9ff12cf964.js",
    "revision": "e85962eba34ba51c914289b35ca6891f"
  },
  {
    "url": "/_nuxt/1869f89b253de24d1c7e.js",
    "revision": "f454cccd16ff3712b240668bf936497c"
  },
  {
    "url": "/_nuxt/1e7e83d35d06a47ec762.js",
    "revision": "968744b8190dec60742b2654f0ff1263"
  },
  {
    "url": "/_nuxt/1f20db52f3530bbd660b.js",
    "revision": "e95c30c7c8e7d732416d56ee284d89e9"
  },
  {
    "url": "/_nuxt/23fedbdffd8adaa7ea1a.js",
    "revision": "127b63616d36ccfaf5d00d8e1f62d5b6"
  },
  {
    "url": "/_nuxt/2aea7d721f815fd43ff0.js",
    "revision": "3788095c49298c15c0fd04b3db464d2d"
  },
  {
    "url": "/_nuxt/3c9dcc1c96b2ff67a5dc.js",
    "revision": "97fe32f493843053601c1c6450c75c19"
  },
  {
    "url": "/_nuxt/3d34903183213644351a.js",
    "revision": "be948e0dd0d8f49e0a5d789d17d6be7c"
  },
  {
    "url": "/_nuxt/4ad9a50500ff53d1773c.js",
    "revision": "394f4322e139e0eb417524279c5c1de0"
  },
  {
    "url": "/_nuxt/52c1d763b4f348a60b47.js",
    "revision": "0632b929f1f5184cb9cdabffebac8206"
  },
  {
    "url": "/_nuxt/551c10fbd38ba6fbc174.js",
    "revision": "b1e594f5694089d15103303deb40ed4a"
  },
  {
    "url": "/_nuxt/5a6f1f09175b4a310d76.js",
    "revision": "4a3655a09d19372a195711f6b672ce86"
  },
  {
    "url": "/_nuxt/864a1d1c4abbb132a094.js",
    "revision": "f1f1dd70df7438f591013c46e5b92bea"
  },
  {
    "url": "/_nuxt/939a77b0c93377d826ee.js",
    "revision": "6fae3e121872fe2666a5d647927710a9"
  },
  {
    "url": "/_nuxt/a0065f40d2040f4568b9.js",
    "revision": "688539e05121dd8522c6ca408d97f004"
  },
  {
    "url": "/_nuxt/a56da60e5437424b16ce.js",
    "revision": "795b38fcb89b3f1ff4ca4d318e3b13d6"
  },
  {
    "url": "/_nuxt/a5b51082dda66f1e2d20.js",
    "revision": "25bcb31ab4606d9dc03b3f3bb81e7cd1"
  },
  {
    "url": "/_nuxt/a5fb5440c0c6fc8b9ea4.js",
    "revision": "68a74c710e45d7c5df629ac16ef79a4e"
  },
  {
    "url": "/_nuxt/c86387052d1bea58b49a.js",
    "revision": "fb83abee0219f6530c84ba13e41468e3"
  },
  {
    "url": "/_nuxt/ccca4e238d2944faf4ad.js",
    "revision": "ea306f6c7ea3d254e3e64f073692b116"
  },
  {
    "url": "/_nuxt/d41327873ffdfd069165.js",
    "revision": "821efe78a5b23ba22dea332d59f2a4d2"
  },
  {
    "url": "/_nuxt/d53092807f294c6105ff.js",
    "revision": "dc0ec186cc7057bbd0b6d613724ca4f5"
  },
  {
    "url": "/_nuxt/dd94a2a155aa6e53b1e0.js",
    "revision": "1d7ee037c89fa986de479334d477185c"
  },
  {
    "url": "/_nuxt/e71e6072b16841f12e02.js",
    "revision": "60578d7887488902d2fb5326e95d5a55"
  },
  {
    "url": "/_nuxt/ea64ed9429f8308d2f42.js",
    "revision": "9037267c289341d76d190873861d832e"
  },
  {
    "url": "/_nuxt/ef9fdfb77c748b92000e.js",
    "revision": "4434d6c485e62f1fad57c0403fd8a135"
  },
  {
    "url": "/_nuxt/f317b7545a7cfa252dfb.js",
    "revision": "0a920564ba09482be9cb3367fe625a43"
  },
  {
    "url": "/_nuxt/f6ad6c91f567e3c37acd.js",
    "revision": "2e7643f1d3eb95827d41b472157aac83"
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
