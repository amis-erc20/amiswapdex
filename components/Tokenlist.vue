<template>
  <div class="tokenlist-section">
    <b-card style="border-top: 0px; background: red">
      <b-list-group flush>
        <b-list-group-item
          v-for="token in tokenList"
          :key="token.name"
          button
          v-on:click="changeTokenTab($event, token.name)"
        >
          <token :token="token"/>
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </div>
</template>

<script>
import Token from "~/components/Token.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  components: { Token },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getTransactionList: "transaction/getTransactionList",
      getBalance: "account/getBalance",
      getBalanceULT: "account/getBalanceULT",
      getBalanceDAI: "account/getBalanceDAI",
      getActiveToken: "getActiveToken"
    }),
    tokenList: function() {
      return [
        {
          name: "ETH",
          balance: this.calculateBalance(this.getBalance),
          balanceUsd: 234.12
        },
        {
          name: "ULT",
          balance: this.calculateBalance(this.getBalanceULT),
          balanceUsd: 234.12
        },
        {
          name: "DAI",
          balance: this.calculateBalance(this.getBalanceDAI),
          balanceUsd: 234.12
        }
      ];
    }
  },
  methods: {
    ...mapActions({
      updateTransactionList: "transaction/updateTransactionList",
      updateActiveToken: "updateActiveToken"
    }),
    changeTokenTab: function(event, tokenName) {
      console.log(tokenName);
      this.updateActiveToken(tokenName);
      this.$router.push("/tokendetail");
    },
    calculateBalance: function(balance) {
      return parseFloat(balance / Math.pow(10, 18)).toFixed(6);
    }
  }
};
</script>


<style>
.list-group-item.active {
  background-color: #171717 !important;
  border: none !important;
  outline: none !important;
}
.list-group-item {
  transition: 0.3s;
}
.list-group-item:focus {
  outline: none;
}
.tokenlist-section {
  width: 100%;
  max-width: 500px;
  margin-top: 25px;
  border-bottom: 1px solid #d2dde6;
}
.tokenlist-section .card {
  border: none;
  outline: none;
}
.tokenlist-section .card-header {
  background: #efefef;
}
.tokenlist-section .card-body {
  padding: 0px;
}
.tokenlist-section h4 {
  font-size: 16px;
}
</style>
