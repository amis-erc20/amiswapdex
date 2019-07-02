const config = require('../config')
export default function ({ store, redirect }) {
  if (!store.state.adminLogIn && config.default.authRequired) {
    redirect('/login')
  }
}
