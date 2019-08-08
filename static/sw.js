importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/08b94679adb798392c99.js",
    "revision": "2ea3cfaa46e452f796c314897ffe138f"
  },
  {
    "url": "/_nuxt/13036d1814da24d84347.js",
    "revision": "fc58ce4001df206e9dcef39799768480"
  },
  {
    "url": "/_nuxt/2a03b8e8a5f9a57c70cf.js",
    "revision": "0c2762c2f4b40bfc4b735b29ec92cd49"
  },
  {
    "url": "/_nuxt/38a021be256bf88ad86a.js",
    "revision": "0a44f5a14a4d53cfa8131525c8c8573c"
  },
  {
    "url": "/_nuxt/480fb81ccd24ca4f94af.js",
    "revision": "31e7dceed4ac79b24ba64b4bf87e72db"
  },
  {
    "url": "/_nuxt/59b455aa4312cb2a04dd.js",
    "revision": "595fb03d292fad179570914f175a1931"
  },
  {
    "url": "/_nuxt/5fddc5b578d3008a231b.js",
    "revision": "9780f9cdbbd27cb1343bd6e77bdf0700"
  },
  {
    "url": "/_nuxt/66cefa2ddd83af4ccd2f.js",
    "revision": "d1270387cd975be67d152496304ffd8f"
  },
  {
    "url": "/_nuxt/6bfacd178a894a612c7c.js",
    "revision": "8794aff22a39dda8d5fe358bee0c304c"
  },
  {
    "url": "/_nuxt/818c6df8b850208e175e.js",
    "revision": "2fbd3730033eeee24c5173803b99c46f"
  },
  {
    "url": "/_nuxt/844573ce7618a059e468.js",
    "revision": "83a1f9093688b5252351bb561f6be060"
  },
  {
    "url": "/_nuxt/9540509dc5b01547147b.js",
    "revision": "a5ce75f23cd45a197973cd9d3bf29bff"
  },
  {
    "url": "/_nuxt/9971e2209fac725340a6.js",
    "revision": "bf5626d2f6f4e03ce77554f469350c69"
  },
  {
    "url": "/_nuxt/9f37eed8623b6b8aa032.js",
    "revision": "d78b985f3b14bf82f9ecf1df5d94805b"
  },
  {
    "url": "/_nuxt/9f63330fa5a4cc0dfea6.js",
    "revision": "275afd562c33fad0f848b46dd1708e26"
  },
  {
    "url": "/_nuxt/aa315efa17ed3ef027d9.js",
    "revision": "83ff0631fe52493e7b7ffec5dc3325b6"
  },
  {
    "url": "/_nuxt/aa51d69475816f0461bd.js",
    "revision": "e773814378d289999568295afa677fd9"
  },
  {
    "url": "/_nuxt/ba406141ed437e9865dd.js",
    "revision": "a701db1bf124112928f7d97fd963a820"
  },
  {
    "url": "/_nuxt/c35dcda90bd5003d23f2.js",
    "revision": "ce8b5ece2b2fd996b750feb148977f22"
  },
  {
    "url": "/_nuxt/dc613a75ed9730dcbc26.js",
    "revision": "9c8516f5b7303aa608d454a0037d2e2c"
  },
  {
    "url": "/_nuxt/f1f0119b61a88a0c37bc.js",
    "revision": "59ddfbbc7ac962c3476c3145501f4ef8"
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
