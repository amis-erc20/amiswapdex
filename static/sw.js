importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/01dd8907c8db9e351011.js",
    "revision": "1534aa258b86db0516b1036d118d123c"
  },
  {
    "url": "/_nuxt/093fa4c7033ce3039ec8.js",
    "revision": "09c9fc4fbc3303e4f024419e32fb185e"
  },
  {
    "url": "/_nuxt/09b2d669ef6285127e65.js",
    "revision": "313f4f8911185b55b93e1d415218cccd"
  },
  {
    "url": "/_nuxt/242aa48ccb78ef425bba.js",
    "revision": "04fa4e34c2567b35bd64b2970b0abf2b"
  },
  {
    "url": "/_nuxt/25f1b7d14a39412468fc.js",
    "revision": "146830592aa1aa7d502f9c74f64d4198"
  },
  {
    "url": "/_nuxt/2dac5912451855d9f538.js",
    "revision": "fa99053f75c6f6b169e7ba6663fcc53c"
  },
  {
    "url": "/_nuxt/408ae55a73251b22b835.js",
    "revision": "12532e432ba8dbc32157d340b5aef01e"
  },
  {
    "url": "/_nuxt/54c8c2029bcc8d907047.js",
    "revision": "f66e83d6cb35c28ae2b689b8109d060c"
  },
  {
    "url": "/_nuxt/5cfa23fdcd05a3589ea7.js",
    "revision": "50bbe20efbb2af22f6192372d56df297"
  },
  {
    "url": "/_nuxt/6b1bd583b13e92808e2b.js",
    "revision": "a45e922ad0727d3ef367503ea3b68ef4"
  },
  {
    "url": "/_nuxt/6ef3e98f6fb097cbcca5.js",
    "revision": "31ac98b2f6024778a63b790484ac6ec2"
  },
  {
    "url": "/_nuxt/7d9996bb468aebf0c615.js",
    "revision": "838d4e90e6f8206b97188cc97eafd1bc"
  },
  {
    "url": "/_nuxt/7fa6e8371c8e7254140e.js",
    "revision": "c913323a94e674e3d6b03c5d82752f26"
  },
  {
    "url": "/_nuxt/83d170c7955f1ea3aa5f.js",
    "revision": "66e10025b27e68cddb1cca809b5ed1f6"
  },
  {
    "url": "/_nuxt/8f6a48be05090e5870a1.js",
    "revision": "c5454e9eb23ee36d7f215d5142dce6fa"
  },
  {
    "url": "/_nuxt/943ae63c6219116d6413.js",
    "revision": "d141d1da76621d8fbc110f635bbac6e0"
  },
  {
    "url": "/_nuxt/9547af334166cc683b4c.js",
    "revision": "1e3340d95b8a27d71f31cc2e1b1457ea"
  },
  {
    "url": "/_nuxt/a40c07e5f89b94aef57d.js",
    "revision": "beeb3b218c2b31f9c1e6f3eeda32d75a"
  },
  {
    "url": "/_nuxt/a4a7d3ca421df66cdbd0.js",
    "revision": "7509024f162ed4057e076e0209b01b88"
  },
  {
    "url": "/_nuxt/a7598c9ac29951a8d891.js",
    "revision": "b5801ba718b161bbee3d6145fd1b8322"
  },
  {
    "url": "/_nuxt/bf1f23d4594497936020.js",
    "revision": "3b2c7b969b060ee67ef64fbd190438c8"
  },
  {
    "url": "/_nuxt/c1645e93a11670d28382.js",
    "revision": "d10327c9d5bc122cd3e6d836a65c0749"
  },
  {
    "url": "/_nuxt/c3948c160713d815db2e.js",
    "revision": "f449d537e32d9c66976f396c5705a4f6"
  },
  {
    "url": "/_nuxt/c66a731106c3d698506f.js",
    "revision": "efc7db5e9c2160966f15b49d3ca073df"
  },
  {
    "url": "/_nuxt/d439c3f8589140eeaec9.js",
    "revision": "cad73c7a9397fe24c9ecf0e06431dbf6"
  },
  {
    "url": "/_nuxt/d474bae1788f5d1ef783.js",
    "revision": "5d2eba845ebf80cddc8eab03c396cfc5"
  },
  {
    "url": "/_nuxt/f3e1bb6a64a735c68b04.js",
    "revision": "a4ab50fe2e5a7d24868aae670a33b901"
  },
  {
    "url": "/_nuxt/fd5ae787aa0095792ed0.js",
    "revision": "1499adf763a1afc55307ddbd37da49c6"
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
