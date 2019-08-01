<template>
  <div class="tokenlist-section">
    <div class="show-zero-balance-tokens">
      <b-form-checkbox
        v-model="hideZeroAmountTokens"
        name="check-button"
        switch
      >Hide tokens with zero token amount</b-form-checkbox>
    </div>
    <div class="walletlist-title">
      <div class="wallet-title-name">Token</div>
      <div class="wallet-title-price">Price</div>
      <div class="wallet-title-roir">
        ROIR
        <b-button
          ref="roir-explain-btn-wallet"
          id="roir-explain-btn-wallet"
          variant="outline-success"
        >?</b-button>
        <b-tooltip target="#roir-explain-btn-wallet" placement="bottom" triggers="hover focus">
          <div
            class="roir-exlplain-text"
          >Return On Investment Rank (ROIR) is approximately the Annual Percentage Rate of return for liquidity providers based only on the 0.3% fee. It is calculated as the average of the 24 hour trading volume over the last 7 days divided by the current liquidity and multiplied by 100 to show as a percent.</div>
        </b-tooltip>
      </div>
      <div class="wallet-title-balance">Balance</div>
    </div>
    <b-card style="border-top: 0px; background: red">
      <b-list-group flush>
        <b-list-group-item
          v-for="token in tokenList"
          :key="token.name + token.tokenAddresses"
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
      getOwnedTokenList: "account/getOwnedTokenList",
      getTransactionList: "transaction/getTransactionList",
      getBalance: "account/getBalance",
      getActiveToken: "getActiveToken",
      getSummary: "getSummary"
    }),
    tokenList: function() {
      let self = this;
      let token;
      let list = this.getTokenList.map(symbol => {
        // let list = this.getOwnedTokenList.map(symbol => {
        // let symbol = t.symbol;
        token = self.getAvailableTokenList.find(t => t.symbol === symbol);
        let roir = null;
        let isLiquidityAdded = false;
        if (token) {
          let summaryInfo = self.getSummary.find(s => s.token_id === token.id);
          if (summaryInfo) {
            roir = summaryInfo.volume_eth_1W / summaryInfo.liquidity;
          }
          let tokenWithLiquidity = self.getOwnedTokenList.find(
            t => t.symbol === "UNI-V1_" + symbol
          );
          if (tokenWithLiquidity) isLiquidityAdded = true;
        } else {
          token = self.getOwnedTokenList.find(t => t.symbol === symbol);
        }
        return {
          name: symbol,
          fullname: token ? token.name : "-",
          balance: self.getBalance[symbol],
          priceInUsd: self.getPrice[symbol],
          src: token ? token.logo : null,
          tokenAddress: token ? token.tokenAddress : null,
          roir: roir,
          isLiquidityAdded
        };
      });
      list = list.filter(t => t.name.slice(0, 7) !== "UNI-V1_");
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
      console.log(tokenName, tokenAddress);
      this.updateActiveToken(tokenName);
      this.updateActiveTokenAddress(tokenAddress);
      this.updateCurrentView("tokeninfo");
      this.showTokenInfoModal = true;

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
.tokenlist-section .wallet-title-roir {
  left: -35px;
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
.walletlist-title {
  display: flex;
  justify-content: space-between;
  padding: 15px 15px;
  font-size: 12px;
  font-weight: bolder;
  background: #d0d0d0;
  margin-bottom: 5px;
  cursor: pointer;
  position: sticky;
  height: 50px;
  width: 100%;
  top: 126px;
  z-index: 500;
}
#roir-explain-btn-wallet {
  padding: 0px;
  font-weight: normal;
  font-size: 12px;
  border: none;
  background: #8b7f91;
  color: #fff !important;
  border-radius: 20px !important;
  width: 18px;
  height: 18px;
}
@media screen and (max-width: 450px) {
  .tokenlist-section .wallet-title-price {
    left: 10px;
    position: relative;
  }
  .tokenlist-section .wallet-title-roir {
    left: 0px;
    position: relative;
  }
}
</style>
