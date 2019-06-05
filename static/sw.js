importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/1222d44e37b1cfcdf137.js",
    "revision": "c282e390c73d2cc10d570994c4067ea6"
  },
  {
    "url": "/_nuxt/2a48162fa66315c43f0d.js",
    "revision": "6fa050eab5b4803205400912476f7e2a"
  },
  {
    "url": "/_nuxt/2d11759fe278c31bbae8.js",
    "revision": "2657e3ca76b9722af2c57a85baf6e9a1"
  },
  {
    "url": "/_nuxt/3299bc9e1f938919e417.js",
    "revision": "1f10cee222b2982ccbed562043e07b6a"
  },
  {
    "url": "/_nuxt/33210d1b8739ed4c823e.js",
    "revision": "f3c898e371a4271c882827e2eb4041c4"
  },
  {
    "url": "/_nuxt/5ae37c3470d7486f131a.js",
    "revision": "31ccd42b2ff345ce31e24c379c7a3860"
  },
  {
    "url": "/_nuxt/5e204df243dae374fac9.js",
    "revision": "02f5a11826277e00efc79fecf32e7734"
  },
  {
    "url": "/_nuxt/69016d7ac1fd62e5fbf1.js",
    "revision": "0774fda9fefe01c1d534e81f50e07965"
  },
  {
    "url": "/_nuxt/6b60a2a934ee34791715.js",
    "revision": "31e8470b84211c84f013ed7061e216a2"
  },
  {
    "url": "/_nuxt/6cc9166ec9cdff5cbeae.js",
    "revision": "d34fde0a172fa2849c1185f0ff0c429f"
  },
  {
    "url": "/_nuxt/6dd1e0b6c88683a81b3a.js",
    "revision": "214b09a23b0b5d253bb57f85bef65f04"
  },
  {
    "url": "/_nuxt/7c79bb9a0fb2d4442db8.js",
    "revision": "337e4cb64966694b7572b0311924398f"
  },
  {
    "url": "/_nuxt/7e2046c08d64a46aac87.js",
    "revision": "02a5f25f891a7fa3980eb45cdaef3c2d"
  },
  {
    "url": "/_nuxt/8295d0aef8ec4912bd45.js",
    "revision": "e9a61396422f55670fce4a1218e02ab7"
  },
  {
    "url": "/_nuxt/9fcc3dc03da89ddbb0e3.js",
    "revision": "68a54e3d21c8c10701cbfc244baca764"
  },
  {
    "url": "/_nuxt/a2990f33213eec477d89.js",
    "revision": "ad21a96cbd898781b3a0ca0e4588ced0"
  },
  {
    "url": "/_nuxt/ae3476e5c79590aa295c.js",
    "revision": "28482dd4ac747aa9ff194218b49fe55c"
  },
  {
    "url": "/_nuxt/b1f7cc3c8537f2024af7.js",
    "revision": "770a642eea05840eca69016f83ae62a7"
  },
  {
    "url": "/_nuxt/b48e6f12b46ad1b379d4.js",
    "revision": "f945ff39e50ce7908076e2dbc16f9382"
  },
  {
    "url": "/_nuxt/c39c68a3fcbdea9f47cd.js",
    "revision": "b988bbe5a914e84cb5a793656e84e8b1"
  },
  {
    "url": "/_nuxt/c8824f20433ab5fd3732.js",
    "revision": "bec276b25293c749996df8ecf2b8dd13"
  },
  {
    "url": "/_nuxt/ca59c0061ece847ac68c.js",
    "revision": "e1396a9a46e02391873c8cd8863a90dd"
  },
  {
    "url": "/_nuxt/d1fea1bdf79d09d96616.js",
    "revision": "3355bd9e85b6d9781c255eba6acc2e9c"
  },
  {
    "url": "/_nuxt/d7aa47471c3e36528963.js",
    "revision": "8535163f7a1f62f3196a072b9fb4a260"
  },
  {
    "url": "/_nuxt/e8ae828ef43614010c6a.js",
    "revision": "4927a5e3e4a0e7d0bc4c6bcace7ead7a"
  },
  {
    "url": "/_nuxt/f500e7ab470728ba7bb2.js",
    "revision": "bd62752e15a28c983039eebcdbd41c8b"
  },
  {
    "url": "/_nuxt/f8fc2cbdccdc5c998982.js",
    "revision": "a360ca71b31f733f7a14641f4fbb7fef"
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
