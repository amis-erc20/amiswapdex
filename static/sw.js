importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/0dbb2ef0a3c93102f440.js",
    "revision": "2d2ce7f209ce4bc9673585f085e877a3"
  },
  {
    "url": "/_nuxt/26635476c106402b5778.js",
    "revision": "ef909a9c5aba84d22fc5eb03f8fb54ad"
  },
  {
    "url": "/_nuxt/2aa0106f9d5765c7df98.js",
    "revision": "343f7d6d6a9140a80bf8c794b0aec306"
  },
  {
    "url": "/_nuxt/340f8561fc259b71e548.js",
    "revision": "089640d94857b3d300bb16a5ab737508"
  },
  {
    "url": "/_nuxt/3bb1388be850e2c62fa3.js",
    "revision": "d1b4d2f0e6eea09e00ed70160b7d2906"
  },
  {
    "url": "/_nuxt/4083fb7bde0b5b8c23b4.js",
    "revision": "2a73b3e7028fbfd80a119e7c6f1f8e40"
  },
  {
    "url": "/_nuxt/490013a150cde212de0d.js",
    "revision": "c846b6402c0db702cc0a9a5f4d50fe98"
  },
  {
    "url": "/_nuxt/5f607c37d9c662a4376d.js",
    "revision": "628cdb41551551c51b46034251104e6e"
  },
  {
    "url": "/_nuxt/6620550031067317e0e0.js",
    "revision": "d686bb0a91b7da55ac5f9cb0ed6ad50e"
  },
  {
    "url": "/_nuxt/899e184448d99a5b1e37.js",
    "revision": "e2faffeccccef87296368841fa0041a3"
  },
  {
    "url": "/_nuxt/91cdec389c1c5dd2b418.js",
    "revision": "79f52c58302b0f5f83c85da78b4b723f"
  },
  {
    "url": "/_nuxt/97da9597a557d705b43a.js",
    "revision": "7e908efe7d54711c2b6df82fd8770829"
  },
  {
    "url": "/_nuxt/b3f0e5aba07c27e94833.js",
    "revision": "95d31dd78f90748da085f137606f0bd3"
  },
  {
    "url": "/_nuxt/bf363f1e32c90985e876.js",
    "revision": "f5ad519f56763f292470d34bdfa073b9"
  },
  {
    "url": "/_nuxt/d6ca62ca2c6ecfa070a1.js",
    "revision": "6e3a1c36c74b5406c62c9f5fd29aa1e7"
  },
  {
    "url": "/_nuxt/e72f6883462fd3348010.js",
    "revision": "4f17ba04e69e385bd153707aaeac3f9e"
  },
  {
    "url": "/_nuxt/ee798ce2e39705fc0f4a.js",
    "revision": "f6e2a3859f980463456f9ddd69528ccb"
  },
  {
    "url": "/_nuxt/fa07e0f517e410221077.js",
    "revision": "0a581fed511554aac3cf5f76681f5b6e"
  },
  {
    "url": "/_nuxt/fa5982385cce7dae1177.js",
    "revision": "77f5a6745c20d2ba851b5ea21160c879"
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
