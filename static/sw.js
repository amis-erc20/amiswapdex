importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/063b98c6696d46df84ae.js",
    "revision": "c094dc6c9465a9cecf40f8c8c3377b2c"
  },
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
    "url": "/_nuxt/3b4204a3e8ab780360ef.js",
    "revision": "498cee945d8ec7c8aa916aeb7451a9d4"
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
    "url": "/_nuxt/941b8dfe9a0a91e9deba.js",
    "revision": "7d87a6ed9b8b92c88feb4f932db7de16"
  },
  {
    "url": "/_nuxt/a57f606e319839957854.js",
    "revision": "be2c5cd7e69e536230310cdda4a96d0e"
  },
  {
    "url": "/_nuxt/ab9c2ef20b4183780dfe.js",
    "revision": "64f7095d24852456860525ec82b8327c"
  },
  {
    "url": "/_nuxt/dc1444a3a684c3a04b27.js",
    "revision": "25dbd683066ff8106308f37c61e368c2"
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
