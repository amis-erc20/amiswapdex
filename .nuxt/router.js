import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'

const _08306a1b = () => interopDefault(import('../pages/about.vue' /* webpackChunkName: "pages/about" */))
const _738ba3a4 = () => interopDefault(import('../pages/backup.vue' /* webpackChunkName: "pages/backup" */))
const _ace19c44 = () => interopDefault(import('../pages/privatekey.vue' /* webpackChunkName: "pages/privatekey" */))
const _8e3f9d50 = () => interopDefault(import('../pages/receivetoken.vue' /* webpackChunkName: "pages/receivetoken" */))
const _7500a177 = () => interopDefault(import('../pages/recovery.vue' /* webpackChunkName: "pages/recovery" */))
const _2f72eb16 = () => interopDefault(import('../pages/recoverysetup.vue' /* webpackChunkName: "pages/recoverysetup" */))
const _14c192f8 = () => interopDefault(import('../pages/resetpassword.vue' /* webpackChunkName: "pages/resetpassword" */))
const _5752d68c = () => interopDefault(import('../pages/scanner.vue' /* webpackChunkName: "pages/scanner" */))
const _557de8ff = () => interopDefault(import('../pages/sendtoken.vue' /* webpackChunkName: "pages/sendtoken" */))
const _7830ad84 = () => interopDefault(import('../pages/signin.vue' /* webpackChunkName: "pages/signin" */))
const _e671f80c = () => interopDefault(import('../pages/signup.vue' /* webpackChunkName: "pages/signup" */))
const _78607958 = () => interopDefault(import('../pages/swaptoken.vue' /* webpackChunkName: "pages/swaptoken" */))
const _aa8ef9d0 = () => interopDefault(import('../pages/tokendetail.vue' /* webpackChunkName: "pages/tokendetail" */))
const _72754fe6 = () => interopDefault(import('../pages/tos.vue' /* webpackChunkName: "pages/tos" */))
const _84dbac20 = () => interopDefault(import('../pages/welcome.vue' /* webpackChunkName: "pages/welcome" */))
const _27e844e0 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

Vue.use(Router)

if (process.client) {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'

    // reset scrollRestoration to auto when leaving page, allowing page reload
    // and back-navigation from other pages to use the browser to restore the
    // scrolling position.
    window.addEventListener('beforeunload', () => {
      window.history.scrollRestoration = 'auto'
    })

    // Setting scrollRestoration to manual again when returning to this page.
    window.addEventListener('load', () => {
      window.history.scrollRestoration = 'manual'
    })
  }
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected and scrollToTop is not explicitly disabled
  if (
    to.matched.length < 2 &&
    to.matched.every(r => r.components.default.options.scrollToTop !== false)
  ) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise((resolve) => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}

export function createRouter() {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,

    routes: [{
      path: "/about",
      component: _08306a1b,
      name: "about"
    }, {
      path: "/backup",
      component: _738ba3a4,
      name: "backup"
    }, {
      path: "/privatekey",
      component: _ace19c44,
      name: "privatekey"
    }, {
      path: "/receivetoken",
      component: _8e3f9d50,
      name: "receivetoken"
    }, {
      path: "/recovery",
      component: _7500a177,
      name: "recovery"
    }, {
      path: "/recoverysetup",
      component: _2f72eb16,
      name: "recoverysetup"
    }, {
      path: "/resetpassword",
      component: _14c192f8,
      name: "resetpassword"
    }, {
      path: "/scanner",
      component: _5752d68c,
      name: "scanner"
    }, {
      path: "/sendtoken",
      component: _557de8ff,
      name: "sendtoken"
    }, {
      path: "/signin",
      component: _7830ad84,
      name: "signin"
    }, {
      path: "/signup",
      component: _e671f80c,
      name: "signup"
    }, {
      path: "/swaptoken",
      component: _78607958,
      name: "swaptoken"
    }, {
      path: "/tokendetail",
      component: _aa8ef9d0,
      name: "tokendetail"
    }, {
      path: "/tos",
      component: _72754fe6,
      name: "tos"
    }, {
      path: "/welcome",
      component: _84dbac20,
      name: "welcome"
    }, {
      path: "/",
      component: _27e844e0,
      name: "index"
    }],

    fallback: false
  })
}
