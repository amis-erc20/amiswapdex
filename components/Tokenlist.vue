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
      <div class="wallet-title-balance">Balance</div>
    </div>
    <b-card style="border-top: 0px; background: red">
      <b-list-group flush>
        <b-list-group-item
          v-for="token in tokenList"
          :key="token.name"
          button
          v-on:click="changeTokenTab($event, token.name, token.tokenAddress)"
        >
          <token :token="token" />
        </b-list-group-item>
      </b-list-group>
    </b-card>
    <Tokeninfo
      :show="{shouldShow: showTokenInfoModal, timestamp: Date.now()}"
      v-on:child-msg="closeTokenInfo"
    />
    <div v-if="tokenList.length == 0">
      <b-spinner style="width: 2rem; height: 2rem;" label="Loading"></b-spinner>
    </div>
  </div>
</template>

<script>
import Token from "~/components/Token.vue";
import Tokeninfo from "~/components/Tokeninfo.vue";
import { mapActions, mapGetters } from "vuex";
import { getAllListedToken } from "../assets/js/utils";
import * as R from "ramda";
export default {
  components: { Token, Tokeninfo },
  data: function() {
    return {
      tokenAddresses: [],
      hideZeroAmountTokens: true,
      showTokenInfoModal: false
    };
  },
  props: ["balance"],
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
          fullname: token ? token.name : "-",
          balance: self.getBalance[symbol],
          priceInUsd: self.getPrice[symbol],
          src: token ? token.logo : null,
          tokenAddress: token ? token.tokenAddress : null
        };
      });
      let ethToken = list.slice(0, 1);
      ethToken.fullname = "Ether";
      let otherTokens = list.filter(token => {
        if (token.name === "ETH") return false;
        if (self.hideZeroAmountTokens) {
          if (token.balance > 0) return true;
          else return false;
        } else return true;
      });
      otherTokens = otherTokens.sort(
        (a, b) => b.priceInUsd * b.balance - a.priceInUsd * a.balance
      );
      let sorted = R.concat(ethToken, otherTokens);
      return sorted;
    }
  },
  methods: {
    ...mapActions({
      updateTransactionList: "transaction/updateTransactionList",
      updateActiveToken: "updateActiveToken",
      updateActiveTokenAddress: "updateActiveTokenAddress",
      updateCurrentView: "updateCurrentView",
      updateChartInfo: "updateChartInfo"
    }),
    changeTokenTab: function(event, tokenName, tokenAddress) {
      this.updateActiveToken(tokenName);
      this.updateActiveTokenAddress(tokenAddress);
      this.showTokenInfoModal = true;
      this.updateCurrentView("tokeninfo");

      let token = this.getAvailableTokenList.find(t => t.symbol === tokenName);
      if (token) {
        this.updateChartInfo({
          currency: "USD",
          showChart: true,
          tokenAddress: token.tokenAddress,
          tokenName: tokenName
        });
      }
    },
    closeTokenInfo() {
      this.showTokenInfoModal = false;
      this.updateCurrentView("main");
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
  max-width: 700px;
  margin: 30px auto;
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
.tokenlist-section .wallet-title-name {
  padding-left: 5px;
}
.tokenlist-section .wallet-title-price {
  left: -15px;
  position: relative;
}
.show-zero-balance-tokens {
  text-align: center;
  margin-bottom: 20px;
}
.show-zero-balance-tokens label {
  font-weight: normal;
  padding-top: 5px;
}
@media screen and (max-width: 450px) {
  .tokenlist-section .wallet-title-price {
    left: 10px;
    position: relative;
  }
}
</style>
