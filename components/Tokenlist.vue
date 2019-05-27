<template>
  <div class="tokenlist-section">
    <div class="show-zero-balance-tokens">
      <b-form-checkbox
        v-model="hideZeroAmountTokens"
        name="check-button"
        switch
      >Hide tokens with zero token amount</b-form-checkbox>
    </div>

    <div class="exchangelist-title">
      <div class="wallet-title-name">Token</div>
      <div class="wallet-title-price">Price</div>
      <div class="wallet-title-price">Balance</div>
    </div>
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
    <div v-if="tokenList.length == 0">
      <b-spinner style="width: 2rem; height: 2rem;" label="Loading"></b-spinner>
    </div>
  </div>
</template>

<script>
import Token from "~/components/Token.vue";
import { mapActions, mapGetters } from "vuex";
import { getAllListedToken } from "../assets/js/utils";
import * as R from "ramda";
export default {
  components: { Token },
  data: function() {
    return {
      tokenAddresses: [],
      hideZeroAmountTokens: true
    };
  },
  created: async function() {
    this.tokenAddresses = await getAllListedToken();
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getTokenList: "account/getTokenList",
      getPrice: "account/getPrice",
      getAvailableTokenList: "account/getAvailableTokenList",
      getTransactionList: "transaction/getTransactionList",
      getBalance: "account/getBalance",
      getActiveToken: "getActiveToken"
    }),
    tokenList: function() {
      let self = this;
      let list = this.getTokenList.map(symbol => {
        let token = self.getAvailableTokenList.find(t => t.symbol === symbol);
        return {
          name: symbol,
          balance: self.getBalance[symbol],
          priceInUsd: self.getPrice[symbol],
          src: token ? token.logo : null
        };
      });
      let ethToken = list.slice(0, 1);
      let otherTokens = list
        .filter(token => {
          if (token.name === "ETH") return false;
          if (self.hideZeroAmountTokens) {
            if (token.balance > 0) return true;
            else return false;
          } else return true;
        })
        .sort((a, b) => b.priceInUsd - a.priceInUsd);
      let sorted = R.concat(ethToken, otherTokens);
      return sorted;
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
        var parsedBalance = parseFloat(balance / Math.pow(10, 18));
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
  max-width: 650px;
  margin: 55px auto;
  margin-bottom: 0px;
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
.tokenlist-section .wallet-title-name {
  padding-left: 5px;
}
.show-zero-balance-tokens {
  text-align: center;
  margin-bottom: 20px;
}
.show-zero-balance-tokens label {
  font-weight: normal;
  padding-top: 5px;
}
</style>
