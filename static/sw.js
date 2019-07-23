importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/00168b2911014d6f3b05.js",
    "revision": "291354546d1ac1b702023d309c386cb5"
  },
  {
    "url": "/_nuxt/0a1f773f305c386c0005.js",
    "revision": "d9f9a5fb829698dc6c46275122170faa"
  },
  {
    "url": "/_nuxt/11941a685efdee8be3d1.js",
    "revision": "9ab6297de24dee31fa1befebcf51b27d"
  },
  {
    "url": "/_nuxt/1d071ea2333261cf9820.js",
    "revision": "9b877ecdc80df95384b06fb93befb0f7"
  },
  {
    "url": "/_nuxt/1d1c2d3c9bce8dfe5844.js",
    "revision": "670e21f3a6911b637542fb427e56f0d5"
  },
  {
    "url": "/_nuxt/2f48fb96804c56a0b1c0.js",
    "revision": "b2f378b3ac9604bd2cb3a765154943aa"
  },
  {
    "url": "/_nuxt/33747a0535ff209a3447.js",
    "revision": "6c94a9ce6d4a6e8a5d12805b89964e66"
  },
  {
    "url": "/_nuxt/3ccb8dc68f81cf5c32e4.js",
    "revision": "04e68c3c304d484cc134773cfb64bd1e"
  },
  {
    "url": "/_nuxt/4106097a9bb082c8c011.js",
    "revision": "714de08c5bd5cb611f8f45c5c3385288"
  },
  {
    "url": "/_nuxt/522f11444ed70f389d23.js",
    "revision": "d0726b08aec7c1dcee22a9bea11879fc"
  },
  {
    "url": "/_nuxt/61cfbf3bca1106071811.js",
    "revision": "e3714e9f11ca2d949003b9182f8e91af"
  },
  {
    "url": "/_nuxt/703ea2dc48f38aa057c1.js",
    "revision": "8caa9b8a6b81f43e169a2bd523c55556"
  },
  {
    "url": "/_nuxt/7f9a6097078876c14058.js",
    "revision": "aaf175509f5f8d361e707ffda76a4a53"
  },
  {
    "url": "/_nuxt/891127c816dc7b911b34.js",
    "revision": "45c6df1756e30e4b0e4eabd9b2531424"
  },
  {
    "url": "/_nuxt/8ae8718175968d56738b.js",
    "revision": "2d4b3b2413906aee38fb69e41d868eba"
  },
  {
    "url": "/_nuxt/957ba986131b3042ad5f.js",
    "revision": "07144ba63717f27537593474725fe695"
  },
  {
    "url": "/_nuxt/9fd11f9ca52cec99d678.js",
    "revision": "d055bacbe6f835577272b5ceafa61a3a"
  },
  {
    "url": "/_nuxt/a399cb7bb9891ca6bd40.js",
    "revision": "1dfb54903fbf1835ec6d423f979c76ad"
  },
  {
    "url": "/_nuxt/b0ac16e76d95a8ed38d6.js",
    "revision": "bba6df552408eeefd2b061f580575155"
  },
  {
    "url": "/_nuxt/cf34a065bd4dd2a8b18f.js",
    "revision": "7fc407c206a801a1cbc7d1d7ab932155"
  },
  {
    "url": "/_nuxt/f8905b97a85e1e3c3f93.js",
    "revision": "907243f9efa074da08a5d9875f1bcf1c"
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
