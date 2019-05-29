<template>
  <div class="token-info-section">
    <div class="token-info-table">
      <b-row>
        <b-col>Name</b-col>
        <b-col v-if="getActiveToken === 'ETH'">Ether</b-col>
        <b-col v-else>{{ selectedToken.name }}</b-col>
      </b-row>
      <b-row>
        <b-col>Symbol</b-col>
        <b-col v-if="getActiveToken === 'ETH'">ETH</b-col>
        <b-col v-else>{{ selectedToken.symbol }}</b-col>
      </b-row>
      <b-row>
        <b-col>Price</b-col>
        <b-col v-if="getActiveToken === 'ETH'">${{ numberWithCommas(getEthPrice.toFixed(2))}}</b-col>
        <b-col v-else-if="selectedToken.price > 1">${{ selectedToken.price.toFixed(2) }}</b-col>
        <b-col v-else-if="selectedToken.price < 1">${{ selectedToken.price.toFixed(4) }}</b-col>
      </b-row>
      <b-row>
        <b-col>24H Change</b-col>
        <b-col
          v-if="selectedToken.change > 0"
          class="token-price-usd positive-change"
        >+{{ (selectedToken.change * 100).toFixed(2) }}%</b-col>
        <b-col
          v-if="selectedToken.change < 0"
          class="token-price-usd negative-change"
        >-{{ (Math.abs(selectedToken.change) * 100).toFixed(2) }}%</b-col>
        <b-col v-if="selectedToken.change == 0" class="token-price-usd zero-change">0.00%</b-col>
      </b-row>
      <b-row>
        <b-col>24H Volume</b-col>
        <b-col>${{ numberWithCommas(selectedToken.volume.toFixed(0)) }}</b-col>
      </b-row>
      <b-row>
        <b-col>Liquidity</b-col>
        <b-col>${{ numberWithCommas(selectedToken.liquidity.toFixed(0)) }}</b-col>
      </b-row>
      <b-row v-if="getActiveToken !== 'ETH'">
        <b-col>Token Address</b-col>
        <b-col cols="8">
          <a
            target="_blank"
            :href="`https://etherscan.io/token/${selectedToken.tokenAddress}`"
          >{{ selectedToken.tokenAddress }}</a>
        </b-col>
      </b-row>
      <b-row v-if="getActiveToken !== 'ETH'">
        <b-col>Exchange Address</b-col>
        <b-col cols="8">
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${selectedToken.exchangeAddress}`"
          >{{ selectedToken.exchangeAddress }}</a>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
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
  metamaskCreateNewExchange
} from "../assets/js/utils";
export default {
  data: function() {
    return {
      summary: null,
      ethToUsd: 0
    };
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getActiveToken: "getActiveToken",
      getSummary: "getSummary",
      getAvailableTokenList: "account/getAvailableTokenList",
      getPrice: "account/getPrice",
      getEthPrice: "account/getEthPrice"
    }),
    selectedToken: function() {
      let self = this;
      let selectedTokenSymbol;
      if (this.getActiveToken === "ETH") selectedTokenSymbol = "USDC";
      else selectedTokenSymbol = this.getActiveToken;
      let token = this.getAvailableTokenList.find(
        t => t.symbol === selectedTokenSymbol
      );
      let foundSummary;
      if (token)
        foundSummary = self.getSummary.find(s => s.token_id === token.id);
      if (!foundSummary || !token)
        return {
          name: this.getActiveToken,
          symbol: this.getActiveToken,
          liquidity: 0,
          volume: 0,
          price: 0,
          src: "/_nuxt/assets/default-token.png",
          order: "-",
          change: 0,
          tokenAddress: "-",
          exchangeAddress: "-"
        };
      else {
        return {
          name: token.name,
          symbol: token.symbol,
          tokenAddress: token.tokenAddress,
          liquidity: foundSummary.liquidity * this.ethToUsd,
          volume: foundSummary.volume_eth_1D * this.ethToUsd,
          price: foundSummary.price_last_1H * this.ethToUsd,
          src: token.logo,
          order: foundSummary.order || "-",
          change: foundSummary.price_change_24h || 0,
          tokenAddress: token.tokenAddress,
          exchangeAddress: token.exchangeAddress
        };
      }
    }
  },
  created: async function() {
    let self = this;
    let activeSymbol =
      this.getActiveToken === "ETH" ? "USDC" : this.getActiveToken;
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
  methods: {
    copyToClipboard(str) {
      const el = document.createElement("textarea");
      el.value = str;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      const selected =
        document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false;
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      if (selected) {
        // If a selection existed before copying
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }
    },
    numberWithCommas(x) {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
  }
};
</script>

<style>
.token-info-section {
  text-align: center;
  width: 90%;
  max-width: 650px;
  margin: 0 auto;
  margin-top: 30px;
  overflow: hidden;
  padding-top: 55px;
  height: calc(100vh - 94px);
}
.token-info-table {
  width: 90%;
  max-width: 500px;
  margin: 0 auto;
}
.token-info-table .row .col {
  height: 40px;
  text-align: left;
  width: 100px;
  font-size: 13px;
}
.token-info-table .row .col:nth-of-type(2) {
  height: 40px;
  text-align: right;
}
.token-info-table .row .col-8 {
  text-align: right;
}
.token-info-table .row .col-8 a {
  font-size: 11px;
  text-align: right;
}
</style>
