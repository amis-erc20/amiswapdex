export const state = () => ({
  account: null,
  balance: {},
  totalValue: 0,
  price: {},
  ethPrice: 0,
  tokenList: [],
  ownedTokenList: [],
  availableTokenList: [],
  badTokenList: [],
  refresher: false,
  roir: {}
})

export const getters = {
  getAccount: state => state.account,
  getBalance: state => state.balance,
  getPrice: state => state.price,
  getEthPrice: state => state.ethPrice,
  getTokenList: state => state.tokenList,
  getOwnedTokenList: state => state.ownedTokenList,
  getTotalValue: state => state.totalValue,
  getAvailableTokenList: state => state.availableTokenList,
  getROIR: state => state.roir,
  getAvailableTokenAddresses: state => {
    let tokenAddressess = {}
    state.availableTokenList.forEach(t => {
      tokenAddressess[t.symbol] = t.tokenAddress
    })
    return tokenAddressess
  },
  getAvailableExchangeAddresses: state => {
    let exchangeAddressess = {}
    state.availableTokenList.forEach(t => {
      exchangeAddressess[t.symbol] = t.exchangeAddress
    })
    return exchangeAddressess
  },
  getRefresher: state => state.refresher,
  getBadTokenList: state => state.badTokenList
}

export const mutations = {
  addAccount(state, newAccount) {
    state.account = newAccount
  },
  removeAccount(state) {
    state.account = null
  },
  addToken(state, newToken) {
    if (state.tokenList.indexOf(newToken.symbol) === -1) {
      state.tokenList.push(newToken.symbol)
    }
    if (!state.price[newToken.symbol]) {
      state.price[newToken.symbol] = newToken.priceInUsd
    }
    state.balance[newToken.symbol] = newToken.balance

    state.totalValue = 0
    for (let key in state.balance) {
      let price = state.price[key]
      if (key === 'ETH') price = state.ethPrice
      state.totalValue += (state.balance[key]) * price || 0.0
    }
  },
  resetTokenList(state) {
    state.tokenList = []
  },
  updateBalance(state, payload) {
    if (state.account === null) return

    let {
      symbol,
      balance
    } = payload
    state.balance = {
      ...state.balance,
      symbol: 0.999
    }
    state.balance[symbol] = balance
    state.totalValue = 0
    for (let key in state.balance) {
      state.totalValue += (state.balance[key]) * (state.price[key] || 0.0)
    }
  },
  resetAllBalances(state) {
    for (var tokenName in state.balance) {
      state.balance[tokenName] = 0
    }
    state.totalValue = 0
  },
  updatePrice(state, payload) {
    let {
      symbol,
      price
    } = payload
    state.price[symbol] = price
  },
  updateEthPrice(state, payload) {
    state.ethPrice = payload
  },
  setAvailableTokenList(state, payload) {
    state.availableTokenList = payload
  },
  setROIR(state, payload) {
    state.roir = payload
  },
  setRefresher(state, payload) {
    state.refresher = payload
  },
  setOwnedTokenList(state, payload) {
    state.ownedTokenList = payload
  },
  setBadTokenList(state, payload) {
    state.badTokenList = payload
  }
}

export const actions = {
  async addAccount(store, payload) {
    store.commit('addAccount', payload)
  },
  async removeAccount(store) {
    store.commit('removeAccount')
  },
  addToken(store, payload) {
    store.commit('addToken', payload)
    // store.commit('updateBalance', payload)
  },
  resetTokenList(store) {
    store.commit('resetTokenList')
  },
  async setAvailableTokenList(store, payload) {
    store.commit('setAvailableTokenList', payload)
  },
  async setROIR(store, payload) {
    store.commit('setROIR', payload)
  },
  async updateBalance(store, payload) {
    store.commit('updateBalance', payload)
  },
  async resetAllBalances(store) {
    store.commit('resetAllBalances')
  },
  async updatePrice(store, payload) {
    store.commit('updatePrice', payload)
  },
  async updateEthPrice(store, payload) {
    store.commit('updateEthPrice', payload)
  },
  async setRefresher(store, payload) {
    store.commit('setRefresher', payload)
  },
  async setOwnedTokenList(store, payload) {
    store.commit('setOwnedTokenList', payload)
  },
  async setBadTokenList(store, payload) {
    store.commit('setBadTokenList', payload)
  }
}