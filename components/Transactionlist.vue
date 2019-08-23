<template>
  <div class="transactionlist-section">
    <b-card style="border-width: 0px 0px 1px 0px;">
      <b-list-group flush v-if="getTxList.length > 0">
        <b-list-group-item
          v-for="transaction in getTxList"
          :key="transaction.hash+parseInt(Math.random() * 1000) "
        >
          <transaction :transaction="transaction" />
        </b-list-group-item>
      </b-list-group>
      <b-button
        variant="outline-primary"
        id="add-token-button"
        @click="loadOlderTxs"
        v-if="showShowLoadMoreBtn"
      >Load Older Transactions</b-button>
    </b-card>
    <div
      class="no-transaction-container"
      v-if="getTxList.length === 0 && getBalance[getActiveToken] > 0"
    >
      <div>Loading Transaction History for {{getActiveToken}}</div>
      <b-spinner style="width: 2rem; height: 2rem;" label="Loading"></b-spinner>
    </div>
    <div
      class="no-transaction-container"
      v-if="getTxList.length === 0 && getBalance[getActiveToken] === 0"
    >No Transaction History for {{getActiveToken}}</div>
  </div>
</template>

<script>
import Transaction from "~/components/Transaction.vue";
import { mapGetters, mapActions } from "vuex";
import * as R from "ramda";
export default {
  components: { Transaction },
  data: function() {
    return {
      showLimit: 10
    };
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getTransactionList: "transaction/getTransactionList",
      getTokenTransactionList: "transaction/getTokenTransactionList",
      getActiveToken: "getActiveToken",
      getBalance: "account/getBalance"
    }),
    getTxList: function() {
      if (this.getActiveToken === "ETH")
        return R.take(this.showLimit, this.getTransactionList);
      else
        return R.take(
          this.showLimit,
          this.getTokenTransactionList.filter(
            tx => tx.tokenSymbol === this.getActiveToken
          )
        );
    },
    showShowLoadMoreBtn() {
      if (this.getActiveToken === "ETH") {
        let ethTxList = this.getTransactionList;
        if (ethTxList.length > this.showLimit) return true;
        else false;
      } else {
        let tokenTxList = this.getTokenTransactionList.filter(
          tx => tx.tokenSymbol === this.getActiveToken
        );
        if (tokenTxList.length > this.showLimit) return true;
        else false;
      }
    }
  },
  methods: {
    ...mapActions({
      updateTransactionList: "transaction/updateTransactionList"
    }),
    loadOlderTxs() {
      this.showLimit += 10;
    }
  },
  mounted: async function() {
    // console.log("component mounted");
  }
};
</script>
<style>
.transactionlist-section {
  box-shadow: 0px 4px 3px #eee;
  max-width: 700px;
  margin: 0 auto;
}
.transactionlist-section .card-header {
  background: #efefef;
}
.transactionlist-section .card-body {
  padding: 0px;
}
.transactionlist-section h4 {
  font-size: 16px;
}
.no-transaction-container {
  text-align: center;
  border: none;
  /* height: 300px; */
  /* padding-top: 150px; */
}
.transactionlist-section .list-group {
  position: relative;
  /* top: -50px; */
}
.transactionlist-section .list-group-item {
  padding: 0px;
  padding-top: 10px;
}

.list-group-flush .list-group-item {
  border-right: 0;
  border-left: 0;
  border-radius: 0;
  margin-bottom: 5px;
}
</style>
