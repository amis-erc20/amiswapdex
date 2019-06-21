importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/08a3b699952860d6f19b.js",
    "revision": "b5fa171ef5babaa6a1ee83efdc6f74cd"
  },
  {
    "url": "/_nuxt/0ad37ce36d8fc763e78f.js",
    "revision": "282998a6bb2d8785b40f52a6eeae3d35"
  },
  {
    "url": "/_nuxt/0de15880684a9556d4a9.js",
    "revision": "9d1521f1599270ab6bccb8f5d18ced7c"
  },
  {
    "url": "/_nuxt/1d40dc078cb473e3cbd0.js",
    "revision": "3f32676271935d64da4d41aec28e0dd0"
  },
  {
    "url": "/_nuxt/20aec4dea4cf9634d565.js",
    "revision": "d3f8b914f0cdebf19fdcd220356d5881"
  },
  {
    "url": "/_nuxt/2fbc93200f8395d32067.js",
    "revision": "633bb6fc8ee564f489d70d78ec3dfa30"
  },
  {
    "url": "/_nuxt/470e2caf7e7c034e7180.js",
    "revision": "66e50f74e1498a259e91d25df5635aa2"
  },
  {
    "url": "/_nuxt/7aeb2cbbb9566bd951ef.js",
    "revision": "c52d398d3c21cc1e763f2acb71f4ffc2"
  },
  {
    "url": "/_nuxt/7ca5d17475503911a5fd.js",
    "revision": "f18ca1e71913e33b3ababbe051ce5842"
  },
  {
    "url": "/_nuxt/8135ab8cb9077ee2601a.js",
    "revision": "9c1b96d4a8f31d678c5eda6e9ed342ce"
  },
  {
    "url": "/_nuxt/96718466819361162ba3.js",
    "revision": "90a6e21ba7880233ec6f469a1bfc1a91"
  },
  {
    "url": "/_nuxt/975b9ebd627919583254.js",
    "revision": "8987068f59465b5427a4aa9a884f6254"
  },
  {
    "url": "/_nuxt/a2b409378ab084b01e34.js",
    "revision": "2b637e01e405d351b020b3febbf272e8"
  },
  {
    "url": "/_nuxt/a5f6004120110d5cffc3.js",
    "revision": "dd87838a540c1b1f35f6dd017e82dcab"
  },
  {
    "url": "/_nuxt/a8b6f71ccd6841c42348.js",
    "revision": "1906fc1206ec675688c174b1a1204017"
  },
  {
    "url": "/_nuxt/a9c212b6d93912770b49.js",
    "revision": "a7d81b89f71da308a7deedc7050aa7cd"
  },
  {
    "url": "/_nuxt/bbb56a1560688b7d74e1.js",
    "revision": "5d2d9529c91ca4ad20820b81958cd9ab"
  },
  {
    "url": "/_nuxt/c275e06e4bb6227ce1b3.js",
    "revision": "7c8423f30649f18e6189f64375904f91"
  },
  {
    "url": "/_nuxt/da33cf20d50d948e874a.js",
    "revision": "4dad7674d0f63cd4ceca04ad03df3f57"
  },
  {
    "url": "/_nuxt/db7ae1a3aad45fb36671.js",
    "revision": "3ef1e06d7fb3b545355d43a910a45458"
  },
  {
    "url": "/_nuxt/ecdc02775a5252082810.js",
    "revision": "c8abb33aa9ed08422b4aa18d8617c659"
  },
  {
    "url": "/_nuxt/edcfc73f94d14b791017.js",
    "revision": "817590dc643314f300f989cd13bd2696"
  },
  {
    "url": "/_nuxt/ef9a9dd69fa84d673e48.js",
    "revision": "f73df08f155253f9d9c288cb78df7638"
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
