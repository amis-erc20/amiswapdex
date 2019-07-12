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
    "url": "/_nuxt/1bb56d604eb7ac0ede38.js",
    "revision": "58b28781f615b651c168cae4334c4ac0"
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
    "url": "/_nuxt/3b43e9bc0e53c687e258.js",
    "revision": "80ae60e17e5e9c00e3d0475b4b267a3f"
  },
  {
    "url": "/_nuxt/3ca6ada47ae1040cf28b.js",
    "revision": "cf30c64596b53530e9f9bc8d1f22821e"
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
    "url": "/_nuxt/5851dfa71838b391a81b.js",
    "revision": "b5884640a3bdd1bc64691b34b53c4912"
  },
  {
    "url": "/_nuxt/5fbdcfc88109e386b56d.js",
    "revision": "416e70efe11df2330064deecf10ca75a"
  },
  {
    "url": "/_nuxt/6170ca16af6143e60488.js",
    "revision": "170faef3d898c9a0f81d2754cff1ca1b"
  },
  {
    "url": "/_nuxt/8c2b785967293057dba2.js",
    "revision": "d68108f47f8be536e810c55776082e54"
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
    "url": "/_nuxt/ae5f66d5a9878063edd8.js",
    "revision": "453f2944e3b0ab134983d93eeaf9a9a5"
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
    "url": "/_nuxt/bb159b3eeae3b20c427d.js",
    "revision": "6362caf2aef76992c06aeb1cee980af4"
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
    "url": "/_nuxt/e2103d788d3de038d8bf.js",
    "revision": "4ec90cfe0e2b78b013c29e47f1f9df5e"
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
