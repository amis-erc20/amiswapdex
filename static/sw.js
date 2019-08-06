importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/082a649fd8ac5a108005.js",
    "revision": "3b505965aea91c92af562cf34ab37f60"
  },
  {
    "url": "/_nuxt/13036d1814da24d84347.js",
    "revision": "fc58ce4001df206e9dcef39799768480"
  },
  {
    "url": "/_nuxt/144dec132db9efed42f9.js",
    "revision": "240cf9ef9062cdb311c60d698155fd2e"
  },
  {
    "url": "/_nuxt/2b65eb9d1e6ae5a52495.js",
    "revision": "64f7095d24852456860525ec82b8327c"
  },
  {
    "url": "/_nuxt/3ffedad15f642d041faf.js",
    "revision": "098841dc587ece3f23072d1f77330848"
  },
  {
    "url": "/_nuxt/4d57c5a98aa6a1af7d2e.js",
    "revision": "37780d697cfbeaf280482ec75defc72d"
  },
  {
    "url": "/_nuxt/5289a8f36cbab2c57ffe.js",
    "revision": "bd84ddea50bdeea93d791cda4900cfde"
  },
  {
    "url": "/_nuxt/5fddc5b578d3008a231b.js",
    "revision": "9780f9cdbbd27cb1343bd6e77bdf0700"
  },
  {
    "url": "/_nuxt/60a35539a7ea7ae786ad.js",
    "revision": "06dea24cb237b07163acfc8e38ef238f"
  },
  {
    "url": "/_nuxt/6665b2b6f1fc90708e61.js",
    "revision": "37d89df0257a7aec8eb26ed26379b40e"
  },
  {
    "url": "/_nuxt/7f4cee73643f122409e0.js",
    "revision": "cd34a3d89cc2e48fef112bafb8026b7c"
  },
  {
    "url": "/_nuxt/8a5ea8e17505cb6debfa.js",
    "revision": "bcbf95990a9805274319da9740e743b6"
  },
  {
    "url": "/_nuxt/8c4339936b703e637875.js",
    "revision": "3f368795218a0893446f0de17c0467b3"
  },
  {
    "url": "/_nuxt/94c1547d3e1503164d35.js",
    "revision": "488eb089d7be8e36bd997e8f7c2dba53"
  },
  {
    "url": "/_nuxt/9f37eed8623b6b8aa032.js",
    "revision": "d78b985f3b14bf82f9ecf1df5d94805b"
  },
  {
    "url": "/_nuxt/a3cb76c4c1ea1c458390.js",
    "revision": "b7342b24825d2b76f1338f60cfe4bdf3"
  },
  {
    "url": "/_nuxt/b57f1de1f222c7275397.js",
    "revision": "7704693fc5448f2e0d208dee31d2c24b"
  },
  {
    "url": "/_nuxt/bd1c5f75f06043c46345.js",
    "revision": "06114ae14e034a081d1ad4ee374b9167"
  },
  {
    "url": "/_nuxt/dd678e20291acdc20158.js",
    "revision": "96dbcd9026d0f507276e20204aab9f08"
  },
  {
    "url": "/_nuxt/f34dff17c924d4468ef0.js",
    "revision": "319c703521f88cef1c1219db08368a11"
  },
  {
    "url": "/_nuxt/fc687767813ae0547541.js",
    "revision": "8a5c248e70328fb54c1db135571fefd7"
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
