import {
	checkImageExist
} from "../assets/js/utils";
export const state = () => ({
	account: null,
	balance: {
		ETH: 0,
		ULT: 0,
		DAI: 0
	},
	totalValue: 0,
	price: {},
	tokenList: ['ETH', 'ULT', 'DAI'],
	availableTokenList: []
})

export const getters = {
	getAccount: state => state.account,
	getBalance: state => state.balance,
	getPrice: state => state.price,
	getTokenList: state => state.tokenList,
	getTotalValue: state => state.totalValue,
	getAvailableTokenList: state => state.availableTokenList
}

export const mutations = {
	addAccount(state, newAccount) {
		state.account = newAccount
	},
	removeAccount(state) {
		state.account = null
	},
	addToken(state, newToken) {
		if (state.tokenList.indexOf(newToken) === -1) state.tokenList.push(newToken)
	},
	updateBalance(state, payload) {
		let { symbol, balance } = payload
		state.balance[symbol] = balance
		state.totalValue = 0
		for (let key in state.balance) {
			state.totalValue += (state.balance[key] / Math.pow(10, 18)) * state.price[key]
		}
	},
	resetAllBalances(state) {
		for (var tokenName in state.balance) {
			state.balance[tokenName] = 0
		}
	},
	updatePrice(state, payload) {
		let { symbol, price } = payload
		state.price[symbol] = price
	},
	setAvailableTokenList(state, payload) {
		state.availableTokenList = payload
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
	async setAvailableTokenList(store, payload) {
		store.commit('setAvailableTokenList', payload)
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
