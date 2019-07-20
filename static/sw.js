importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/0a3c1a655ab073daa386.js",
    "revision": "ec012e18c5429ae70aaffcbb4f8ca515"
  },
  {
    "url": "/_nuxt/0a6d201440fd4f7337ac.js",
    "revision": "7c52dfdb721c976c9c9abcac439eb5ec"
  },
  {
    "url": "/_nuxt/0ea239fb734d0cbfe164.js",
    "revision": "dc7a950ef953dc04e6e1bba1efabea4a"
  },
  {
    "url": "/_nuxt/11941a685efdee8be3d1.js",
    "revision": "9ab6297de24dee31fa1befebcf51b27d"
  },
  {
    "url": "/_nuxt/17dcd685111a05f32d5f.js",
    "revision": "0029fdb5bcdec48ede13c4a9204cc8cb"
  },
  {
    "url": "/_nuxt/1c631b4d2bbbdd95a099.js",
    "revision": "94258ae2b2a551fb21e749cde9a4597f"
  },
  {
    "url": "/_nuxt/1de6810c6d6fdf1b77ec.js",
    "revision": "9bc817b9162de9f6ed64f64cb106dc5f"
  },
  {
    "url": "/_nuxt/3e5d1e505ca9085685fa.js",
    "revision": "2a966d19e82b545c21f9c5c2433d523d"
  },
  {
    "url": "/_nuxt/4a81e5b721bc07b8f2bf.js",
    "revision": "9e9102905aef5b092c01c8f5879ea9da"
  },
  {
    "url": "/_nuxt/60f36f6e9581b670db2d.js",
    "revision": "c39514bcc99c38a7167820f106593057"
  },
  {
    "url": "/_nuxt/6883e86e145d135b2946.js",
    "revision": "7b1ca8a72ca0dba15d0d01736a4cf5fc"
  },
  {
    "url": "/_nuxt/6e5359ceaf744594cdfc.js",
    "revision": "7e63c9951703d733ca068ef97d7f3925"
  },
  {
    "url": "/_nuxt/8ae8718175968d56738b.js",
    "revision": "2d4b3b2413906aee38fb69e41d868eba"
  },
  {
    "url": "/_nuxt/9341828641f29231ab76.js",
    "revision": "f295c53dcf61781bf0808b8236daa208"
  },
  {
    "url": "/_nuxt/a8d528d4da785ce79162.js",
    "revision": "c88b0c674039dda26da185fedb9ca6f6"
  },
  {
    "url": "/_nuxt/ac0c8389ef585b8a1d62.js",
    "revision": "7e1892a28536aab465205dc87992bd1e"
  },
  {
    "url": "/_nuxt/bc853e102e8332a82cd1.js",
    "revision": "458756e1a1e8c97dee0dfc04ef44349d"
  },
  {
    "url": "/_nuxt/d26b3b84410262cae2d4.js",
    "revision": "5617302c59e3c02b53a82010994b849f"
  },
  {
    "url": "/_nuxt/d3007e06bf39107f77fc.js",
    "revision": "ff337f8a8815abb566dd77487f51fd46"
  },
  {
    "url": "/_nuxt/d829d714364642232f6c.js",
    "revision": "f81b68222e73e090c7450131f64447c4"
  },
  {
    "url": "/_nuxt/e5212c96092740329b2c.js",
    "revision": "a74839063700866ca5c5ec2f314ef287"
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
