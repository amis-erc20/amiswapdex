importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/0ab7210ce7e01ca68b54.js",
    "revision": "827153e5cbeb33440bb0fd4c76c83f00"
  },
  {
    "url": "/_nuxt/1f58c55f3041b31c5be3.js",
    "revision": "27cd8d277cfefa1c8588717d9f860f68"
  },
  {
    "url": "/_nuxt/2067edb5048786e57366.js",
    "revision": "ceb9c14dd06e7b95b775e0d9eea0fb82"
  },
  {
    "url": "/_nuxt/226464465afde21b52d9.js",
    "revision": "4e630620f17768f8817ff0e231f36410"
  },
  {
    "url": "/_nuxt/2c4910c681b06afbef11.js",
    "revision": "8b7457ef607ec591018da04bba9fa938"
  },
  {
    "url": "/_nuxt/2c9305df20597f42ef69.js",
    "revision": "4cb51c7601f1434c2849fdb8cd57b4b3"
  },
  {
    "url": "/_nuxt/3317e7eab6028a2ca4fc.js",
    "revision": "3508fcc7bdaa30ff8994b64fae6a4440"
  },
  {
    "url": "/_nuxt/34aa4e38e4ac7750cafb.js",
    "revision": "b450165f4a4c17a879c99dba54466d62"
  },
  {
    "url": "/_nuxt/3567ad15a05335a6d76c.js",
    "revision": "31bbab27df70977fe3d6c948b99b9176"
  },
  {
    "url": "/_nuxt/36400be01534c3c1cfd7.js",
    "revision": "4887f6162cf46e0e2ba8a48d94ea5c7b"
  },
  {
    "url": "/_nuxt/36c66c8743833c270961.js",
    "revision": "895e3849ce2e401218d86dccbb3d05fe"
  },
  {
    "url": "/_nuxt/37d9cd5a9f7d2083ff85.js",
    "revision": "236bc592c2e1308646458dba83045825"
  },
  {
    "url": "/_nuxt/380af0a6bc6b0c6d1f4b.js",
    "revision": "908f67061ad5eaca9b84249cbbc0c535"
  },
  {
    "url": "/_nuxt/4500c7e8b0a2235afd35.js",
    "revision": "7836a4a127ed47d7ba630566115d3bcf"
  },
  {
    "url": "/_nuxt/6b47efc06b98eb23b849.js",
    "revision": "40b114cdabb2f9452a31ce88227e412d"
  },
  {
    "url": "/_nuxt/6cc5b6ff2bfd7e7bba28.js",
    "revision": "4ae4d396049c5ac4e53e323483c076d7"
  },
  {
    "url": "/_nuxt/7a87c0258423944fec5b.js",
    "revision": "f4e6fe3de02bdb83731d5cd3276057e7"
  },
  {
    "url": "/_nuxt/87dd9a60d392eacfbc94.js",
    "revision": "6065c3cb24f0a85f1d4aa7e57e387a94"
  },
  {
    "url": "/_nuxt/8b6a27b2dea1fb8391fc.js",
    "revision": "af9cceeadceb5e100e64947ece052462"
  },
  {
    "url": "/_nuxt/9643a836cd464cb4bc62.js",
    "revision": "5c56a5ab9d83d884a3b2b8cfd9997586"
  },
  {
    "url": "/_nuxt/974e60e103cc05c64794.js",
    "revision": "4f41acdbd5633b42f489694355abc2dc"
  },
  {
    "url": "/_nuxt/9cc2cf2c95853146f608.js",
    "revision": "0d4d6a99e5a5430826517d5620cd6a45"
  },
  {
    "url": "/_nuxt/9e6585ec04d168d4b94f.js",
    "revision": "acf8a926577386394328fb641ed99d06"
  },
  {
    "url": "/_nuxt/a862cd5293cbc83188c9.js",
    "revision": "5c391d9600f4065106797691f777e300"
  },
  {
    "url": "/_nuxt/aafead530c36697025b6.js",
    "revision": "d5c5887fcc348c1d644e8b930c5facef"
  },
  {
    "url": "/_nuxt/d785a6ae2617a1865454.js",
    "revision": "dccea851390727242a82b409e38f0941"
  },
  {
    "url": "/_nuxt/e9e163d1a55d9cf068bc.js",
    "revision": "2843738a5b71a1e0275d6e8197572e2e"
  },
  {
    "url": "/_nuxt/ef9fdfb77c748b92000e.js",
    "revision": "4434d6c485e62f1fad57c0403fd8a135"
  },
  {
    "url": "/_nuxt/fad637640b0a1ab458d4.js",
    "revision": "40aac05876150348b6380ad6e531c1f7"
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
