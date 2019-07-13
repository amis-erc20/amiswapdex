importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/0833f42dd493f10b96ad.js",
    "revision": "33d5384c1cd5c78a7c6868956c8e223e"
  },
  {
    "url": "/_nuxt/126e52707ddc9459fd18.js",
    "revision": "2347f6df77e3e7ce13ed05d7ccff7a21"
  },
  {
    "url": "/_nuxt/1460d9916e7d7e7a895e.js",
    "revision": "2ae2d7fa94f4c4fc1a612d4c447b4962"
  },
  {
    "url": "/_nuxt/18323c5c2223cbbd78b5.js",
    "revision": "aa75b0eb765604f7a185108676ec20de"
  },
  {
    "url": "/_nuxt/25d422d0b5d653f305cd.js",
    "revision": "54fb35b22300d88fab63fcae0fe7a48b"
  },
  {
    "url": "/_nuxt/2812cdeade1a829c516c.js",
    "revision": "4eecd6dff61828c208d03c76dedbb5dd"
  },
  {
    "url": "/_nuxt/2dd5816fda420881057f.js",
    "revision": "79f85ca4c7596f579554deeebc33f277"
  },
  {
    "url": "/_nuxt/309ba07a65de4b6a97d9.js",
    "revision": "721ba3534e77f2828a26396294b69977"
  },
  {
    "url": "/_nuxt/4e20fbaf58e4fb34c1be.js",
    "revision": "d3bf479d8328e0a55cb084ca079b2570"
  },
  {
    "url": "/_nuxt/52258ec4b6102967fa05.js",
    "revision": "3ff24ca41a45f6eff180fea2429fbc57"
  },
  {
    "url": "/_nuxt/5a308b8a53575288db57.js",
    "revision": "ef96280f3840110de83a505948c116d1"
  },
  {
    "url": "/_nuxt/662484750aba8a19caa7.js",
    "revision": "3e3afe1cc7209192972ac067e184e704"
  },
  {
    "url": "/_nuxt/8c2b785967293057dba2.js",
    "revision": "d68108f47f8be536e810c55776082e54"
  },
  {
    "url": "/_nuxt/8e4159eb39605e62a1ce.js",
    "revision": "503f00160b987bc60093dd4279bae24f"
  },
  {
    "url": "/_nuxt/ae5f66d5a9878063edd8.js",
    "revision": "453f2944e3b0ab134983d93eeaf9a9a5"
  },
  {
    "url": "/_nuxt/b21308f5d07473179faa.js",
    "revision": "6f812eb8ec4301bb016e37efb31d93bd"
  },
  {
    "url": "/_nuxt/b5f694753c8b7e7f2c66.js",
    "revision": "716c4e68555ef78e060383908c03d863"
  },
  {
    "url": "/_nuxt/b974f3d385531e78dd7f.js",
    "revision": "35a6546d4741f949965a379ddf9e7294"
  },
  {
    "url": "/_nuxt/c2624dea54ce4ee67b79.js",
    "revision": "c10369f2c38f24e25b6cd62110bb61f2"
  },
  {
    "url": "/_nuxt/d2aaac01e959e13dc316.js",
    "revision": "e2457c11a72e653003d35519a08b244c"
  },
  {
    "url": "/_nuxt/e1444b2d0a31468067d2.js",
    "revision": "cd8787b1b463337a1679bcaae6bd35ad"
  },
  {
    "url": "/_nuxt/f17b711133c38933f130.js",
    "revision": "1e38f3ba29f96d4e7a87a82b7dfb0e0d"
  },
  {
    "url": "/_nuxt/fb73215ca7139be62e4b.js",
    "revision": "90600c9fb0350bfefec77847f79d734b"
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
