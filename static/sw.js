importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/0287a0871339c44bf2ff.js",
    "revision": "82fcfe91b8bbb111419667aedf389e53"
  },
  {
    "url": "/_nuxt/02b2cfef6ea47b0310b5.js",
    "revision": "9201b137421cb4d846414dbde19de4e3"
  },
  {
    "url": "/_nuxt/09d9558d4cf6063ec2c0.js",
    "revision": "0870d43a1e4c042a9e4b30d870919cb9"
  },
  {
    "url": "/_nuxt/11941a685efdee8be3d1.js",
    "revision": "9ab6297de24dee31fa1befebcf51b27d"
  },
  {
    "url": "/_nuxt/140fde63cdfac7d244dd.js",
    "revision": "343d31ddc2c30e7841e65d0efea364d3"
  },
  {
    "url": "/_nuxt/2cbe28284df2e4217348.js",
    "revision": "13c3ba0944cd54ededd0360921ad4aa7"
  },
  {
    "url": "/_nuxt/2d3db2cdf4e8a309b9a9.js",
    "revision": "bcbf95990a9805274319da9740e743b6"
  },
  {
    "url": "/_nuxt/2fe2559f770a097d8c78.js",
    "revision": "3f368795218a0893446f0de17c0467b3"
  },
  {
    "url": "/_nuxt/4824c9aa48f437c9af3e.js",
    "revision": "f63b8afcf7cd9b8e8cc5b2940fee48b4"
  },
  {
    "url": "/_nuxt/4e369022c6f63483a0ee.js",
    "revision": "7dfdb942bd63557dda9a1276441685fd"
  },
  {
    "url": "/_nuxt/5344d7b73f6c0a4f1925.js",
    "revision": "1a8660328a76444b165281d49fe49f56"
  },
  {
    "url": "/_nuxt/65c9fb8eeefd3ed56d5b.js",
    "revision": "c9ebc878fcc1feb2ae4a26cc6f12ff85"
  },
  {
    "url": "/_nuxt/7ff0d5fed2f6abc6de76.js",
    "revision": "c3531f7ead10b884e37add80c35e7e87"
  },
  {
    "url": "/_nuxt/812b246666170818bed8.js",
    "revision": "444dba03b68b8d7c824e10d34cc15d86"
  },
  {
    "url": "/_nuxt/8ae8718175968d56738b.js",
    "revision": "2d4b3b2413906aee38fb69e41d868eba"
  },
  {
    "url": "/_nuxt/ab9c2ef20b4183780dfe.js",
    "revision": "64f7095d24852456860525ec82b8327c"
  },
  {
    "url": "/_nuxt/bf4cf5e0d125c074ac96.js",
    "revision": "76b106e38f1a358172c5881191c21e10"
  },
  {
    "url": "/_nuxt/cc5b94d041205677b7d3.js",
    "revision": "8360ec34a01a51f69e738c3473be9c8d"
  },
  {
    "url": "/_nuxt/e6b81be7c1bd1a925852.js",
    "revision": "9780f9cdbbd27cb1343bd6e77bdf0700"
  },
  {
    "url": "/_nuxt/ec36a08f0f6e272f7bec.js",
    "revision": "5611e608b2797bf70bd01954a08b3bb3"
  },
  {
    "url": "/_nuxt/ffbbdacaa3759a4a1243.js",
    "revision": "468042e14a7b49c5f146760d42aeba74"
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
