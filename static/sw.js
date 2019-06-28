importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/204ec1b0006621743fdc.js",
    "revision": "452e84c5554b98d54d5d92d530be9760"
  },
  {
    "url": "/_nuxt/35160719efb1785feb46.js",
    "revision": "3843a4bbb7b6aab0404dbfe37a4a520b"
  },
  {
    "url": "/_nuxt/36370dbcc7bb0d8f85f9.js",
    "revision": "9b5a41f624a0b674f2ed3ad6517f6611"
  },
  {
    "url": "/_nuxt/40d3a7348a88452b4e6e.js",
    "revision": "856d5ed34cafdf49d5e88f0d0ac25325"
  },
  {
    "url": "/_nuxt/50b33e864705265db90d.js",
    "revision": "15b83ece5db1754c4b83b7233f969bae"
  },
  {
    "url": "/_nuxt/66d38ff9d5a35c0b815c.js",
    "revision": "3c56a9e72593fd9d9adac7c0ace084a0"
  },
  {
    "url": "/_nuxt/71d5185cb3e3a2e17173.js",
    "revision": "1ef7f85a5e730082e81fafbde1fd30e8"
  },
  {
    "url": "/_nuxt/76fa44eee8989571b597.js",
    "revision": "5398390b5a21d9efb914040a123819fb"
  },
  {
    "url": "/_nuxt/7c7f2fd0d93d106d94a2.js",
    "revision": "97c4e88f0ba29c719d5e781d2de3a6a1"
  },
  {
    "url": "/_nuxt/7cfa077cfd06578222d6.js",
    "revision": "23cb9ca160532e574e4bbe772aca8435"
  },
  {
    "url": "/_nuxt/8683139f7f7f4aec200d.js",
    "revision": "eaafe1de6bb2a64759224cf94909301b"
  },
  {
    "url": "/_nuxt/896c18f44f18b1da04cd.js",
    "revision": "6ec3a2b3c70c91c5c40dee4a256aa395"
  },
  {
    "url": "/_nuxt/8e953881b7862a032531.js",
    "revision": "2ff50ef32a5828ed4804612d50349c2f"
  },
  {
    "url": "/_nuxt/9374bf6de7de86abf179.js",
    "revision": "0d784d19ab9bf99396ecbd1103b77dcd"
  },
  {
    "url": "/_nuxt/9e89154c531d1a232556.js",
    "revision": "0060661103ac60300137cb5e700bb6a6"
  },
  {
    "url": "/_nuxt/adff2a7a4db51b2a1732.js",
    "revision": "4e4cd21d3200c0de360478577b0aef5f"
  },
  {
    "url": "/_nuxt/b66399d410c5c168e5ff.js",
    "revision": "f073788940acdccc8c0e518608a13ab1"
  },
  {
    "url": "/_nuxt/c80a82706df1f095b1f7.js",
    "revision": "bdad765bfd749aa29b3115b6af4f0bd4"
  },
  {
    "url": "/_nuxt/cfdc59a2e9756ab6a91b.js",
    "revision": "83248c15628d0eb714d79a9216f223a7"
  },
  {
    "url": "/_nuxt/d55573083b80b3ec19aa.js",
    "revision": "3d7528553b05f771814ac37ccece1618"
  },
  {
    "url": "/_nuxt/d86f3cf8c936823b1530.js",
    "revision": "2724452da6362c7f3e5dd8688bb2b7bb"
  },
  {
    "url": "/_nuxt/e0d99db244db949b9d2a.js",
    "revision": "dfb41e5bd5f6d090f96b9b47f879230e"
  },
  {
    "url": "/_nuxt/e2fc8a92e5f964a6b544.js",
    "revision": "acac5573ff1398cde6700276d5c84257"
  },
  {
    "url": "/_nuxt/f27c439e4da8c14aafad.js",
    "revision": "9eb5e704f6dd576358ba666008c453ec"
  },
  {
    "url": "/_nuxt/f3d9782045eb55cd99cf.js",
    "revision": "a719567f2890fd636ef444ead190aa41"
  },
  {
    "url": "/_nuxt/f4f073075409938fb1f5.js",
    "revision": "0c53a28b3dc9bd6c790314843662049e"
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
