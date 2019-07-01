importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/002fb01586a96dad34c8.js",
    "revision": "cab9af9ae7083e3a0c8e67b9ca4dbff5"
  },
  {
    "url": "/_nuxt/2aa0106f9d5765c7df98.js",
    "revision": "343f7d6d6a9140a80bf8c794b0aec306"
  },
  {
    "url": "/_nuxt/2cc3c58fd9a38c512e7c.js",
    "revision": "a5cc9eecfdefe42eb8e59bafc5355617"
  },
  {
    "url": "/_nuxt/384f93a36be16f25b494.js",
    "revision": "d06d5fde98190e4ba12e9543aa585173"
  },
  {
    "url": "/_nuxt/4083fb7bde0b5b8c23b4.js",
    "revision": "2a73b3e7028fbfd80a119e7c6f1f8e40"
  },
  {
    "url": "/_nuxt/4664a8f341c9a3023f62.js",
    "revision": "eaea8d4a1bae628c1a967c2800aa7db4"
  },
  {
    "url": "/_nuxt/490013a150cde212de0d.js",
    "revision": "c846b6402c0db702cc0a9a5f4d50fe98"
  },
  {
    "url": "/_nuxt/6620550031067317e0e0.js",
    "revision": "d686bb0a91b7da55ac5f9cb0ed6ad50e"
  },
  {
    "url": "/_nuxt/7dfce63401cc7b5ea899.js",
    "revision": "5141210f6b5c17bcff1cf35fa6f87972"
  },
  {
    "url": "/_nuxt/899e184448d99a5b1e37.js",
    "revision": "e2faffeccccef87296368841fa0041a3"
  },
  {
    "url": "/_nuxt/91cdec389c1c5dd2b418.js",
    "revision": "79f52c58302b0f5f83c85da78b4b723f"
  },
  {
    "url": "/_nuxt/97da9597a557d705b43a.js",
    "revision": "7e908efe7d54711c2b6df82fd8770829"
  },
  {
    "url": "/_nuxt/980068d22ae1fd97bd32.js",
    "revision": "f62e1e8bb6a27da2c45aa4ace54cdcaa"
  },
  {
    "url": "/_nuxt/98e1ebc2feade1ed7092.js",
    "revision": "da111c343b682a94c4e64f68760a6935"
  },
  {
    "url": "/_nuxt/bf363f1e32c90985e876.js",
    "revision": "f5ad519f56763f292470d34bdfa073b9"
  },
  {
    "url": "/_nuxt/c14f5f0d0e35a8d71990.js",
    "revision": "0a581fed511554aac3cf5f76681f5b6e"
  },
  {
    "url": "/_nuxt/d6ca62ca2c6ecfa070a1.js",
    "revision": "6e3a1c36c74b5406c62c9f5fd29aa1e7"
  },
  {
    "url": "/_nuxt/e5647560f6112462c9a6.js",
    "revision": "08ef8314367fee9393711f04b5afa3e3"
  },
  {
    "url": "/_nuxt/e72f6883462fd3348010.js",
    "revision": "4f17ba04e69e385bd153707aaeac3f9e"
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
