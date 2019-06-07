importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    'url': '/_nuxt/0616c9c18bc583a1b7e0.js',
    'revision': '8ce6dc792ffd91c037da587e20120433'
  },
  {
    'url': '/_nuxt/09a685754251541e04af.js',
    'revision': '9efbaa17af1e966e31cf814a4f769cbf'
  },
  {
    'url': '/_nuxt/11fc27852244986e86ef.js',
    'revision': 'a14ce9651aada90f6aa23347b3456d35'
  },
  {
    'url': '/_nuxt/1c9b11d7f7e56a7f38fe.js',
    'revision': '7d42f1e510d8d62f1361bf4352243ee3'
  },
  {
    'url': '/_nuxt/203bd8f27cdbf649327b.js',
    'revision': '6804e79c9c76c261fa3f51669f2fa6bc'
  },
  {
    'url': '/_nuxt/2b15975c57f6d837318c.js',
    'revision': 'b2ee633b3fc2d4125ae1dca71cb01fb4'
  },
  {
    'url': '/_nuxt/2baae96c80a8a21d453a.js',
    'revision': 'f16975f59757d24c5d370c3c6f8b064f'
  },
  {
    'url': '/_nuxt/2d11759fe278c31bbae8.js',
    'revision': '2657e3ca76b9722af2c57a85baf6e9a1'
  },
  {
    'url': '/_nuxt/561c7fd8bf0ce07566ea.js',
    'revision': '5b08088a126854f0df8dba7c9eca3449'
  },
  {
    'url': '/_nuxt/6cc9166ec9cdff5cbeae.js',
    'revision': 'd34fde0a172fa2849c1185f0ff0c429f'
  },
  {
    'url': '/_nuxt/702018e196cf9e4e6c2a.js',
    'revision': '13c47a5a3bc065667399aead73555473'
  },
  {
    'url': '/_nuxt/7e2046c08d64a46aac87.js',
    'revision': '02a5f25f891a7fa3980eb45cdaef3c2d'
  },
  {
    'url': '/_nuxt/8295d0aef8ec4912bd45.js',
    'revision': 'e9a61396422f55670fce4a1218e02ab7'
  },
  {
    'url': '/_nuxt/877d3e7b5d4bf0d11ba8.js',
    'revision': '1ef65e02b3567ebe920ea6fe827afabd'
  },
  {
    'url': '/_nuxt/98a32d6334afb9f91619.js',
    'revision': '79dac4f97f79049e1ee386550e5dc015'
  },
  {
    'url': '/_nuxt/b552ad654734b5c167e9.js',
    'revision': 'aed78146b7df641efd6f892a5253e74a'
  },
  {
    'url': '/_nuxt/c39c68a3fcbdea9f47cd.js',
    'revision': 'b988bbe5a914e84cb5a793656e84e8b1'
  },
  {
    'url': '/_nuxt/ce0b1849f2e6ba4d45e3.js',
    'revision': '4222dec5b0f657fce3da888cd246ff15'
  },
  {
    'url': '/_nuxt/d454c538a760bbaf152e.js',
    'revision': 'fdd2b8035dbdb150295e0bec01a8ab77'
  },
  {
    'url': '/_nuxt/d6d0c46c79159484e883.js',
    'revision': 'bdd1ef35028ca287e636cb7dffc6dec1'
  },
  {
    'url': '/_nuxt/d7aa47471c3e36528963.js',
    'revision': '8535163f7a1f62f3196a072b9fb4a260'
  },
  {
    'url': '/_nuxt/e4429256fea56527d781.js',
    'revision': 'de31dd8f1f8da97b7a61cc238fb56a30'
  },
  {
    'url': '/_nuxt/f4abff644d9d1a706fbd.js',
    'revision': '7fa87f81b8d72ed2613416163ed86051'
  },
  {
    'url': '/_nuxt/f8fc2cbdccdc5c998982.js',
    'revision': 'a360ca71b31f733f7a14641f4fbb7fef'
  },
  {
    'url': '/_nuxt/fc385587fee1f15130f0.js',
    'revision': '06e4c8666fbfc7564f7e7d9c9275e303'
  },
  {
    'url': '/_nuxt/fe01cdd51ff9d3aa8ca9.js',
    'revision': '6e446a81cb4724bdfc8886c2b1ec9b64'
  },
  {
    'url': '/_nuxt/fe99d78c49b743ee2e58.js',
    'revision': '8a37cf4691d08430f9cc65b673e57b39'
  }
], {
  'cacheId': 'uniswapdex',
  'directoryIndex': '/',
  'cleanUrls': false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
