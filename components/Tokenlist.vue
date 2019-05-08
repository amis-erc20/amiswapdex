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
import { getAllListedToken } from "../assets/js/utils";
export default {
  components: { Token },
  data: function() {
    return {
      tokenAddresses: []
    };
  },
  created: async function() {
    this.tokenAddresses = await getAllListedToken();
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getTokenList: "account/getTokenList",
      getAvailableTokenList: "account/getAvailableTokenList",
      getTransactionList: "transaction/getTransactionList",
      getBalance: "account/getBalance",
      getActiveToken: "getActiveToken"
    }),
    tokenList: function() {
      let self = this;
      return this.getTokenList.map(symbol => {
        if (symbol === "ETH" || symbol === "ULT") {
          return {
            name: symbol,
            balance: this.calculateBalance(self.getBalance[symbol]),
            balanceUsd: 0.0
          };
        }
        let tokenInfo = self.getAvailableTokenList.find(
          token => symbol === token.symbol
        );
        let { logo } = tokenInfo;
        return {
          name: symbol,
          balance: this.calculateBalance(self.getBalance[symbol]),
          balanceUsd: 0.0,
          src: logo
        };
      });
    }
  },
  methods: {
    ...mapActions({
      updateTransactionList: "transaction/updateTransactionList",
      updateActiveToken: "updateActiveToken"
    }),
    changeTokenTab: function(event, tokenName) {
      this.updateActiveToken(tokenName);
      this.$router.push("/tokendetail");
    },
    calculateBalance: function(balance) {
      if (!balance || balance === 0) return 0;
      else {
        var parsedBalance = parseFloat(balance / Math.pow(10, 18)).toFixed(6);
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
