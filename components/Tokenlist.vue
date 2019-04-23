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
import { tokenAddresses } from "../assets/js/token";
export default {
  components: { Token },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getTokenList: "account/getTokenList",
      getTransactionList: "transaction/getTransactionList",
      getBalance: "account/getBalance",
      getActiveToken: "getActiveToken"
    }),
    tokenList: function() {
      let self = this;
      return (
        this.getTokenList
          // .filter(symbol => symbol !== "ETH")
          .map(symbol => {
            if (symbol === "ETH" || symbol === "ULT") {
              return {
                name: symbol,
                balance: this.calculateBalance(self.getBalance[symbol]),
                balanceUsd: 0.0
              };
            }
            return {
              name: symbol,
              balance: this.calculateBalance(self.getBalance[symbol]),
              balanceUsd: 0.0,
              src: `https://raw.githubusercontent.com/TrustWallet/tokens/master/tokens/${tokenAddresses[
                symbol
              ].toLowerCase()}.png`
            };
          })
      );
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
      if (!balance || balance === 0) return 0;
      else {
        console.log(`Balance before parse: ${balance}`);
        var parsedBalance = parseFloat(balance / Math.pow(10, 18)).toFixed(6);
        console.log(parsedBalance);
        return parsedBalance;
      }
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
