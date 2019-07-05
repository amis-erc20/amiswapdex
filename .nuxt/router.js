import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'

const _9bc69e92 = () => interopDefault(import('../pages/chart.vue' /* webpackChunkName: "pages/chart" */))
const _fb7c0cba = () => interopDefault(import('../pages/liquiditychart.vue' /* webpackChunkName: "pages/liquiditychart" */))
const _253bea7c = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _7452642d = () => interopDefault(import('../pages/receivetoken.vue' /* webpackChunkName: "pages/receivetoken" */))
const _1fbf86cc = () => interopDefault(import('../pages/recovery.vue' /* webpackChunkName: "pages/recovery" */))
const _b1b11ad2 = () => interopDefault(import('../pages/scanner.vue' /* webpackChunkName: "pages/scanner" */))
const _5408b4fc = () => interopDefault(import('../pages/tokenchart.vue' /* webpackChunkName: "pages/tokenchart" */))
const _79e452f2 = () => interopDefault(import('../pages/tokenpricechart.vue' /* webpackChunkName: "pages/tokenpricechart" */))
const _0ce8721d = () => interopDefault(import('../pages/volumechart.vue' /* webpackChunkName: "pages/volumechart" */))
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
      path: "/chart",
      component: _9bc69e92,
      name: "chart"
    }, {
      path: "/liquiditychart",
      component: _fb7c0cba,
      name: "liquiditychart"
    }, {
      path: "/login",
      component: _253bea7c,
      name: "login"
    }, {
      path: "/receivetoken",
      component: _7452642d,
      name: "receivetoken"
    }, {
      path: "/recovery",
      component: _1fbf86cc,
      name: "recovery"
    }, {
      path: "/scanner",
      component: _b1b11ad2,
      name: "scanner"
    }, {
      path: "/tokenchart",
      component: _5408b4fc,
      name: "tokenchart"
    }, {
      path: "/tokenpricechart",
      component: _79e452f2,
      name: "tokenpricechart"
    }, {
      path: "/volumechart",
      component: _0ce8721d,
      name: "volumechart"
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
