importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/034bd6fe9b72dfe5ca07.js",
    "revision": "f371dc97fc5380d590506408a43724cb"
  },
  {
    "url": "/_nuxt/0616c9c18bc583a1b7e0.js",
    "revision": "8ce6dc792ffd91c037da587e20120433"
  },
  {
    "url": "/_nuxt/1c9b11d7f7e56a7f38fe.js",
    "revision": "7d42f1e510d8d62f1361bf4352243ee3"
  },
  {
    "url": "/_nuxt/203bd8f27cdbf649327b.js",
    "revision": "6804e79c9c76c261fa3f51669f2fa6bc"
  },
  {
    "url": "/_nuxt/2d11759fe278c31bbae8.js",
    "revision": "2657e3ca76b9722af2c57a85baf6e9a1"
  },
  {
    "url": "/_nuxt/529ac87e524f8e5ef747.js",
    "revision": "62530d57f196f6019a509ef980ad54c5"
  },
  {
    "url": "/_nuxt/5c12fc42f91d90029120.js",
    "revision": "4cfde387fa2b4cf73c89a4fa6741a2f8"
  },
  {
    "url": "/_nuxt/6c6e69b40c27e2860880.js",
    "revision": "389c0da81cee25307a17a7f7a70ea23a"
  },
  {
    "url": "/_nuxt/6cc9166ec9cdff5cbeae.js",
    "revision": "d34fde0a172fa2849c1185f0ff0c429f"
  },
  {
    "url": "/_nuxt/6f3b8107734a515f2481.js",
    "revision": "df192add61ed2cc73ce78e4bf437c076"
  },
  {
    "url": "/_nuxt/702018e196cf9e4e6c2a.js",
    "revision": "13c47a5a3bc065667399aead73555473"
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
    "url": "/_nuxt/8cb18118494a4c9646f2.js",
    "revision": "8c2244623d3f82493649779913eec1f6"
  },
  {
    "url": "/_nuxt/98a32d6334afb9f91619.js",
    "revision": "79dac4f97f79049e1ee386550e5dc015"
  },
  {
    "url": "/_nuxt/a0063caeb931f39310ee.js",
    "revision": "a08d06bb2fda5c4b802a1eea769f1136"
  },
  {
    "url": "/_nuxt/badf505ffef9320c40a2.js",
    "revision": "f429a29530f688e81b74327b48a6bfbe"
  },
  {
    "url": "/_nuxt/c35bfa3f8e3d4bccafe8.js",
    "revision": "9294423c150358fabcc3c486508ad6f6"
  },
  {
    "url": "/_nuxt/c39c68a3fcbdea9f47cd.js",
    "revision": "b988bbe5a914e84cb5a793656e84e8b1"
  },
  {
    "url": "/_nuxt/ce0b1849f2e6ba4d45e3.js",
    "revision": "4222dec5b0f657fce3da888cd246ff15"
  },
  {
    "url": "/_nuxt/d0eda2238f2c9263c1e2.js",
    "revision": "721e7db4cf81870d5586d0c57e5edb70"
  },
  {
    "url": "/_nuxt/d6d0c46c79159484e883.js",
    "revision": "bdd1ef35028ca287e636cb7dffc6dec1"
  },
  {
    "url": "/_nuxt/d7028ab7fd24438069a6.js",
    "revision": "11415b88ab22963316866b735924782e"
  },
  {
    "url": "/_nuxt/d7aa47471c3e36528963.js",
    "revision": "8535163f7a1f62f3196a072b9fb4a260"
  },
  {
    "url": "/_nuxt/f8fc2cbdccdc5c998982.js",
    "revision": "a360ca71b31f733f7a14641f4fbb7fef"
  },
  {
    "url": "/_nuxt/fbeec74f209f3800e7ef.js",
    "revision": "3adc4acc8403c52ac58448806a80f79b"
  },
  {
    "url": "/_nuxt/fe01cdd51ff9d3aa8ca9.js",
    "revision": "6e446a81cb4724bdfc8886c2b1ec9b64"
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
