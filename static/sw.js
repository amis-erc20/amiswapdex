importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/0dc34f6a28d946c27aa1.js",
    "revision": "430cd2950e2ff75eafd1c5587d0b6e70"
  },
  {
    "url": "/_nuxt/0de322b29f10a29300c4.js",
    "revision": "439e9c08ae1c38db0844dba81ad13adb"
  },
  {
    "url": "/_nuxt/127eae1d6ce14cbed5cc.js",
    "revision": "e1afdb41ce6e8d2703f86065f458d9de"
  },
  {
    "url": "/_nuxt/3d7ee4365260611a3740.js",
    "revision": "725a3df7c4058be6881ea967cda10191"
  },
  {
    "url": "/_nuxt/43a6cd85f82bc34c311c.js",
    "revision": "7559ea252c40876e019d5cc93790fa0f"
  },
  {
    "url": "/_nuxt/503c0bf94c3122c19b10.js",
    "revision": "74b9819d644c6768ae026db4d0ea2dd6"
  },
  {
    "url": "/_nuxt/56c4f94e136b3b0cf74b.js",
    "revision": "6da2fe600f41ebb52e42ffea96ae1c56"
  },
  {
    "url": "/_nuxt/575af812c6cf62502d86.js",
    "revision": "a952ec21d6db8e93c05606103150655f"
  },
  {
    "url": "/_nuxt/5998f151137f048d0cf2.js",
    "revision": "173626ddf71f80619ae59194a1dfc23e"
  },
  {
    "url": "/_nuxt/66ee51209da53c7e8e1a.js",
    "revision": "a4717beb6bcf24b402ea5dce3b498a69"
  },
  {
    "url": "/_nuxt/67e9541f2baa4a35e91e.js",
    "revision": "7d49a013c174364cdc8b642845dc8f20"
  },
  {
    "url": "/_nuxt/840af265b32007fa1175.js",
    "revision": "ca25af07639ec041a56a9cac4dfd9e96"
  },
  {
    "url": "/_nuxt/ac6d99b842a9026805b2.js",
    "revision": "c08434b70c9495c05c235fd7929a63e9"
  },
  {
    "url": "/_nuxt/b035e92c6f8b26cbfebc.js",
    "revision": "5ab05ce3449e2a3b3882a5595641242c"
  },
  {
    "url": "/_nuxt/b2871ee4f53542bf77ce.js",
    "revision": "f04bb69222aa8307c0a4f122e5ee6cc3"
  },
  {
    "url": "/_nuxt/bc99494e3e98184dc5df.js",
    "revision": "50817cac317464cb356eb9feb7d30320"
  },
  {
    "url": "/_nuxt/be1690cc84d0edc95218.js",
    "revision": "420ae7a348d0d5880b80769d1d743003"
  },
  {
    "url": "/_nuxt/c96670dd2b0ff6840086.js",
    "revision": "50785f60db45ad053778da08b84f0e45"
  },
  {
    "url": "/_nuxt/cdeb019627171ddfb0f9.js",
    "revision": "09d02979460a48dcebb939b4f19c9e9e"
  },
  {
    "url": "/_nuxt/d033b5485e7efdce1a88.js",
    "revision": "5ae15c51deaa454618c9d3de2005cf47"
  },
  {
    "url": "/_nuxt/e8abab670edcb520cf2b.js",
    "revision": "ca53ba37a3a0055361c471c988ff07a9"
  },
  {
    "url": "/_nuxt/ea17e4c39f465bfde4ce.js",
    "revision": "d315c7e3c4fec66cef1d9ad16abfbef5"
  },
  {
    "url": "/_nuxt/ee6e71e9725399bd5673.js",
    "revision": "4f026e3df26579d827ce4938fe98037e"
  },
  {
    "url": "/_nuxt/f583ef322b647567f54b.js",
    "revision": "21577dd1d69b7a9c3534f0a87ff7e6a9"
  },
  {
    "url": "/_nuxt/fc6211e965409440ceb7.js",
    "revision": "8e291f984225cf836c160539d9be2e94"
  },
  {
    "url": "/_nuxt/fdfd62b6398f1d7476da.js",
    "revision": "49c6683ec9aef608c74e030da968d3fd"
  }
], {
  "cacheId": "web-wallet",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
