let web3

export const state = () => {
	return {
		signIn: false,
		activeToken: 'ETH',
		isOnline: true,
		backupStatus: null,
		credentials: null
	}
}

export const getters = {
	getWeb3: () => web3,
	getActiveToken: state => state.activeToken,
	getSignIn: state => state.signIn,
	getConnection: state => state.isOnline,
	getBackupStatus: state => state.backupStatus,
	getCredentials: state => state.credentials
}

export const actions = {
	async initialiseWeb3(store, action) {
		web3 = action.payload
	},
	updateActiveToken(store, payload) {
		store.commit('updateActiveToken', payload)
	},
	updateAuthStatus(store, payload) {
		console.log(payload)
		store.commit('updateAuthStatus', payload)
	},
	updateConnection(store, payload) {
		store.commit('updateConnection', payload)
	},
	updateBackupStatus(store, payload) {
		store.commit('updateBackupStatus', payload)
	},
	updateCredentials(store, payload) {
		store.commit('updateCredentials', payload)
	}
}

export const mutations = {
	updateAuthStatus(state, payload) {
		state.signIn = payload
	},
	updateActiveToken(state, payload) {
		state.activeToken = payload
	},
	updateConnection(state, payload) {
		state.isOnline = payload
	},
	updateBackupStatus(state, payload) {
		state.backupStatus = payload
	},
	updateCredentials(state, payload) {
		state.credentials = payload
	}
}
