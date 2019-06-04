importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/013cfc3a4587d2d76059.js",
    "revision": "7b075d4873176814a35e3938a526dd91"
  },
  {
    "url": "/_nuxt/0340bd489bbbaf9f0898.js",
    "revision": "55c3aaddd91ff31ad842a9214c02e10e"
  },
  {
    "url": "/_nuxt/06dbd59bb3a4ab14f789.js",
    "revision": "0ddf8238a8ae8bdfbe643b02b7295072"
  },
  {
    "url": "/_nuxt/0d02fea41806724d6d27.js",
    "revision": "1715242aa1a878a5e21bb60a5e4ae689"
  },
  {
    "url": "/_nuxt/1af8ab1558dea58052a3.js",
    "revision": "5920fe51980416a2cd8899f00da5f57a"
  },
  {
    "url": "/_nuxt/1c4ca38acd6482f4a91a.js",
    "revision": "a6ad563d9aa9b0bbdb761410becbee96"
  },
  {
    "url": "/_nuxt/2e5f67e0b3be0937b0a8.js",
    "revision": "ea0a86d666d47b76ae110606eaedab1b"
  },
  {
    "url": "/_nuxt/4cc2c353584b9ea51e9d.js",
    "revision": "722c7a032719c00d20789949019f1028"
  },
  {
    "url": "/_nuxt/52bab6b75b2d38076c67.js",
    "revision": "d50f1851789ff899ee2c8246c2c45d5b"
  },
  {
    "url": "/_nuxt/63b8f2abf6892ba1c8bd.js",
    "revision": "297ea92057909db48ef63e8bc59e3715"
  },
  {
    "url": "/_nuxt/6d8c22d09f9d3a98a5a9.js",
    "revision": "6e6578b612a7b24818e0e8cf72e3f71b"
  },
  {
    "url": "/_nuxt/74c253f339bdb17a11df.js",
    "revision": "82fea45a886dc0d7f2fc90b30d86a631"
  },
  {
    "url": "/_nuxt/82c8582055c7560ebdf8.js",
    "revision": "8d4cfef0758695ff5304989aa7f901ae"
  },
  {
    "url": "/_nuxt/83d26b159d0d777a5482.js",
    "revision": "0ee83038ae03621e0e324131ee9004a9"
  },
  {
    "url": "/_nuxt/88d678cd70817cb4b26a.js",
    "revision": "1e2478e018ffb909d98d6a3d43ca2872"
  },
  {
    "url": "/_nuxt/8d9f6fe5b6f9a872eee0.js",
    "revision": "044863b1ebf6af99e81bfe31992751b4"
  },
  {
    "url": "/_nuxt/9753fcba5b2f977f9af2.js",
    "revision": "19ef896bd9ee1e52737bef39148477d5"
  },
  {
    "url": "/_nuxt/989a5ab378096181c330.js",
    "revision": "6590ae05afc3b91046e697d98dc573dc"
  },
  {
    "url": "/_nuxt/a6280cc1338456a028c2.js",
    "revision": "0a5fa76028da425c1a4e159bf7b7fa7f"
  },
  {
    "url": "/_nuxt/ce52fb7b96eb56e14075.js",
    "revision": "8a9c27ae2cf8c47fe49853b009f22bff"
  },
  {
    "url": "/_nuxt/d84347e7b9f938184fa7.js",
    "revision": "2ce98b0b429a10939481fadf91b42b2d"
  },
  {
    "url": "/_nuxt/e357449f8c3bd74d2fc4.js",
    "revision": "8bde5ee65ef688c7d116970b95c50b70"
  },
  {
    "url": "/_nuxt/e70ee9706c95856be75b.js",
    "revision": "691f341ede2fafa41359d04e213174f1"
  },
  {
    "url": "/_nuxt/e7904d98bbe0009eb8af.js",
    "revision": "ae32a4cf34a2f58fde6cccff7e3b931d"
  },
  {
    "url": "/_nuxt/e996a9333ed1bef62b03.js",
    "revision": "95d62011a34480081a63a6894e0a11df"
  },
  {
    "url": "/_nuxt/e9ac22288bc7c6a5395b.js",
    "revision": "84a01c72279ef814eb3ae80f78bf4d65"
  },
  {
    "url": "/_nuxt/f46c5dd81d2f34a4914d.js",
    "revision": "09ababa4cafd20b41137f54fe623861a"
  },
  {
    "url": "/_nuxt/fbe0d307d020af8c07a9.js",
    "revision": "9942917a52db9929cbd326d66f51c552"
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
