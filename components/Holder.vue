<template>
  <div
    class="token-holder-section"
    v-if="getActiveToken !== 'ETH' && selectedToken.holderCount !== null"
  >
    <p>
      This token has
      <span>{{ selectedToken.holderCount }}</span> holders and
      <span>{{ selectedToken.txsCount }}</span> transfers. It has
      <span class="no-blue-mark" v-if="selectedToken.hasBlueTick === false">not</span> received
      <a
        href="https://etherscancom.freshdesk.com/support/solutions/articles/35000082730-the-blue-checkmark"
        target="_blank"
      >a blue checkmark</a> on Etherscan.io
    </p>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import moment from "moment";
import config from "../config";
import {
  getWeb3,
  getWeb3Metamask,
  getBalance,
  getTokenBalance,
  getAllListedToken,
  getETHToUSDPrice,
  getExchangeAddress,
  estimateGas,
  createNewExchange,
  metamaskCreateNewExchange,
  getEvents
} from "../assets/js/utils";
export default {
  components: {},
  data: function() {
    return {
      summary: null
    };
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getActiveToken: "getActiveToken",
      getActiveTokenAddress: "getActiveTokenAddress",
      getSummary: "getSummary",
      getChartInfo: "getChartInfo",
      getAvailableTokenList: "account/getAvailableTokenList",
      getOwnedTokenList: "account/getOwnedTokenList",
      getPrice: "account/getPrice",
      getEthPrice: "account/getEthPrice"
    }),
    selectedToken: function() {
      let self = this;
      let selectedTokenSymbol;
      let selectedTokenAddress;
      if (this.getActiveToken === "ETH") {
        selectedTokenSymbol = "ETH";
        selectedTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
      } else {
        selectedTokenSymbol = this.getActiveToken;
        selectedTokenAddress = this.getActiveTokenAddress.toLowerCase();
      }
      let token = this.getAvailableTokenList.find(
        t =>
          t.symbol === selectedTokenSymbol &&
          t.tokenAddress.toLowerCase() === selectedTokenAddress.toLowerCase()
      );
      let foundSummary;
      if (token)
        foundSummary = self.getSummary.find(s => s.token_id === token.id);
      if (!foundSummary && token) {
        return {
          holderCount: 0,
          hasBlueTick: false,
          txsCount: 0
        };
      } else if (!foundSummary && !token) {
        let ownedToken = this.getOwnedTokenList.find(
          t => t.symbol === this.getActiveToken
        );
        return {
          holderCount: null,
          hasBlueTick: null,
          txsCount: null
        };
      } else {
        return {
          holderCount: foundSummary.holderCount,
          hasBlueTick: foundSummary.hasBlueTick,
          txsCount: foundSummary.txsCount
        };
      }
    }
  },
  created: async function() {
    let self = this;
    let activeSymbol =
      this.getActiveToken === "ETH" ? "WETH" : this.getActiveToken;
    let token = this.getAvailableTokenList.find(t => t.symbol === activeSymbol);
    if (token) {
      this.summary = this.getSummary.find(s => s.token_id === token.id);
    }
    let ethPrice = this.getPrice["ETH"];
    if (!ethPrice) {
      ethPrice = await getETHToUSDPrice();
    }
    this.ethToUsd = ethPrice;
  },
  mounted: function() {},
  beforeUpdate: function() {},
  methods: {
    ...mapActions({
      updateChartInfo: "updateChartInfo"
    })
  }
};
</script>

<style>
.token-holder-section {
  width: 90%;
  height: auto;
  max-width: 500px;
  margin: 0 auto;
  text-align: left;
  font-size: 13px;
  font-weight: normal;
  line-height: 1.6;
  border: 1px solid #c9c9c9;
  padding: 10px 10px;
  margin: 25px auto;
}
.token-holder-section p {
  margin: 0;
}
.token-holder-section p span {
  font-weight: bold;
}
.token-holder-section p a:hover {
  text-decoration: none;
}
.no-blue-mark {
  font-style: italic;
}
</style>
