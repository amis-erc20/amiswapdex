export const state = () => ({
	account: null,
	balance: 0,
	balanceULT: 0,
	balanceDAI: 0,
	ethPrice: null,
	ultPrice: null,
	daiPrice: null
})

export const getters = {
	getAccount: state => state.account,
	getBalance: state => state.balance,
	getBalanceULT: state => state.balanceULT,
	getBalanceDAI: state => state.balanceDAI,
	getETHPrice: state => state.ethPrice,
	getULTPrice: state => state.ultPrice,
	getDAIPrice: state => state.daiPrice
}

export const mutations = {
	addAccount(state, newAccount) {
		state.account = newAccount
	},
	removeAccount(state) {
		state.account = null
	},
	updateBalance(state, balance) {
		state.balance = balance
	},
	updateBalanceULT(state, balance) {
		state.balanceULT = balance
	},
	updateBalanceDAI(state, balance) {
		state.balanceDAI = balance
	},
	resetAllBalances(state) {
		state.balance = 0
		state.balanceULT = 0
		state.balanceDAI = 0
	},
	updateETHPrice(state, price) {
		state.ethPrice = price
	},
	updateULTPrice(state, price) {
		state.ultPrice = price
	},
	updateDAIPrice(state, price) {
		state.daiPrice = price
	}
}

export const actions = {
	async addAccount(store, payload) {
		store.commit('addAccount', payload)
	},
	async removeAccount(store) {
		store.commit('removeAccount')
	},
	async updateBalance(store, payload) {
		store.commit('updateBalance', payload)
	},
	async updateBalanceULT(store, payload) {
		store.commit('updateBalanceULT', payload)
	},
	async updateBalanceDAI(store, payload) {
		store.commit('updateBalanceDAI', payload)
	},
	async resetAllBalances(store) {
		store.commit('resetAllBalances')
	},
	async updateETHPrice(store, payload) {
		store.commit('updateETHPrice', payload)
	},
	async updateULTPrice(store, payload) {
		store.commit('updateULTPrice', payload)
	},
	async updateDAIPrice(store, payload) {
		store.commit('updateDAIPrice', payload)
	}
}

// {address: "0xfCF86Ab9FBa9fa9C6849CF0cB4D2eB4C1D0D6cf4", privateKey: "0xe55eca06cdb2f3a669d32a2922609c8fe09f3f0b53c803fd773fdfdd5659a886"}
