importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/18323c5c2223cbbd78b5.js",
    "revision": "aa75b0eb765604f7a185108676ec20de"
  },
  {
    "url": "/_nuxt/196e6a4daf413ee54c17.js",
    "revision": "9e78499581d3261be706d96ae75cee54"
  },
  {
    "url": "/_nuxt/1aa9529468a6156b1210.js",
    "revision": "9e41c847e023994ac42fb2f35d33d2ba"
  },
  {
    "url": "/_nuxt/26b7e930309b911c5f0a.js",
    "revision": "33316532e4c4042cb4a2fc5ca44cc9ba"
  },
  {
    "url": "/_nuxt/3632730343ad0f292417.js",
    "revision": "a9f01a5de735c7b7e1cc4925b55037e6"
  },
  {
    "url": "/_nuxt/447a1af7917382c08251.js",
    "revision": "9a3d0fdc5b0245d2bee40f4d4d298971"
  },
  {
    "url": "/_nuxt/4dd800952e77824e010a.js",
    "revision": "a1407bdb44dad19bfe7f733eb4fe8648"
  },
  {
    "url": "/_nuxt/4e20fbaf58e4fb34c1be.js",
    "revision": "d3bf479d8328e0a55cb084ca079b2570"
  },
  {
    "url": "/_nuxt/53e90def1879299e8b64.js",
    "revision": "5e22134ad8008fd5181a83de5f223764"
  },
  {
    "url": "/_nuxt/6af63610e74068f61e3b.js",
    "revision": "8e30d9d34e6d1730c5cf94626b148bb9"
  },
  {
    "url": "/_nuxt/70f5896ee03030ed037f.js",
    "revision": "c3ed3e0673df3a43783a0d8efa25267e"
  },
  {
    "url": "/_nuxt/7376ddcee864b97e7fe9.js",
    "revision": "48bb084bde005e78baeea6636071897d"
  },
  {
    "url": "/_nuxt/7d09238937d614dcf98c.js",
    "revision": "4577b06b8c0c1d9ee18e22dd1ecff2fe"
  },
  {
    "url": "/_nuxt/82e536aa0fb0e6f2f8d6.js",
    "revision": "94244d625ca6cc15b47cfb51a9860363"
  },
  {
    "url": "/_nuxt/b14ef370e12a23e7d4b7.js",
    "revision": "1f7c72ae27c14c631402924b94b910fa"
  },
  {
    "url": "/_nuxt/b5f694753c8b7e7f2c66.js",
    "revision": "716c4e68555ef78e060383908c03d863"
  },
  {
    "url": "/_nuxt/b628315ac8f4ba834c2b.js",
    "revision": "c95f93cff9594df8a1c554be41dc02a4"
  },
  {
    "url": "/_nuxt/bdf9c40312c92a2c4667.js",
    "revision": "cf9db9720897ed66cbbf5b12339a6e8e"
  },
  {
    "url": "/_nuxt/cd442c5df1305750f973.js",
    "revision": "dad265c163c109db5e825e29ef0e7533"
  },
  {
    "url": "/_nuxt/e6c34e97cc5b2a06bad1.js",
    "revision": "48a70983dac028dd6379f80b69bcb1f1"
  },
  {
    "url": "/_nuxt/e6f8f5e229d737336b6a.js",
    "revision": "fa3900d904d33ecc2695d6b096118633"
  },
  {
    "url": "/_nuxt/efde1692f722835415e0.js",
    "revision": "5dc372541daacda95cd74a6b1c15da82"
  },
  {
    "url": "/_nuxt/f64f4099cbf99f648683.js",
    "revision": "a10471680d930e45f16b0ca8ecc13610"
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
