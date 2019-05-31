importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/0143d26ab2c710e73aab.js",
    "revision": "b4867c0aed85bd505404014d18ff2c20"
  },
  {
    "url": "/_nuxt/039f605a385fe83c71e9.js",
    "revision": "29ffbc0b67571fcf00cd3343b0b38c0e"
  },
  {
    "url": "/_nuxt/23f5b701d8f345b1b77c.js",
    "revision": "b5cc38562fc509c0516eba262a0bfcd5"
  },
  {
    "url": "/_nuxt/2b34ee161c328401839f.js",
    "revision": "624d9b050b4ceb2d68550c181a8b99a5"
  },
  {
    "url": "/_nuxt/2f376557eb47089cfa89.js",
    "revision": "133d3d692f2f0d6448d198973c3c447b"
  },
  {
    "url": "/_nuxt/34aa4e38e4ac7750cafb.js",
    "revision": "b450165f4a4c17a879c99dba54466d62"
  },
  {
    "url": "/_nuxt/37d9cd5a9f7d2083ff85.js",
    "revision": "236bc592c2e1308646458dba83045825"
  },
  {
    "url": "/_nuxt/72124b17b9514c052357.js",
    "revision": "f7aec62964ad960e6b33235f792e51c6"
  },
  {
    "url": "/_nuxt/82ad12e00fc51f4cea45.js",
    "revision": "4f57a0fa7cde21b9aab1678c19fcd8ad"
  },
  {
    "url": "/_nuxt/87dd9a60d392eacfbc94.js",
    "revision": "6065c3cb24f0a85f1d4aa7e57e387a94"
  },
  {
    "url": "/_nuxt/8c25ad30136020c35ad8.js",
    "revision": "b1f0c455848f1914a77807c43e1254e8"
  },
  {
    "url": "/_nuxt/8ccd9f0508e4873c9c07.js",
    "revision": "125679239b6d081c274763963f2d2cf9"
  },
  {
    "url": "/_nuxt/8f07fe7b3ce0f2560097.js",
    "revision": "fcdcc59b4abde12b5e24702415238b1d"
  },
  {
    "url": "/_nuxt/955815fb04010666caaf.js",
    "revision": "b0807bfc3d23bd1e988327fbeca64402"
  },
  {
    "url": "/_nuxt/9ab7ab2c1eab3f1becdd.js",
    "revision": "fe1212e82fee890b7f650f636359d905"
  },
  {
    "url": "/_nuxt/9bf04fa61993d84cc45e.js",
    "revision": "c14bc5639cc1f2f2b0fb4baa3085c164"
  },
  {
    "url": "/_nuxt/9ff89a2c9b31a56a0f03.js",
    "revision": "2cdddf81eb1423dc188673c7bedde3dd"
  },
  {
    "url": "/_nuxt/a33bb7ad4bd5cd481111.js",
    "revision": "f19b8b1af97c8c9e4338d3ee12170a2a"
  },
  {
    "url": "/_nuxt/aafead530c36697025b6.js",
    "revision": "d5c5887fcc348c1d644e8b930c5facef"
  },
  {
    "url": "/_nuxt/b6cdb970b30aedfa9c35.js",
    "revision": "780cb23e517c77beb784bca01ae9215c"
  },
  {
    "url": "/_nuxt/be032d7d3de4772a1bf2.js",
    "revision": "805ced2a9115fcacbbda870e6a8780d3"
  },
  {
    "url": "/_nuxt/be58bafccb2e5f697901.js",
    "revision": "2e0821198722e0eaacd38944aaa8cccf"
  },
  {
    "url": "/_nuxt/c0deb209159f3211b8af.js",
    "revision": "7070296b466cf8deb63fd55640a2c886"
  },
  {
    "url": "/_nuxt/c148e19be87f4aaae407.js",
    "revision": "783a28f680fd1315966e45d0ee8872a1"
  },
  {
    "url": "/_nuxt/e2d10899888fc26921b2.js",
    "revision": "d5f162ce33fd1cb8f58cda7dfa7cb0c0"
  },
  {
    "url": "/_nuxt/ef9fdfb77c748b92000e.js",
    "revision": "4434d6c485e62f1fad57c0403fd8a135"
  },
  {
    "url": "/_nuxt/f3a9c5d3c6be049374bc.js",
    "revision": "9c23a43b2c1434c98344c9cab3e876de"
  },
  {
    "url": "/_nuxt/fba02f07eee98981917e.js",
    "revision": "50fe0090257d4718d8838f55c5c9c7be"
  },
  {
    "url": "/_nuxt/fbda118bfa113d0493e7.js",
    "revision": "e3f15068e3b90bede7bfe25b31eb6217"
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
