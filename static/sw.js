importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/26732ae8fe8c54cf399b.js",
    "revision": "8f1b248fba8975b8230b1597397f5adc"
  },
  {
    "url": "/_nuxt/3074cf533dd2f26608cc.js",
    "revision": "82736aa020374102806665ab735384fb"
  },
  {
    "url": "/_nuxt/35d8b18da61d1034b138.js",
    "revision": "d72f33a6a4434b84e93fde1687951dc9"
  },
  {
    "url": "/_nuxt/41616029ef36c55faacc.js",
    "revision": "0c1e0c7726f58db59594acd9a2a784a1"
  },
  {
    "url": "/_nuxt/6a50a52063aca5d57323.js",
    "revision": "a628354cdfe3af47a282d8a5041959be"
  },
  {
    "url": "/_nuxt/7d7ee38e07d803099033.js",
    "revision": "24fe416d454a2a1e91adfa9ca5b876d2"
  },
  {
    "url": "/_nuxt/7e5fa996f83bb0957575.js",
    "revision": "129b3ce29cb2f821bf59c56c677f57fc"
  },
  {
    "url": "/_nuxt/8212363d8a7849d824c9.js",
    "revision": "79bcfcdf0818777b31ec77eb3f1ca3a9"
  },
  {
    "url": "/_nuxt/892301125fbb3cbc3400.js",
    "revision": "5ac364f67b43f830eb3c1f01dc517fca"
  },
  {
    "url": "/_nuxt/8b9711232168200b160f.js",
    "revision": "780c73c85a4c97ead0747e81e3e0a592"
  },
  {
    "url": "/_nuxt/8cca82ce88282c0c1739.js",
    "revision": "45d21780e46750d06e3208d69d94051f"
  },
  {
    "url": "/_nuxt/9bda9c394275a54d8965.js",
    "revision": "7dbf61aa18aeafc718087f2d70b0c7a8"
  },
  {
    "url": "/_nuxt/a7bdf7c04f787960f2e3.js",
    "revision": "e4a86d6496480f54cef4e9f62289f6c9"
  },
  {
    "url": "/_nuxt/b35368aa178cb9158bde.js",
    "revision": "b04ce782027ceeeb6cc37512b86734ac"
  },
  {
    "url": "/_nuxt/b68cd0aa4bca3fd57c86.js",
    "revision": "ef9715254f662ea5639fa07a81524630"
  },
  {
    "url": "/_nuxt/ca782051b74d23b93f1c.js",
    "revision": "b874ab7ae1d99e69a70e023fadcb4057"
  },
  {
    "url": "/_nuxt/db48de4ed9c4d69c7833.js",
    "revision": "3c41625db5eed4e73fb220ecb919441b"
  },
  {
    "url": "/_nuxt/dcce7766578a27040811.js",
    "revision": "f9c6f4264aa6cd0c41056e6a4b3c20ca"
  },
  {
    "url": "/_nuxt/ebe0034bc54142af371d.js",
    "revision": "e689894c60d67ff420cce0037301e37c"
  },
  {
    "url": "/_nuxt/eceaf1f792bcbb5a3deb.js",
    "revision": "98d8d7c805acbeb96122345151a7df82"
  },
  {
    "url": "/_nuxt/f35896863bd7087eab60.js",
    "revision": "54c712ef966efac611be1f8b55be1f7b"
  },
  {
    "url": "/_nuxt/f42be18e17694d5c21ab.js",
    "revision": "bd5e8251b520ccdfde6f4e67d719e721"
  },
  {
    "url": "/_nuxt/f4ec98117cba540eb918.js",
    "revision": "d57f79d8ba3f8003ca534245b865bf97"
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
