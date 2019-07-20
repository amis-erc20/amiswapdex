let web3
export const state = () => {
  return {
    signIn: false,
    activeToken: 'ETH',
    activeTab: 'market',
    isOnline: true,
    serverStatus: true,
    backupStatus: null,
    credentials: null,
    authRedirectUrl: {
      url: '/',
      token: null,
      tokenSubTab: 'info'
    },
    summary: [],
    currentView: 'main',
    chartInfo: {
      tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      tokenName: 'WETH',
      currency: 'USD',
      showChart: false
    },
    adminLogIn: false
  }
}

export const getters = {
  getWeb3: () => web3,
  getActiveToken: state => state.activeToken,
  getAdminLogin: state => state.adminLogIn,
  getActiveTab: state => state.activeTab,
  getSignIn: state => state.signIn,
  getConnection: state => state.isOnline,
  getServerStatus: state => state.serverStatus,
  getBackupStatus: state => state.backupStatus,
  getCredentials: state => state.credentials,
  getAuthRedirectUrl: state => state.authRedirectUrl,
  getSummary: state => state.summary,
  getChartInfo: state => state.chartInfo,
  getCurrentView: state => state.currentView,
  getAllTokenPrice: state => {
    let priceList = {}
    state.account.availableTokenList.forEach(token => {
      let summary = state.summary.find(s => s.token_id === token.id)
      if (summary) priceList[token.symbol] = summary.price_last_1H
    })
    return priceList
  }
}

export const actions = {
  async initialiseWeb3(store, action) {
    web3 = action.payload
  },
  updateActiveToken(store, payload) {
    store.commit('updateActiveToken', payload)
  },
  updateCurrentView(store, payload) {
    store.commit('updateCurrentView', payload)
  },
  updateAuthStatus(store, payload) {
    store.commit('updateAuthStatus', payload)
  },
  updateConnection(store, payload) {
    store.commit('updateConnection', payload)
  },
  updateServerStatus(store, payload) {
    store.commit('updateServerStatus', payload)
  },
  updateBackupStatus(store, payload) {
    store.commit('updateBackupStatus', payload)
  },
  updateActiveTab(store, payload) {
    store.commit('updateActiveTab', payload)
  },
  updateCredentials(store, payload) {
    store.commit('updateCredentials', payload)
  },
  updateAuthRedirectUrl(store, payload) {
    store.commit('updateAuthRedirectUrl', payload)
  },
  updateChartInfo(store, payload) {
    store.commit('updateChartInfo', payload)
  },
  adminLogIn(store) {
    store.commit('adminLogIn')
  },
  updateSummary(store, payload) {
    store.commit('updateSummary', payload)
  }
}

export const mutations = {
  updateAuthStatus(state, payload) {
    state.signIn = payload
  },
  updateActiveToken(state, payload) {
    state.activeToken = payload
  },
  updateCurrentView(state, payload) {
    state.currentView = payload
  },
  updateConnection(state, payload) {
    state.isOnline = payload
  },
  updateServerStatus(state, payload) {
    state.serverStatus = payload
  },
  updateBackupStatus(state, payload) {
    state.backupStatus = payload
  },
  updateActiveTab(state, payload) {
    state.activeTab = payload
  },
  updateChartInfo(state, payload) {
    state.chartInfo = payload
    // console.log(payload)
    localStorage.setItem('chartInfo', JSON.stringify(payload))
  },
  updateCredentials(state, payload) {
    state.credentials = payload
  },
  adminLogIn(state) {
    state.adminLogIn = true
  },
  updateAuthRedirectUrl(state, payload) {
    if (payload.url) state.authRedirectUrl.url = payload.url
    if (payload.token) state.authRedirectUrl.token = payload.token || null
    if (payload.tokenSubTab) state.authRedirectUrl.tokenSubTab = payload.tokenSubTab || 'info'
  },
  updateSummary(state, payload) {
    state.summary = payload
  }
}