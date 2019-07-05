importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/27dc767924c1c39c6d51.js",
    "revision": "ba8b6be380d32dce7defe67d2a291189"
  },
  {
    "url": "/_nuxt/331a285514662bde667e.js",
    "revision": "5ca589a2eb168d25be0bbede244d6793"
  },
  {
    "url": "/_nuxt/34f82c678312d1c22062.js",
    "revision": "083910634ff3fecc454c5f06d834123d"
  },
  {
    "url": "/_nuxt/37236c495147cc32ee80.js",
    "revision": "8e30d9d34e6d1730c5cf94626b148bb9"
  },
  {
    "url": "/_nuxt/5403255db6742783d4f7.js",
    "revision": "f8ce28c4e91c6444abe83bdd50cb13a9"
  },
  {
    "url": "/_nuxt/5a56b447df1fc1fead0b.js",
    "revision": "c0fbd39503117733208e5b8be7e7606d"
  },
  {
    "url": "/_nuxt/69bb2ca2c38d279ba390.js",
    "revision": "7d31063f3454245d7e2f148040ca2cde"
  },
  {
    "url": "/_nuxt/7bc1609ce04d60e3c05c.js",
    "revision": "7d8de0eb04507023c7fe700d6406b830"
  },
  {
    "url": "/_nuxt/80f361fc7512a19c194b.js",
    "revision": "29ffe6cbcbd1524b7ab462475ad5398c"
  },
  {
    "url": "/_nuxt/909cc7150f8985b144c4.js",
    "revision": "bfb4e97d40744091eb152a7778de8ef6"
  },
  {
    "url": "/_nuxt/91e7a8033344368a2af4.js",
    "revision": "99cca4dcf1949ba18a86628ab3d09d6f"
  },
  {
    "url": "/_nuxt/97145b97a9b656ede94a.js",
    "revision": "631512944556a7f8eb8bfde72190188c"
  },
  {
    "url": "/_nuxt/9ce8b26baba183831cd7.js",
    "revision": "0ca6b1ba5aaf79350bf60940331b85c9"
  },
  {
    "url": "/_nuxt/b511c7b0518f0fd796e5.js",
    "revision": "7b958d16f951f47c0e1e11238b7c379e"
  },
  {
    "url": "/_nuxt/b78744c61575b103ce21.js",
    "revision": "cd6ceddc66a05ad3086308e82b669e82"
  },
  {
    "url": "/_nuxt/bc015aaf9e4e7b9a42f7.js",
    "revision": "89d15d84a83a9bf8b966d33ee55f4537"
  },
  {
    "url": "/_nuxt/bf20d4432ebf11eab109.js",
    "revision": "43c7084e3a377eeb529a667d4d139522"
  },
  {
    "url": "/_nuxt/bfb62b768c8c9d0d98be.js",
    "revision": "3eb7a880269673e5f45e1dc3f26666c5"
  },
  {
    "url": "/_nuxt/c0cfa3055d34c81c7748.js",
    "revision": "fa3900d904d33ecc2695d6b096118633"
  },
  {
    "url": "/_nuxt/cbcb6277eb24c6ca5c20.js",
    "revision": "aa75b0eb765604f7a185108676ec20de"
  },
  {
    "url": "/_nuxt/f6b38b91491c58b033f6.js",
    "revision": "34477d2c087080153c464b665edbef1b"
  },
  {
    "url": "/_nuxt/fc1edf4f87b1f2baa204.js",
    "revision": "1e4dcb8eac81bf9720d32f79193a1c26"
  },
  {
    "url": "/_nuxt/fcda17c1c7afdd057452.js",
    "revision": "86f6761a4353294987ff6bcfe1da572d"
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
