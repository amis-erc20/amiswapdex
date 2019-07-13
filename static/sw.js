importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/178d7f1deeffd48a4197.js",
    "revision": "cb1e08f30d3da05433ad75604c93988a"
  },
  {
    "url": "/_nuxt/18323c5c2223cbbd78b5.js",
    "revision": "aa75b0eb765604f7a185108676ec20de"
  },
  {
    "url": "/_nuxt/1cbe5a38d9ee34a8e0a2.js",
    "revision": "a552e40e7ba548403d86bbadaa351920"
  },
  {
    "url": "/_nuxt/25d422d0b5d653f305cd.js",
    "revision": "54fb35b22300d88fab63fcae0fe7a48b"
  },
  {
    "url": "/_nuxt/2c72341c1404eba91b4f.js",
    "revision": "b914ff0a1db325063b577a16702ed66d"
  },
  {
    "url": "/_nuxt/309ba07a65de4b6a97d9.js",
    "revision": "721ba3534e77f2828a26396294b69977"
  },
  {
    "url": "/_nuxt/3ca6ada47ae1040cf28b.js",
    "revision": "cf30c64596b53530e9f9bc8d1f22821e"
  },
  {
    "url": "/_nuxt/421e83903c03476072cd.js",
    "revision": "3235ca434afe7b92f944508dfaedef5c"
  },
  {
    "url": "/_nuxt/4869b50b0ae3c804244c.js",
    "revision": "b417caf1e07026eb28c8961daf47320b"
  },
  {
    "url": "/_nuxt/4e20fbaf58e4fb34c1be.js",
    "revision": "d3bf479d8328e0a55cb084ca079b2570"
  },
  {
    "url": "/_nuxt/5fbdcfc88109e386b56d.js",
    "revision": "416e70efe11df2330064deecf10ca75a"
  },
  {
    "url": "/_nuxt/8c2b785967293057dba2.js",
    "revision": "d68108f47f8be536e810c55776082e54"
  },
  {
    "url": "/_nuxt/917c11e8a26180554cbf.js",
    "revision": "a148dc0afb4a914121559920df77f334"
  },
  {
    "url": "/_nuxt/93cfc335426418932329.js",
    "revision": "c533812f606537bdba4459781ed17beb"
  },
  {
    "url": "/_nuxt/a125984ae216b156767b.js",
    "revision": "e52b781046b66d0c18b596c0ac5898e0"
  },
  {
    "url": "/_nuxt/a7af4967ea82ff051721.js",
    "revision": "1197222d586d6f1a28f7e12177907895"
  },
  {
    "url": "/_nuxt/ae5f66d5a9878063edd8.js",
    "revision": "453f2944e3b0ab134983d93eeaf9a9a5"
  },
  {
    "url": "/_nuxt/b5c4f3fded9c92641965.js",
    "revision": "2dd6a5adb2c979c92db578ea3b145985"
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
    "url": "/_nuxt/d038d930237038522368.js",
    "revision": "f1df4ef22423e1ba175515eba6af2951"
  },
  {
    "url": "/_nuxt/d2aaac01e959e13dc316.js",
    "revision": "e2457c11a72e653003d35519a08b244c"
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
