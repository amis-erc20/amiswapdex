<template>
  <div class="market-section">
    <div v-if="market">
      <div class="market-info-table">
        <b-row class="count">
          <b-col class="description">Tokens with liquidity > 1 ETH</b-col>
          <b-col class="value">{{ market.count}}</b-col>
        </b-row>
        <b-row class="count">
          <b-col class="description"></b-col>
          <b-col class="value"></b-col>
        </b-row>

        <b-row class="volume-usd">
          <b-col class="description">24H Market Volume</b-col>
          <b-col class="value">{{ numberWithCommas(market.volume_usd.toFixed(0))}} USD</b-col>
        </b-row>
        <b-row class="volume-eth">
          <b-col class="description"></b-col>
          <b-col class="value">{{ numberWithCommas(market.volume_eth.toFixed(0))}} ETH</b-col>
        </b-row>

        <b-row class="total-usd">
          <b-col class="description">Total Market Liquidity</b-col>
          <b-col class="value">{{ numberWithCommas(market.total_usd.toFixed(0))}} USD</b-col>
        </b-row>
        <b-row class="total-eth">
          <b-col class="description"></b-col>
          <b-col class="value">{{ numberWithCommas(market.total_eth.toFixed(0))}} ETH</b-col>
        </b-row>
      </div>
      <vue-friendly-iframe src="/chart"></vue-friendly-iframe>
    </div>

    <div v-else class="loading-icon">
      <b-spinner label="Spinning"></b-spinner>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import config from "../config";
import {
  getULTToUSDPrice,
  getETHToUSDPrice,
  getTokenToUSDPrice
} from "../assets/js/utils";
export default {
  data: function() {
    return {
      market: null
    };
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getBalance: "account/getBalance",
      getPrice: "account/getPrice",
      getActiveToken: "getActiveToken",
      getTokenList: "account/getTokenList",
      getTotalValue: "account/getTotalValue",
      getActiveTab: "getActiveTab",
      getConnection: "getConnection"
    })
  },
  methods: {
    ...mapActions({
      updatePrice: "account/updatePrice",
      updateSummary: "updateSummary"
    }),
    calculateBalance: function(balance) {
      if (!balance) return 0.0;
      return balance.toFixed(4);
    },
    wait(ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, ms);
      });
    },
    async getSummaryFromServer() {
      console.log("REFRESHING SUMMARY INFO");
      try {
        let response = await axios.get(`${config.uniswapDexServer}api/summary`);
        this.summary = response.data.result;
        await this.updateSummary(this.summary);
      } catch (e) {
        console.warn("Unable to refresh summary info!");
      }
    },
    numberWithCommas(x) {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    },
    async updateMarketInfo(force = false) {
      if (this.getActiveTab === "market" || force === true) {
        let res = await axios.get(`${config.uniswapDexServer}api/marketdata`);
        this.market = res.data.market;
      }
    }
  },
  mounted: async function() {
    let self = this;
    await this.updateMarketInfo(true);
    if (this.getConnection) {
      await this.getSummaryFromServer();
      await this.updateSummary(this.summary);
    }
    setInterval(self.updateMarketInfo, 60000);
  }
};
</script>

<style>
.market-info-table {
  height: 300px;
  width: 50%;
  max-width: 650px;
  min-width: 300px;
  margin: 40px auto;
  margin-bottom: 10px;
}
.market-info-table .row {
  height: 45px;
}
.market-info-table .row .value {
  font-weight: bold;
  text-align: right;
}
.market-info-table .row .description {
  text-align: left;
}
.loading-icon {
  margin-top: 50px;
}
.market-info-table .row.volume-eth .value,
.market-info-table .row.total-eth .value {
  font-size: 14px;
  font-weight: normal;
}
</style>
