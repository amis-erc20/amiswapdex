importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/006a1a8af328c9d0a063.js",
    "revision": "34477d2c087080153c464b665edbef1b"
  },
  {
    "url": "/_nuxt/10f915fba6ff267868cf.js",
    "revision": "5f4c4e612e22701e1d329e15ba3ebee3"
  },
  {
    "url": "/_nuxt/11cbb1a3d0911d330421.js",
    "revision": "05f4a5655c60adb35f8deb93ac63f129"
  },
  {
    "url": "/_nuxt/18323c5c2223cbbd78b5.js",
    "revision": "aa75b0eb765604f7a185108676ec20de"
  },
  {
    "url": "/_nuxt/196e6a4daf413ee54c17.js",
    "revision": "9e78499581d3261be706d96ae75cee54"
  },
  {
    "url": "/_nuxt/3234dc63e0c47cbf3f35.js",
    "revision": "3b67983e332d994609256010352aca5c"
  },
  {
    "url": "/_nuxt/3cfa5f6ff541b616d8e1.js",
    "revision": "73033412f5fe87da82fb747c2e8d9a47"
  },
  {
    "url": "/_nuxt/41e53dcfe9612105c7c8.js",
    "revision": "0857beec550bbc5b67086b4e1a7dffcc"
  },
  {
    "url": "/_nuxt/4e20fbaf58e4fb34c1be.js",
    "revision": "d3bf479d8328e0a55cb084ca079b2570"
  },
  {
    "url": "/_nuxt/65d4891d7a5d00ca9e78.js",
    "revision": "d086f8fc63beb9d14d1b6d993af2c0fa"
  },
  {
    "url": "/_nuxt/6af63610e74068f61e3b.js",
    "revision": "8e30d9d34e6d1730c5cf94626b148bb9"
  },
  {
    "url": "/_nuxt/734eb634146d4226fc06.js",
    "revision": "eb405ea5e838347e69c03ea09ef42b90"
  },
  {
    "url": "/_nuxt/803987ecd69fc7028a56.js",
    "revision": "2126ef64a72b72f132fc186cf3cdfda0"
  },
  {
    "url": "/_nuxt/8cc00c00ba09dbdb6509.js",
    "revision": "99d00ca83495b6fcb4813db58985a46a"
  },
  {
    "url": "/_nuxt/9f0eeb2b064b0453018e.js",
    "revision": "32a36a4525f986dde47d99807e1ca137"
  },
  {
    "url": "/_nuxt/b5f694753c8b7e7f2c66.js",
    "revision": "716c4e68555ef78e060383908c03d863"
  },
  {
    "url": "/_nuxt/dca7fb388253e392e4e0.js",
    "revision": "020844ce58b8aaf5036b6f1ad783911a"
  },
  {
    "url": "/_nuxt/df7058a4433772210750.js",
    "revision": "5d12c5338d767391b26b064091c50587"
  },
  {
    "url": "/_nuxt/e6f8f5e229d737336b6a.js",
    "revision": "fa3900d904d33ecc2695d6b096118633"
  },
  {
    "url": "/_nuxt/e7b6720682e5c7903c7c.js",
    "revision": "b1e494a59ed6d1df1661495abed5af10"
  },
  {
    "url": "/_nuxt/e7d88f83c7f7c58d2011.js",
    "revision": "89f6a2c63ed0b288042d3dc4be1a7ed6"
  },
  {
    "url": "/_nuxt/e99c246e6aaaa55060de.js",
    "revision": "8d076aebf5d827628bb846efda31e0d8"
  },
  {
    "url": "/_nuxt/ef440693a699e6e24bb0.js",
    "revision": "dfba67c0caa0b16681c2cb372c35d468"
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
