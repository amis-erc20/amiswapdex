export const state = () => ({
    transactionList: [],
    tokenTransactionList: [],
    pendingTransactionList: []
})

export const getters = {
    getTransactionList: state => state.transactionList,
    getTokenTransactionList: state => state.tokenTransactionList,
    getPendingTransactionList: state => state.pendingTransactionList
}

export const mutations = {
    addTransaction(state, transaction) {
        state.transactionList.push(transaction)
    },
    addPendingTransaction(state, transaction) {
        state.pendingTransactionList.push(transaction)
    },
    updateTransactionList(state, transaction) {
        state.transactionList = transaction.sort((a, b) => b.timeStamp - a.timeStamp)
    },
    updateTokenTransactionList(state, transaction) {
        state.tokenTransactionList = transaction.sort((a, b) => b.timeStamp - a.timeStamp)
    },
    resetTransactionList(state) {
        state.transactionList = []
    },
    resetTokenTransactionList(state) {
        state.tokenTransactionList = []
    }
}

export const actions = {
    addTransaction(store, payload) {
        store.commit('addTransaction', payload)
    },
    addPendingTransaction(store, payload) {
        store.commit('addPendingTransaction', payload)
    },
    updateTransactionList(store, payload) {
        store.commit('updateTransactionList', payload)
    },
    updateTokenTransactionList(store, payload) {
        store.commit('updateTokenTransactionList', payload)
    },
    resetTransactionList(store) {
        store.commit('resetTransactionList')
    },
    resetTokenTransactionList(store) {
        store.commit('resetTokenTransactionList')
    }
}
