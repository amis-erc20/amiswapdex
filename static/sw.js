importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/0a4415ed8ee6a66e28df.js",
    "revision": "cf8fce83018fca0212addbe1581b6ace"
  },
  {
    "url": "/_nuxt/18323c5c2223cbbd78b5.js",
    "revision": "aa75b0eb765604f7a185108676ec20de"
  },
  {
    "url": "/_nuxt/18644036d61d58fbf3b2.js",
    "revision": "ab096194ee2b7a10dd6c34de66660606"
  },
  {
    "url": "/_nuxt/196e6a4daf413ee54c17.js",
    "revision": "9e78499581d3261be706d96ae75cee54"
  },
  {
    "url": "/_nuxt/26b7e930309b911c5f0a.js",
    "revision": "33316532e4c4042cb4a2fc5ca44cc9ba"
  },
  {
    "url": "/_nuxt/318c0092c1370e843eb7.js",
    "revision": "1e52af8d4cfa55ba3ffc6a1ed9c611ee"
  },
  {
    "url": "/_nuxt/357866c9a103486a0f21.js",
    "revision": "791f0aa50cf9fd464131c73f8a40b8f6"
  },
  {
    "url": "/_nuxt/4e20fbaf58e4fb34c1be.js",
    "revision": "d3bf479d8328e0a55cb084ca079b2570"
  },
  {
    "url": "/_nuxt/53efc036f29a339e9879.js",
    "revision": "151e8321a1a038093fec7b2b70707877"
  },
  {
    "url": "/_nuxt/5946e6b8768c69e003d9.js",
    "revision": "e52603c6c1d4384ab78f0eba46283643"
  },
  {
    "url": "/_nuxt/6289ca827fbbc38e614f.js",
    "revision": "ae27af3916ea5452d4f69b4fe79b3436"
  },
  {
    "url": "/_nuxt/71370519e82f185d69a9.js",
    "revision": "5eb2f21512e1766c016065e6daa268b4"
  },
  {
    "url": "/_nuxt/7b684b25766bfe141e42.js",
    "revision": "08b89d4d96993c3d5378098065757b2f"
  },
  {
    "url": "/_nuxt/83895e3860178e4b88a2.js",
    "revision": "873ed6995d066098a80906e2bee875e3"
  },
  {
    "url": "/_nuxt/88e785bb975ce7533ba7.js",
    "revision": "d740f9e18abfde3b75b8d247fa0a427a"
  },
  {
    "url": "/_nuxt/a0754644350065040271.js",
    "revision": "f76e7f509f9c118860e04e9e3013dd11"
  },
  {
    "url": "/_nuxt/ae5f66d5a9878063edd8.js",
    "revision": "453f2944e3b0ab134983d93eeaf9a9a5"
  },
  {
    "url": "/_nuxt/b5f694753c8b7e7f2c66.js",
    "revision": "716c4e68555ef78e060383908c03d863"
  },
  {
    "url": "/_nuxt/c16ed9ae3319f8e46642.js",
    "revision": "00f2cdfdd4b2c4220a4ab171bb2e9436"
  },
  {
    "url": "/_nuxt/d40ed9ce93684ee442f7.js",
    "revision": "36f7442cf224eb92dd32d054dd143d94"
  },
  {
    "url": "/_nuxt/e6f8f5e229d737336b6a.js",
    "revision": "fa3900d904d33ecc2695d6b096118633"
  },
  {
    "url": "/_nuxt/f5be38af4e2b1ec0ad4e.js",
    "revision": "4637dc9623fc5c071984d626192f6ca6"
  },
  {
    "url": "/_nuxt/fd71d042f160be0bc7c5.js",
    "revision": "a18ec7d5e3dafe2191b80c59bfeaf5a2"
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
