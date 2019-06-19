importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/009d19b9e144ae0943c1.js",
    "revision": "6cf7f6d0325ab0bc65a2952cce7c00e0"
  },
  {
    "url": "/_nuxt/03e0ad93cb76cc04a440.js",
    "revision": "e5d8321e533b310846a094dcb1c0c303"
  },
  {
    "url": "/_nuxt/06310ffb19c57f9f5755.js",
    "revision": "26977825481c72f0925c6438c8250a43"
  },
  {
    "url": "/_nuxt/0d4b27b55d39adb3d276.js",
    "revision": "9070af90588fade66cb88fb8af95be14"
  },
  {
    "url": "/_nuxt/36d9e8ebea3f4c705a5b.js",
    "revision": "9f86c201c747cb28f19e180c1cab507c"
  },
  {
    "url": "/_nuxt/3a459bba12f29b1c7d8a.js",
    "revision": "d1dc16ff2942a37681a4c01484fe4d17"
  },
  {
    "url": "/_nuxt/4ee11a95acfeed6de70d.js",
    "revision": "58729602d1e2d4d8454aed5757fdb82f"
  },
  {
    "url": "/_nuxt/636838bed7323da92e2b.js",
    "revision": "43f4c5a50a4b919fc06eed040683fa82"
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
    "url": "/_nuxt/7626ee2e8b7514f28490.js",
    "revision": "49dbd8f89d96f767d97c9a8c77fe45e3"
  },
  {
    "url": "/_nuxt/79e3f85f475c6610b160.js",
    "revision": "02800bd362b62d5d2e14fbc8bc2f6ca6"
  },
  {
    "url": "/_nuxt/7ee7600d6c098e4b1b89.js",
    "revision": "da8e5189c86c10bb8d5f6a498baf769a"
  },
  {
    "url": "/_nuxt/9516fb60125fadd02185.js",
    "revision": "301bfc7757766ddb2043ca00628c6a61"
  },
  {
    "url": "/_nuxt/99e9f7e797ebb9ce8fd2.js",
    "revision": "e2a6f1a6b937e36880f33d6c6af66a8b"
  },
  {
    "url": "/_nuxt/9b23e7f7b0460bee4b22.js",
    "revision": "d5954bec99ae535b72e4ff5f7a3b458c"
  },
  {
    "url": "/_nuxt/ae7b01ed38fbd85e1f38.js",
    "revision": "623047539dca39080274dcd4047bc5c0"
  },
  {
    "url": "/_nuxt/b999ec9d729b6664b532.js",
    "revision": "24b33c491325e985476861f468bbeb89"
  },
  {
    "url": "/_nuxt/c2b44048dc340e8d1042.js",
    "revision": "5c744fee721e1feefbdc58eb69a1bc4f"
  },
  {
    "url": "/_nuxt/c963bf8d225bea5777b6.js",
    "revision": "19f2dff31e1df09ea08430cbe83f18be"
  },
  {
    "url": "/_nuxt/ca98d419373b20306a8b.js",
    "revision": "818d7d5e0ddf8e1e62c8b97c94b46d96"
  },
  {
    "url": "/_nuxt/f0004dfad3af58d2ff63.js",
    "revision": "d455e8fc6d3897d86fce21e2b2caf6a1"
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
