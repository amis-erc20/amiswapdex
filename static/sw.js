importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/10a079067d77de3bb651.js",
    "revision": "db4514964ab5ff553616e7dfe25f74b7"
  },
  {
    "url": "/_nuxt/155f2c326dadeb1fdb0d.js",
    "revision": "83f8d15a5f8603ed8f0049a345f64e95"
  },
  {
    "url": "/_nuxt/283fcb3eda6c684d5cff.js",
    "revision": "53f4fa4d04eaa37148926376d98a5aa0"
  },
  {
    "url": "/_nuxt/28976e3e4bbf0750807e.js",
    "revision": "d36c109dab1a2c610a120af6ce87ae8a"
  },
  {
    "url": "/_nuxt/2f16a821aad5ff751117.js",
    "revision": "d1febfb4298b10e44dc192fcb86554bf"
  },
  {
    "url": "/_nuxt/3ec7ef9cc3a6250096d8.js",
    "revision": "d51d8cf1b1d3ca92007caad48e78ddc2"
  },
  {
    "url": "/_nuxt/538ea63ed37200e594fb.js",
    "revision": "25a63dec7f07daadd903d88b311a4bf4"
  },
  {
    "url": "/_nuxt/6bdf7085e63f1b8ccdeb.js",
    "revision": "9f5229d87c6565cd2ad0d4070c1a87de"
  },
  {
    "url": "/_nuxt/6fdf697d4e69bbf3108a.js",
    "revision": "a74add18879c34c12d193036d5d9ebd5"
  },
  {
    "url": "/_nuxt/797808d847eaa5edc9f3.js",
    "revision": "433a6d180c374d8ae4985d139e89214a"
  },
  {
    "url": "/_nuxt/837f54ff12dbff5d3b3d.js",
    "revision": "7f42bbda809ca7e6cde145f60d425e44"
  },
  {
    "url": "/_nuxt/8943c5a93de930aa353f.js",
    "revision": "0d75fa312cf6f5cf49c5c4e938ac0971"
  },
  {
    "url": "/_nuxt/91a4c1d2d6abe326ab84.js",
    "revision": "9920a079bbc815ee8bd7f25a81ff7919"
  },
  {
    "url": "/_nuxt/9932b6a7e01f84e1c95b.js",
    "revision": "11baa96ef476edc64d9f5ca488905725"
  },
  {
    "url": "/_nuxt/9cd366f71a6271db3e55.js",
    "revision": "61bd11242aa2fe04682ab522c6b3d7f6"
  },
  {
    "url": "/_nuxt/ae5f66d5a9878063edd8.js",
    "revision": "453f2944e3b0ab134983d93eeaf9a9a5"
  },
  {
    "url": "/_nuxt/b76d73209754c2a06553.js",
    "revision": "a0991618042e0853cf5002a37cf6aef2"
  },
  {
    "url": "/_nuxt/c173f2285e30eb82d126.js",
    "revision": "7c2506d6b4f4ae0fd31efc10eb1465c2"
  },
  {
    "url": "/_nuxt/de341ae0c229bf4e0212.js",
    "revision": "06cf950e35b4992d394e4eee15002508"
  },
  {
    "url": "/_nuxt/deb4d8452e72ef083319.js",
    "revision": "7876d179274e1ce9aeb8a5edacf36d27"
  },
  {
    "url": "/_nuxt/eb37ad85b9ef44e3dc4c.js",
    "revision": "1209c6dd9d803ee259f332607a810d90"
  },
  {
    "url": "/_nuxt/f472cd5717875c2ce7c8.js",
    "revision": "061d88dc2eb3fb224226528ec3d33751"
  },
  {
    "url": "/_nuxt/ff78942a67ef407ce200.js",
    "revision": "a9be22433b5507f2468b33457810ac72"
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
