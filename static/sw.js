importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/11da313ed9130c68c5f0.js",
    "revision": "a413d3bbf486ddb9fd0564ff2ce98025"
  },
  {
    "url": "/_nuxt/14d7d08e4ee93ea463db.js",
    "revision": "e4b2043ba476c93b9cc496667774c450"
  },
  {
    "url": "/_nuxt/2aa0106f9d5765c7df98.js",
    "revision": "343f7d6d6a9140a80bf8c794b0aec306"
  },
  {
    "url": "/_nuxt/4083fb7bde0b5b8c23b4.js",
    "revision": "2a73b3e7028fbfd80a119e7c6f1f8e40"
  },
  {
    "url": "/_nuxt/40f77bf6377bd34ebac0.js",
    "revision": "7b060426c0797f1c8029c5d2212cb4ea"
  },
  {
    "url": "/_nuxt/490013a150cde212de0d.js",
    "revision": "c846b6402c0db702cc0a9a5f4d50fe98"
  },
  {
    "url": "/_nuxt/5829afda9db9205a621f.js",
    "revision": "5ca61ae3172100ff3d5deb25b565d3a3"
  },
  {
    "url": "/_nuxt/5903b3a1187fcc4d4151.js",
    "revision": "cd84bf30d42d70229265b4e69b7471e6"
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
    "url": "/_nuxt/99f6a445b6bb4c2f7683.js",
    "revision": "5360876c7f00002c36a1ce2f8bd1989c"
  },
  {
    "url": "/_nuxt/ba26536d69b66b887439.js",
    "revision": "968e5fe47a5ffa9772ef10384651afb7"
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
    "url": "/_nuxt/d9caecf4080735836f94.js",
    "revision": "a4a398766dfecf29932e75c5c0ab8c11"
  },
  {
    "url": "/_nuxt/e72f6883462fd3348010.js",
    "revision": "4f17ba04e69e385bd153707aaeac3f9e"
  },
  {
    "url": "/_nuxt/ede0681e228bf966c169.js",
    "revision": "9072917b5400a575cbcaba7cff8e7812"
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
