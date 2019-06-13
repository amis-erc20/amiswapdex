importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/06db15395505e057e7c6.js",
    "revision": "6624bbebfbe1b109225fcff98635c7b2"
  },
  {
    "url": "/_nuxt/1debc98a8a08bbbddbb5.js",
    "revision": "cbcf5048466ffa5721ee355fcc99bb36"
  },
  {
    "url": "/_nuxt/3ce5b4928947da1c7e47.js",
    "revision": "cf0b12fca90b0608c4bb08a20388e0e6"
  },
  {
    "url": "/_nuxt/480b4ae31ba7f935940c.js",
    "revision": "cb16ef04f1b6a774b79da0197a8babfb"
  },
  {
    "url": "/_nuxt/4b5fa17e973f86025a99.js",
    "revision": "69b74f466b91c190b7365dccd05992ea"
  },
  {
    "url": "/_nuxt/5093a6e34998d3579f94.js",
    "revision": "9e2c0cb91374bd1ed46fb7573283681b"
  },
  {
    "url": "/_nuxt/6ac951b10741523f1139.js",
    "revision": "4c7a39df6fe69e8658f32be6a5bafdca"
  },
  {
    "url": "/_nuxt/74795b79e392dcedde7a.js",
    "revision": "9a243cc700f7246fc515cb84d2f064a6"
  },
  {
    "url": "/_nuxt/7b763df84b498f1c3bb6.js",
    "revision": "ce8b97f36f7c94b59de00144ac3def27"
  },
  {
    "url": "/_nuxt/829b7d17eaf23a5fcec4.js",
    "revision": "9ee60f19631234e55bc7c9290e9f4cd3"
  },
  {
    "url": "/_nuxt/86c6b82051069e0748c4.js",
    "revision": "092d974f703f600629c8e48ea4af92a0"
  },
  {
    "url": "/_nuxt/8a5ad6419ef95942fa5e.js",
    "revision": "be2aaf751bd6075aec64a0813d69561b"
  },
  {
    "url": "/_nuxt/b0902e690ecff3172dc0.js",
    "revision": "26e5234dcb81192a446da7a82858835f"
  },
  {
    "url": "/_nuxt/ba580776281b65b26be6.js",
    "revision": "ae0b86e0bdea064dd7f8bbe001067407"
  },
  {
    "url": "/_nuxt/bab5ce19b1084905ff04.js",
    "revision": "3cbb3859e1cc3ece23b013b13345b256"
  },
  {
    "url": "/_nuxt/c1964adc31a334f431bb.js",
    "revision": "f1749d756f083064b29d9d02451ea3b5"
  },
  {
    "url": "/_nuxt/c3e9129d29e7e364afa9.js",
    "revision": "d6a2b8c18052f8acac0cb42ff9b762d2"
  },
  {
    "url": "/_nuxt/ce45aca09e5aa927e819.js",
    "revision": "6e778512886f395ab2c3c5e27cdaa852"
  },
  {
    "url": "/_nuxt/ce88dbce0e3ce5b1d1cd.js",
    "revision": "b8e5af434b4135dad137f5c8131e5cf4"
  },
  {
    "url": "/_nuxt/efcd3fd8f4b7290262a8.js",
    "revision": "e9e9d871f65311a8d9aa7a09199798b2"
  },
  {
    "url": "/_nuxt/ff2f00ce2244b113c0ad.js",
    "revision": "60e11db93a31e433f3329dbb4e747873"
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
