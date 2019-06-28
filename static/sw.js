importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/193d0fbcf1cb2a81d1a1.js",
    "revision": "6fd09ad06461ff18dbc5f41fafc5eef9"
  },
  {
    "url": "/_nuxt/1e64d355946c5f3bbde7.js",
    "revision": "638af179bceea201586b8a21326f1c5a"
  },
  {
    "url": "/_nuxt/2e90bb8746f7591084de.js",
    "revision": "119ce8ac271e51c4712572d22da6af6a"
  },
  {
    "url": "/_nuxt/3200b1a0e00f3f1e31fd.js",
    "revision": "542836cb8cb427a47ecc649cf8adb55e"
  },
  {
    "url": "/_nuxt/3c637542ddb71c7f1711.js",
    "revision": "0491b0bcbffc3c2abd6aace29a04c287"
  },
  {
    "url": "/_nuxt/4432d7f409420dd5aae1.js",
    "revision": "602209d96ba3ae40ca09b187ac317627"
  },
  {
    "url": "/_nuxt/48c2d4111ccd5fff32cf.js",
    "revision": "94ad36e9fd3bb8469097baec11550acd"
  },
  {
    "url": "/_nuxt/4925f7f4410d6e2c8351.js",
    "revision": "e73205af24bd89e10904ba3eff073785"
  },
  {
    "url": "/_nuxt/5119181697e0a14c9ca8.js",
    "revision": "ab37b3f88a1ff39c28258ee2bf38e7d0"
  },
  {
    "url": "/_nuxt/645931f47ad2e9a565bf.js",
    "revision": "a569092a894f0c9f675533c5b9e024ea"
  },
  {
    "url": "/_nuxt/6cc22ca2ace60c7e411e.js",
    "revision": "1d6cc2e719681826dafb9635c0de291e"
  },
  {
    "url": "/_nuxt/762e80f29167585619a4.js",
    "revision": "b76b1c9f115672d147797cc6c3df9a07"
  },
  {
    "url": "/_nuxt/858979dc20fe3e79a6aa.js",
    "revision": "33b17171cd526aee16832c98068f405c"
  },
  {
    "url": "/_nuxt/8d6b78b493e5ac7f797c.js",
    "revision": "2b8b35623aa337b488051870115d5cfe"
  },
  {
    "url": "/_nuxt/93c49f3eadf3843d12d7.js",
    "revision": "6ccb6a78b904623f5043c8e1d8470ec8"
  },
  {
    "url": "/_nuxt/94f854557a57ad3f45a0.js",
    "revision": "b3c1147ed3864d5a3c2904b97a050da9"
  },
  {
    "url": "/_nuxt/966f33fe075a721cadf8.js",
    "revision": "f934307a063f6b96ba3fd3fb6a91a3ab"
  },
  {
    "url": "/_nuxt/b8aeda2abe13e7ffc27e.js",
    "revision": "051ccacc17234d1f600a5908687306db"
  },
  {
    "url": "/_nuxt/c7e377a28d8c797350fa.js",
    "revision": "3ac06c34850eefbf2e76127c153910c3"
  },
  {
    "url": "/_nuxt/d15328325dedff6784a9.js",
    "revision": "441ba5aca12953a874e41419ac35f40c"
  },
  {
    "url": "/_nuxt/d458bfd96807b8ba56e4.js",
    "revision": "cc2cae3acd4d7ff5432a2c1351dd15fa"
  },
  {
    "url": "/_nuxt/d5ced941bc7d64a9efcb.js",
    "revision": "452f0489c34287f687e5a350c7b9b710"
  },
  {
    "url": "/_nuxt/e177deb29c3d33d96aeb.js",
    "revision": "120efbeb5cdceb8cf1dc64d8172bd2a3"
  },
  {
    "url": "/_nuxt/e5ee5538b9adad1f168a.js",
    "revision": "ed9e42b49a66a195a57d09819498c4f7"
  },
  {
    "url": "/_nuxt/e6b381b9fca746508aaf.js",
    "revision": "a4e3a9adbd2d4b64bf422e992e9b2b21"
  },
  {
    "url": "/_nuxt/f3ff68bd6f67b4a653af.js",
    "revision": "1d328bc5f422bfc0921023dc2ea10f9f"
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
