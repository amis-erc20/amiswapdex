importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/03e0ad93cb76cc04a440.js",
    "revision": "e5d8321e533b310846a094dcb1c0c303"
  },
  {
    "url": "/_nuxt/06310ffb19c57f9f5755.js",
    "revision": "26977825481c72f0925c6438c8250a43"
  },
  {
    "url": "/_nuxt/08360afc79da38f4bcbd.js",
    "revision": "01faeaa8920ca25ab9708f07da7ad789"
  },
  {
    "url": "/_nuxt/0d4b27b55d39adb3d276.js",
    "revision": "9070af90588fade66cb88fb8af95be14"
  },
  {
    "url": "/_nuxt/193684c20fd50d6d24d4.js",
    "revision": "c52c11c87889b110a9aedb299fdb0f3f"
  },
  {
    "url": "/_nuxt/1c18a25ef672816c635d.js",
    "revision": "171809b1a1b7be835f99ba270a967c81"
  },
  {
    "url": "/_nuxt/3a459bba12f29b1c7d8a.js",
    "revision": "d1dc16ff2942a37681a4c01484fe4d17"
  },
  {
    "url": "/_nuxt/45903c2c731378f8650b.js",
    "revision": "ea19c522c55982f311a5d5fc71c6c9a3"
  },
  {
    "url": "/_nuxt/6b3ffd19174054858153.js",
    "revision": "82049fd0579f9bae93710d0c3d602def"
  },
  {
    "url": "/_nuxt/7502c17f9753dec8960f.js",
    "revision": "c5d55747a95bfc8a08e95ac4207eb917"
  },
  {
    "url": "/_nuxt/800058c671fac28263ae.js",
    "revision": "9a121d4b40460a16c0f043bf899a879f"
  },
  {
    "url": "/_nuxt/8f855bb3da8c38eb928e.js",
    "revision": "c9cd4829a47f698ed589cf616e27018c"
  },
  {
    "url": "/_nuxt/9516fb60125fadd02185.js",
    "revision": "301bfc7757766ddb2043ca00628c6a61"
  },
  {
    "url": "/_nuxt/9b23e7f7b0460bee4b22.js",
    "revision": "d5954bec99ae535b72e4ff5f7a3b458c"
  },
  {
    "url": "/_nuxt/b6d78b158b7bc56fd44b.js",
    "revision": "aff8b8b367cf8a90a5ee40346368fdba"
  },
  {
    "url": "/_nuxt/bde68e84ccf2df0f4c31.js",
    "revision": "d767acf7f804482da117c165bb443f40"
  },
  {
    "url": "/_nuxt/c25ce603016d8b7ad6ca.js",
    "revision": "7bac4ce98fd83e5430f7ec7d88872496"
  },
  {
    "url": "/_nuxt/c963bf8d225bea5777b6.js",
    "revision": "19f2dff31e1df09ea08430cbe83f18be"
  },
  {
    "url": "/_nuxt/e0f36ccb0b8f81f2e813.js",
    "revision": "b150a96776f6addca91de73f902cb723"
  },
  {
    "url": "/_nuxt/ecc36671d54d62deb8c7.js",
    "revision": "3013c42c57e559bd6dc0051c8e828bbb"
  },
  {
    "url": "/_nuxt/f04b4d3c3359b304d4a2.js",
    "revision": "e1dbe53c0cad4c7b7c07184af0469cc3"
  },
  {
    "url": "/_nuxt/fcb59249958ee72d391b.js",
    "revision": "84ffb340cbbea6daf3a46447bafcdc15"
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
