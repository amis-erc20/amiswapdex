export const state = () => ({
  account: null,
  balance: {
    ETH: 0,
    ULT: 0,
    DAI: 0
  },
  totalValue: 0,
  price: {},
  ethPrice: 0,
  tokenList: ['ETH', 'ULT', 'DAI'],
  ownedTokenList: [],
  availableTokenList: [],
  refresher: false
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
  getRefresher: state => state.refresher
}

export const mutations = {
  addAccount (state, newAccount) {
    state.account = newAccount
  },
  removeAccount (state) {
    state.account = null
  },
  addToken (state, newToken) {
    if (state.tokenList.indexOf(newToken) === -1) state.tokenList.push(newToken)
  },
  resetTokenList (state) {
    state.tokenList = ['ETH', 'ULT', 'DAI']
  },
  updateBalance (state, payload) {
    if (state.account === null) return
    let { symbol, balance } = payload
    state.balance[symbol] = balance
    state.totalValue = 0
    for (let key in state.balance) {
      state.totalValue += (state.balance[key] / Math.pow(10, 18)) * state.price[key] || 0.0
    }
  },
  resetAllBalances (state) {
    for (var tokenName in state.balance) {
      state.balance[tokenName] = 0
    }
    state.totalValue = 0
  },
  updatePrice (state, payload) {
    let { symbol, price } = payload
    state.price[symbol] = price
  },
  updateEthPrice (state, payload) {
    state.ethPrice = payload
  },
  setAvailableTokenList (state, payload) {
    state.availableTokenList = payload
  },
  setRefresher (state, payload) {
    state.refresher = payload
  },
  setOwnedTokenList (state, payload) {
    state.ownedTokenList = payload
  }
}

export const actions = {
  async addAccount (store, payload) {
    store.commit('addAccount', payload)
  },
  async removeAccount (store) {
    store.commit('removeAccount')
  },
  addToken (store, payload) {
    store.commit('addToken', payload)
  },
  resetTokenList (store) {
    store.commit('resetTokenList')
  },
  async setAvailableTokenList (store, payload) {
    store.commit('setAvailableTokenList', payload)
  },
  async updateBalance (store, payload) {
    store.commit('updateBalance', payload)
  },
  async resetAllBalances (store) {
    store.commit('resetAllBalances')
  },
  async updatePrice (store, payload) {
    store.commit('updatePrice', payload)
  },
  async updateEthPrice (store, payload) {
    store.commit('updateEthPrice', payload)
  },
  async setRefresher (store, payload) {
    store.commit('setRefresher', payload)
  },
  async setOwnedTokenList (store, payload) {
    store.commit('setOwnedTokenList', payload)
  }
}
