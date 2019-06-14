importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/0312a8d0a99ee946d084.js",
    "revision": "e8c0f8866a3fe157deaa3cbbc2232e48"
  },
  {
    "url": "/_nuxt/1debc98a8a08bbbddbb5.js",
    "revision": "cbcf5048466ffa5721ee355fcc99bb36"
  },
  {
    "url": "/_nuxt/210f87cbb328851b659b.js",
    "revision": "834cff14e2dea0fed2666f8abf1ee0e2"
  },
  {
    "url": "/_nuxt/228464d9d24378fd9145.js",
    "revision": "cab3353ff401974aa4f0b61dc0a4b9f1"
  },
  {
    "url": "/_nuxt/358ef26ec4d44c097892.js",
    "revision": "089e4ce6b0f06b51e1f6288e26042f33"
  },
  {
    "url": "/_nuxt/3adb9dc6a493d42153a6.js",
    "revision": "fa02ed50ae08a81f3a8318cf86b95d4e"
  },
  {
    "url": "/_nuxt/4ac3358c708b659349ef.js",
    "revision": "e6800c79e263f9932cf4ca65905cf863"
  },
  {
    "url": "/_nuxt/66eeb2a0e68c4c977363.js",
    "revision": "84ddc4964808e075487bdd608e907e09"
  },
  {
    "url": "/_nuxt/6e829e3e6c5ebfd4a728.js",
    "revision": "81027ddaf6a62f4503d1e363a9abb769"
  },
  {
    "url": "/_nuxt/7f74146d7051569abfd5.js",
    "revision": "988a75218893545925feb1d7e3823046"
  },
  {
    "url": "/_nuxt/8920bb96a96d18faaae9.js",
    "revision": "59f1794a4e330fdf74a090a730cafe9e"
  },
  {
    "url": "/_nuxt/8d2bb9441b545b2aad01.js",
    "revision": "a72bb354229ec3b2848bdc5fda6d6c42"
  },
  {
    "url": "/_nuxt/8ef178efdd040cd9b52f.js",
    "revision": "af7ec0a91254fc7a1f4a0303c84ec408"
  },
  {
    "url": "/_nuxt/b740283c4b5852478881.js",
    "revision": "e6650b0ed735f8c76f1eaf36352a99b4"
  },
  {
    "url": "/_nuxt/c6ba80003298a9345c92.js",
    "revision": "e5da8ce5ea433138fe464126fb7e36f8"
  },
  {
    "url": "/_nuxt/d2482bf589223ccbad77.js",
    "revision": "b2646be29b797d72cad2e6f8ee620e1b"
  },
  {
    "url": "/_nuxt/e65db2e6d4d4bdfca096.js",
    "revision": "ee00fafaadda6d4a92e9cc3f6e936bf4"
  },
  {
    "url": "/_nuxt/f14af0d2028972902528.js",
    "revision": "3402e9734cd15ec9addef219a7d9da50"
  },
  {
    "url": "/_nuxt/f877b71ef2d3c0ab54c8.js",
    "revision": "e13d21f02f51af71fca3772b87b8c6dd"
  },
  {
    "url": "/_nuxt/f935052d6795a7d3fb30.js",
    "revision": "831b0f7748c051d6aa8df85c67848a8c"
  },
  {
    "url": "/_nuxt/fbc6d525aa5084e3233d.js",
    "revision": "3383b5fbc5e6aba37374d1b9131bf976"
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
