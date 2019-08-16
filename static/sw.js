importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/015334e92fb4955256dc.js",
    "revision": "2e368a58e217b1e82085ee05ea8f3914"
  },
  {
    "url": "/_nuxt/092d8cd070059c12548a.js",
    "revision": "70bb11be07bb4543827a8751a6fb330a"
  },
  {
    "url": "/_nuxt/0a3c8f687207fe27b067.js",
    "revision": "2941ec38581508fd49c34dd98f22847f"
  },
  {
    "url": "/_nuxt/11941a685efdee8be3d1.js",
    "revision": "9ab6297de24dee31fa1befebcf51b27d"
  },
  {
    "url": "/_nuxt/144f234ffd9830946cda.js",
    "revision": "0f002a6805a45ae26e9702fcaeea050c"
  },
  {
    "url": "/_nuxt/18d4c821af14ac03b781.js",
    "revision": "e474b0f298b801dcd120088a32d25269"
  },
  {
    "url": "/_nuxt/1d4e598b1e541979fce3.js",
    "revision": "0561ecd169db64ab7ecddecaa9bf9cec"
  },
  {
    "url": "/_nuxt/299e6a28fe4669eb581e.js",
    "revision": "7fd0484981805376715d3fa5b2890050"
  },
  {
    "url": "/_nuxt/2aef1654fd77ecb6af49.js",
    "revision": "90fd3516389ed3a2f88c70ba29d9308c"
  },
  {
    "url": "/_nuxt/3bbe4e2c0c5dd6208e0e.js",
    "revision": "cac9fcbcc7c74abc4e18429ef342c0ef"
  },
  {
    "url": "/_nuxt/53a099b418bcee0a3290.js",
    "revision": "868ab542b5f3b4ace1573f7f4374eae5"
  },
  {
    "url": "/_nuxt/608bfcee215064ec9cdc.js",
    "revision": "6d920ae513d30a2c6c20f38c12582659"
  },
  {
    "url": "/_nuxt/6e42729b787424f397eb.js",
    "revision": "a06e21868a65cc2711bbb46346acd147"
  },
  {
    "url": "/_nuxt/8ae8718175968d56738b.js",
    "revision": "2d4b3b2413906aee38fb69e41d868eba"
  },
  {
    "url": "/_nuxt/94d6a67803341cae6f32.js",
    "revision": "d3e390bb5e2dcafce3d3d8584b35ce78"
  },
  {
    "url": "/_nuxt/9731dc02da11282ccc25.js",
    "revision": "d00572961fde4216e1f5010f410a381e"
  },
  {
    "url": "/_nuxt/b1de7283d95eaea272d3.js",
    "revision": "bf71e5e2c2d4dddc44fb0d3573691d1d"
  },
  {
    "url": "/_nuxt/bf59423e5e5426d9bcdc.js",
    "revision": "1cad757f366e6ac462b1518ed9acdf2e"
  },
  {
    "url": "/_nuxt/e6b81be7c1bd1a925852.js",
    "revision": "9780f9cdbbd27cb1343bd6e77bdf0700"
  },
  {
    "url": "/_nuxt/f20a49e4b1f99c8bfb37.js",
    "revision": "3d3497beb7ccd02dea7c3b3644fe408f"
  },
  {
    "url": "/_nuxt/f55821e9eaad5d6f9fb6.js",
    "revision": "ee01814f7e17b1007f4eb7e9fc594409"
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
