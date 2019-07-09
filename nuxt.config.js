const pkg = require('./package')

module.exports = {
  mode: 'spa',

  /*
   ** Headers of the page
   */
  head: {
    // title: pkg.name,
    title: 'UniswapDEX',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: pkg.description
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }],
    script: [
      // { src: 'http://localhost:8888/static/charting_library/charting_library.min.js' }
      // { src: '/charting_library/thant.js' }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },

  /*
   ** Global CSS
   */
  css: ['~/assets/css/main.css'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    '@nuxtjs/pwa'
  ],
  // workbox: {},
  manifest: {
    name: 'UniswapDEX',
    short_name: 'UniDEX',
    lang: 'en',
    display: 'standalone',
    start_url: '/welcome?utm_source=a2hs'
    // icons: [
    // 	{
    // 		src: '/192px.png',
    // 		sizes: '192x192',
    // 		type: 'image/png'
    // 	},
    // 	{
    // 		src: '/512px.png',
    // 		sizes: '512x512',
    // 		type: 'image/png'
    // 	}
    // ]
  },
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    html: {
      minify: {
        minifyJS: false
      }
    }
    // extend(config, ctx) {
    // Run ESLint on save
    // if (ctx.isDev && ctx.isClient) {
    //   config.module.rules.push({
    //     enforce: 'pre',
    //     test: /\.(js|vue)$/,
    //     loader: 'eslint-loader',
    //     exclude: /(node_modules)/
    //   })
    // }
    // }
  }
}