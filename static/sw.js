importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/0562d3dd10aa5a69f2ed.js",
    "revision": "a8ce87add25deb8f6763fd883f897219"
  },
  {
    "url": "/_nuxt/0ca3a461648e83c79dce.js",
    "revision": "29cd25d3ad0264f54ad9d1f08bacdbff"
  },
  {
    "url": "/_nuxt/17f68e9061f562759521.js",
    "revision": "cf0cef5ed7ac77dba5a2edde47aceac6"
  },
  {
    "url": "/_nuxt/204ec1b0006621743fdc.js",
    "revision": "452e84c5554b98d54d5d92d530be9760"
  },
  {
    "url": "/_nuxt/27fd544e23c2821107b1.js",
    "revision": "b3f69503bede1bec51c20917764211f2"
  },
  {
    "url": "/_nuxt/284f32b6ae0f31d09609.js",
    "revision": "92f94140d6685100d7583b12129283fc"
  },
  {
    "url": "/_nuxt/36370dbcc7bb0d8f85f9.js",
    "revision": "9b5a41f624a0b674f2ed3ad6517f6611"
  },
  {
    "url": "/_nuxt/4a3a482544501411a64c.js",
    "revision": "722bccc70437a9263ea785c93cdd375e"
  },
  {
    "url": "/_nuxt/50b33e864705265db90d.js",
    "revision": "15b83ece5db1754c4b83b7233f969bae"
  },
  {
    "url": "/_nuxt/5fdeeee2104c818daafd.js",
    "revision": "16033bdaa5c1aadec39c331ece0cd24e"
  },
  {
    "url": "/_nuxt/66d38ff9d5a35c0b815c.js",
    "revision": "3c56a9e72593fd9d9adac7c0ace084a0"
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
    "url": "/_nuxt/8683139f7f7f4aec200d.js",
    "revision": "eaafe1de6bb2a64759224cf94909301b"
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
    "url": "/_nuxt/9c419ada86f3f506e409.js",
    "revision": "d9ea583dffa2235df8954a51971cae46"
  },
  {
    "url": "/_nuxt/a7b47d0031c9e9000fa7.js",
    "revision": "f10245226aad2e720f0c163f6c594ca8"
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
    "url": "/_nuxt/c2b40bfd1161c559c754.js",
    "revision": "ffd01a85011172ce255e36d3733cc609"
  },
  {
    "url": "/_nuxt/c89aeaaa47ca707b9381.js",
    "revision": "f44c4f7f36ee45fc449aa66aeeba738a"
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
    "url": "/_nuxt/e2fc8a92e5f964a6b544.js",
    "revision": "acac5573ff1398cde6700276d5c84257"
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
