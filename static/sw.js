importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/025de21a34c48a770f7c.js",
    "revision": "da2314406cb7a46284fc84805b05ed36"
  },
  {
    "url": "/_nuxt/0ddfac538c4a49bd87e4.js",
    "revision": "25eaec7396ffb7e353f16026ce31af9d"
  },
  {
    "url": "/_nuxt/11a25f0b354593110cf5.js",
    "revision": "a7f8cd985ed2f68fa9f750567cb13148"
  },
  {
    "url": "/_nuxt/18ff8854e40183c2e896.js",
    "revision": "fb8478c6d17f3ed09aba56ebd71a774d"
  },
  {
    "url": "/_nuxt/2d60bffc8c0b4c08b335.js",
    "revision": "aaccb076f1b827dfb323386afd7eac2d"
  },
  {
    "url": "/_nuxt/370e54fd1710036e5288.js",
    "revision": "ea571df92ec59aed4b8f74c5a4a0b89a"
  },
  {
    "url": "/_nuxt/389bd7f5a91dbf2520b5.js",
    "revision": "3a97786fd27f4dff98706326b027b0d5"
  },
  {
    "url": "/_nuxt/41f1255f8e85a7a44e60.js",
    "revision": "395ca4cf1e1de642b027007ad8b06b48"
  },
  {
    "url": "/_nuxt/4ec5b312bcd378d5703b.js",
    "revision": "03377eeaafdce16aa39a2166f63b9cc5"
  },
  {
    "url": "/_nuxt/614a582e042d15879fb9.js",
    "revision": "10ec82b2552349f148124484cbf127fc"
  },
  {
    "url": "/_nuxt/6399aff65f70fe2503e4.js",
    "revision": "2d95e9147d24391d784fc355afffa5cb"
  },
  {
    "url": "/_nuxt/6af63610e74068f61e3b.js",
    "revision": "8e30d9d34e6d1730c5cf94626b148bb9"
  },
  {
    "url": "/_nuxt/795fbd9413bb356f75a3.js",
    "revision": "60ded8ee57dcc6bde2403963544c8049"
  },
  {
    "url": "/_nuxt/b76d73209754c2a06553.js",
    "revision": "a0991618042e0853cf5002a37cf6aef2"
  },
  {
    "url": "/_nuxt/bf2246e4f350dee01e90.js",
    "revision": "0215da1df2698b5017b8ff02ae3d959e"
  },
  {
    "url": "/_nuxt/c50b66bf5873c1bdf271.js",
    "revision": "34ca3d5f66a3ed02af0815c193c6766a"
  },
  {
    "url": "/_nuxt/d3478337dca284679934.js",
    "revision": "3eb7350b25d6510231e04aaf57b184e0"
  },
  {
    "url": "/_nuxt/e27255e9f9a42a0188ee.js",
    "revision": "3d7e987d6b49af2baf4d45562637133b"
  },
  {
    "url": "/_nuxt/e2d1a4e2fe22254c5a94.js",
    "revision": "e457090162c5d4816ebda45b487b0c81"
  },
  {
    "url": "/_nuxt/e80078cb260af6d8bdf3.js",
    "revision": "89a4b4445d0b0cc90e482e5af9418bf2"
  },
  {
    "url": "/_nuxt/ece6b794f7f00e9ed263.js",
    "revision": "f75cd2022f893ef659d1c778879618a3"
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
