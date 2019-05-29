<template>
  <div class="transactionlist-section">
    <b-card style="border-width: 0px 0px 1px 0px;">
      <b-list-group flush v-if="getTxList.length > 0">
        <b-list-group-item
          v-for="transaction in getTxList"
          :key="transaction.hash+parseInt(Math.random() * 100) "
        >
          <transaction :transaction="transaction"/>
        </b-list-group-item>
      </b-list-group>
    </b-card>
    <div
      class="no-transaction-container"
      v-if="getTxList.length === 0"
    >No Transaction History for {{getActiveToken}}</div>
  </div>
</template>

<script>
import Transaction from "~/components/Transaction.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { Transaction },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getTransactionList: "transaction/getTransactionList",
      getTokenTransactionList: "transaction/getTokenTransactionList",
      getActiveToken: "getActiveToken"
    }),
    getTxList: function() {
      if (this.getActiveToken === "ETH") return this.getTransactionList;
      else
        return this.getTokenTransactionList.filter(
          tx => tx.tokenSymbol === this.getActiveToken
        );
    }
  },
  methods: {
    ...mapActions({
      updateTransactionList: "transaction/updateTransactionList"
    })
  },
  mounted: async function() {
    console.log("component mounted");
  }
};
</script>


<style>
.transactionlist-section {
  box-shadow: 0px 4px 3px #eee;
  max-width: 650px;
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
