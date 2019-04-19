export const state = () => ({
	account: null,
	balance: {
		ETH: 0,
		ULT: 0,
		DAI: 0
	},
	price: {
		ETH: null,
		ULT: null,
		DAI: null
	},
	tokenList: ['ETH', 'ULT', 'DAI', 'FUN', 'BAT']
})

export const getters = {
	getAccount: state => state.account,
	getBalance: state => state.balance,
	getPrice: state => state.price,
	getTokenList: state => state.tokenList
}

export const mutations = {
	addAccount(state, newAccount) {
		state.account = newAccount
	},
	removeAccount(state) {
		state.account = null
	},
	addToken(state, newToken) {
		state.tokenList.push(newToken)
	},
	updateBalance(state, payload) {
		let { symbol, balance } = payload
		state.balance[symbol] = balance
	},
	resetAllBalances(state) {
		state.balance = 0
		state.balanceULT = 0
		state.balanceDAI = 0
	},
	updatePrice(state, payload) {
		let { symbol, price } = payload
		state.price[symbol] = price
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
	},
	async updateBalance(store, payload) {
		store.commit('updateBalance', payload)
	},
	async resetAllBalances(store) {
		store.commit('resetAllBalances')
	},
	async updatePrice(store, payload) {
		store.commit('updatePrice', payload)
	}
}
