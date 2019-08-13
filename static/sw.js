importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/11941a685efdee8be3d1.js",
    "revision": "9ab6297de24dee31fa1befebcf51b27d"
  },
  {
    "url": "/_nuxt/29eadee13610dc389b0a.js",
    "revision": "8b814d8c900c529a7b834e5fc8ae7f5f"
  },
  {
    "url": "/_nuxt/43548b45fb0dd24a12dd.js",
    "revision": "3cda11957935adb58cc4a26f8c1a7391"
  },
  {
    "url": "/_nuxt/54d2ddf71ca0f6390f8b.js",
    "revision": "bf2c6093bf1d0976882b4e7d91ed3ac1"
  },
  {
    "url": "/_nuxt/5a9ced8217cd1c2a1baa.js",
    "revision": "b4276ae5da460f02ab1255ab1e456a37"
  },
  {
    "url": "/_nuxt/608bfcee215064ec9cdc.js",
    "revision": "6d920ae513d30a2c6c20f38c12582659"
  },
  {
    "url": "/_nuxt/6f25f8429e729dd45788.js",
    "revision": "8cc93c420b917a3734f1b6e33a475a47"
  },
  {
    "url": "/_nuxt/706aac078fe4f7366d44.js",
    "revision": "2983defe0f6338e11154a041cd949b86"
  },
  {
    "url": "/_nuxt/77df35514da4df3a22f6.js",
    "revision": "48d4238e0d0444a69db9a0341f328d38"
  },
  {
    "url": "/_nuxt/80388092e2c8ebb500f6.js",
    "revision": "499eda029fed7f7090e520d77a06140e"
  },
  {
    "url": "/_nuxt/8ae8718175968d56738b.js",
    "revision": "2d4b3b2413906aee38fb69e41d868eba"
  },
  {
    "url": "/_nuxt/9731dc02da11282ccc25.js",
    "revision": "d00572961fde4216e1f5010f410a381e"
  },
  {
    "url": "/_nuxt/b1c142cc4540a96760ed.js",
    "revision": "286b7fb6944cf9044d389cf7904ffb44"
  },
  {
    "url": "/_nuxt/ba6cf3f13e300f156548.js",
    "revision": "9f923a0c399b71ac2a69545d44043ce9"
  },
  {
    "url": "/_nuxt/bf8e5381802220a3094c.js",
    "revision": "dbb43e8e3154f271f8eae7ba02fa0ceb"
  },
  {
    "url": "/_nuxt/bfbc64a9de3a29fb28ee.js",
    "revision": "ffb2dabf62d9d0cd5ea58480e402cdf9"
  },
  {
    "url": "/_nuxt/e6b81be7c1bd1a925852.js",
    "revision": "9780f9cdbbd27cb1343bd6e77bdf0700"
  },
  {
    "url": "/_nuxt/ebdc0f6ea016f3ccf028.js",
    "revision": "789e7b270abb28ac3db554c58e26f2fd"
  },
  {
    "url": "/_nuxt/f6fec3e8d43d1d2c08c5.js",
    "revision": "0e9fca90243fa3af73f11ec25d34f8f7"
  },
  {
    "url": "/_nuxt/f95fa412ab7979ffdebf.js",
    "revision": "455f2fc729b434f4de4a8412f47b7c3c"
  },
  {
    "url": "/_nuxt/ff0346f253933b859483.js",
    "revision": "b0183f04ee67460b96d392c38c445249"
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
