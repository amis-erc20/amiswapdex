import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'

const _5ef57b1c = () => interopDefault(import('..\\pages\\chart.vue' /* webpackChunkName: "pages_chart" */))
const _23922a48 = () => interopDefault(import('..\\pages\\liquiditychart.vue' /* webpackChunkName: "pages_liquiditychart" */))
const _0bca9c7d = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages_login" */))
const _3cd07a12 = () => interopDefault(import('..\\pages\\receivetoken.vue' /* webpackChunkName: "pages_receivetoken" */))
const _6ad3519e = () => interopDefault(import('..\\pages\\recovery.vue' /* webpackChunkName: "pages_recovery" */))
const _649afcdc = () => interopDefault(import('..\\pages\\scanner.vue' /* webpackChunkName: "pages_scanner" */))
const _b725ffbe = () => interopDefault(import('..\\pages\\tokenchart.vue' /* webpackChunkName: "pages_tokenchart" */))
const _6de4e8d0 = () => interopDefault(import('..\\pages\\volumechart.vue' /* webpackChunkName: "pages_volumechart" */))
const _33f1d4f6 = () => interopDefault(import('..\\pages\\welcome.vue' /* webpackChunkName: "pages_welcome" */))
const _4222f966 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

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
      component: _5ef57b1c,
      name: "chart"
    }, {
      path: "/liquiditychart",
      component: _23922a48,
      name: "liquiditychart"
    }, {
      path: "/login",
      component: _0bca9c7d,
      name: "login"
    }, {
      path: "/receivetoken",
      component: _3cd07a12,
      name: "receivetoken"
    }, {
      path: "/recovery",
      component: _6ad3519e,
      name: "recovery"
    }, {
      path: "/scanner",
      component: _649afcdc,
      name: "scanner"
    }, {
      path: "/tokenchart",
      component: _b725ffbe,
      name: "tokenchart"
    }, {
      path: "/volumechart",
      component: _6de4e8d0,
      name: "volumechart"
    }, {
      path: "/welcome",
      component: _33f1d4f6,
      name: "welcome"
    }, {
      path: "/",
      component: _4222f966,
      name: "index"
    }],

    fallback: false
  })
}
