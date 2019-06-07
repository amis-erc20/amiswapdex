import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'

const _04028ce6 = () => interopDefault(import('../pages/about.vue' /* webpackChunkName: "pages/about" */))
const _1c044b8e = () => interopDefault(import('../pages/backup.vue' /* webpackChunkName: "pages/backup" */))
const _bfabd41a = () => interopDefault(import('../pages/privatekey.vue' /* webpackChunkName: "pages/privatekey" */))
const _7452642d = () => interopDefault(import('../pages/receivetoken.vue' /* webpackChunkName: "pages/receivetoken" */))
const _1fbf86cc = () => interopDefault(import('../pages/recovery.vue' /* webpackChunkName: "pages/recovery" */))
const _3b71da3e = () => interopDefault(import('../pages/recoverysetup.vue' /* webpackChunkName: "pages/recoverysetup" */))
const _70d48a7a = () => interopDefault(import('../pages/resetpassword.vue' /* webpackChunkName: "pages/resetpassword" */))
const _b1b11ad2 = () => interopDefault(import('../pages/scanner.vue' /* webpackChunkName: "pages/scanner" */))
const _029bae4a = () => interopDefault(import('../pages/sendtoken.vue' /* webpackChunkName: "pages/sendtoken" */))
const _0d66c5fb = () => interopDefault(import('../pages/welcome.vue' /* webpackChunkName: "pages/welcome" */))
const _23ba67ab = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

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
      component: _04028ce6,
      name: "about"
    }, {
      path: "/backup",
      component: _1c044b8e,
      name: "backup"
    }, {
      path: "/privatekey",
      component: _bfabd41a,
      name: "privatekey"
    }, {
      path: "/receivetoken",
      component: _7452642d,
      name: "receivetoken"
    }, {
      path: "/recovery",
      component: _1fbf86cc,
      name: "recovery"
    }, {
      path: "/recoverysetup",
      component: _3b71da3e,
      name: "recoverysetup"
    }, {
      path: "/resetpassword",
      component: _70d48a7a,
      name: "resetpassword"
    }, {
      path: "/scanner",
      component: _b1b11ad2,
      name: "scanner"
    }, {
      path: "/sendtoken",
      component: _029bae4a,
      name: "sendtoken"
    }, {
      path: "/welcome",
      component: _0d66c5fb,
      name: "welcome"
    }, {
      path: "/",
      component: _23ba67ab,
      name: "index"
    }],

    fallback: false
  })
}
