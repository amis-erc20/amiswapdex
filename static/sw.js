importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/096a3ce040bd33b53697.js",
    "revision": "5611e608b2797bf70bd01954a08b3bb3"
  },
  {
    "url": "/_nuxt/096d950d730d22949ffc.js",
    "revision": "343d31ddc2c30e7841e65d0efea364d3"
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
    "url": "/_nuxt/14de9d6865a67905fb2e.js",
    "revision": "7dfdb942bd63557dda9a1276441685fd"
  },
  {
    "url": "/_nuxt/227a4b2ef2a24e1e6e85.js",
    "revision": "5cb5536c75e86a52c9a2ded8aff4d468"
  },
  {
    "url": "/_nuxt/2ee28e4b1986d7d69bdc.js",
    "revision": "4609e4e8a9f27b116334ffd5d1b00226"
  },
  {
    "url": "/_nuxt/2fe2559f770a097d8c78.js",
    "revision": "3f368795218a0893446f0de17c0467b3"
  },
  {
    "url": "/_nuxt/3a3448e88acf0b43e9d1.js",
    "revision": "9201b137421cb4d846414dbde19de4e3"
  },
  {
    "url": "/_nuxt/3a8da4609c76df4a2238.js",
    "revision": "2c9c26f5030e175f1591a1236cd140f7"
  },
  {
    "url": "/_nuxt/4437a44170a5b4e06520.js",
    "revision": "4aecf01decbf5034e84cb73d2acbf8e5"
  },
  {
    "url": "/_nuxt/4824c9aa48f437c9af3e.js",
    "revision": "f63b8afcf7cd9b8e8cc5b2940fee48b4"
  },
  {
    "url": "/_nuxt/5344d7b73f6c0a4f1925.js",
    "revision": "1a8660328a76444b165281d49fe49f56"
  },
  {
    "url": "/_nuxt/829996dbe94a38d8c029.js",
    "revision": "13c3ba0944cd54ededd0360921ad4aa7"
  },
  {
    "url": "/_nuxt/8ae8718175968d56738b.js",
    "revision": "2d4b3b2413906aee38fb69e41d868eba"
  },
  {
    "url": "/_nuxt/929474dc4ea9b5460a78.js",
    "revision": "91b18f3f6f9503cf1205a9b1f8f6e708"
  },
  {
    "url": "/_nuxt/942ad19c1f7a6857572a.js",
    "revision": "57e65af6de55c771e81c24a69b80cdbb"
  },
  {
    "url": "/_nuxt/94fe94dfe5c0b4df9183.js",
    "revision": "8c9103ea4bb71f4d58d43afb8870ba28"
  },
  {
    "url": "/_nuxt/ab9c2ef20b4183780dfe.js",
    "revision": "64f7095d24852456860525ec82b8327c"
  },
  {
    "url": "/_nuxt/ac1e24038710f8e8ad98.js",
    "revision": "847de2356c7fa1d39ce1afccdef71060"
  },
  {
    "url": "/_nuxt/e6b81be7c1bd1a925852.js",
    "revision": "9780f9cdbbd27cb1343bd6e77bdf0700"
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
