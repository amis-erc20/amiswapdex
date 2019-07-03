<template>
  <div class="market-section">
    <div v-if="market">
      <!-- <h4>SUMMARY</h4> -->
      <div class="market-info-table">
        <b-row class="count">
          <b-col class="description" cols="8">Tokens with liquidity > 1 ETH</b-col>
          <b-col class="value">{{ market.count1ETH}}</b-col>
        </b-row>
        <b-row class="count-all">
          <b-col class="description" cols="8"></b-col>
          <b-col class="value">{{ market.count}} Total</b-col>
        </b-row>

        <b-row class="volume-usd">
          <b-col class="description">24H Market Volume</b-col>

          <b-col class="value">{{ numberWithCommas(market.volume_eth.toFixed(0))}} ETH</b-col>
        </b-row>
        <b-row class="volume-eth">
          <b-col class="description"></b-col>
          <b-col class="value">{{ numberWithCommas(market.volume_usd.toFixed(0))}} USD</b-col>
        </b-row>

        <b-row class="total-usd">
          <b-col class="description">Total Market Liquidity</b-col>
          <b-col class="value">{{ numberWithCommas(market.total_eth.toFixed(0))}} ETH</b-col>
        </b-row>
        <b-row class="total-eth">
          <b-col class="description"></b-col>

          <b-col class="value">{{ numberWithCommas(market.total_usd.toFixed(0))}} USD</b-col>
        </b-row>
      </div>
      <Liquiditylinechart />
      <Volumelinechart />
      <Tokenlinechart />
      <!-- <vue-friendly-iframe src="/liquiditychart"></vue-friendly-iframe>
      <vue-friendly-iframe src="/volumechart"></vue-friendly-iframe>
      <vue-friendly-iframe src="/tokenchart"></vue-friendly-iframe>-->
    </div>

    <div v-else class="loading-icon">
      <b-spinner label="Spinning"></b-spinner>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Liquiditylinechart from "~/components/Liquiditylinechart.vue";
import Volumelinechart from "~/components/Volumelinechart.vue";
import Tokenlinechart from "~/components/Tokenlinechart.vue";
import axios from "axios";
import config from "../config";
import * as R from "ramda";
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
  components: {
    Liquiditylinechart,
    Volumelinechart,
    Tokenlinechart
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
        let data = {};
        let res = await axios.get(`${config.uniswapDexServer}api/marketdata`);
        if (res.data.result) {
          let ethToUsd = await getETHToUSDPrice();
          data.count = res.data.result.count;
          data.count1ETH = res.data.result.count1;
          let liquidityResponse = await axios.get(
            `${config.uniswapDexServer}api/histodaymarket?start=${Date.now() -
              1000 * 60 * 60 * 24 * 3}`
          );
          console.log(liquidityResponse);
          let todayLiquidity = R.last(liquidityResponse.data.result);
          data.total_usd = todayLiquidity.open * ethToUsd;
          data.total_eth = todayLiquidity.open;

          let volumeResponse = await axios.get(
            `${config.uniswapDexServer}api/histodayvolume?start=${Date.now() -
              1000 * 60 * 60 * 24 * 3}`
          );
          console.log(volumeResponse);
          let todayVolume = R.last(volumeResponse.data.result);
          data.volume_eth = todayVolume.amount_eth;
          data.volume_usd = todayVolume.amount_eth * todayVolume.price_eth_usd;
          this.market = data;
        }
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
  height: 220px;
  width: 50%;
  max-width: 650px;
  min-width: 300px;
  font-size: 15px;
  margin: 60px auto;
  margin-bottom: 70px;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0px 2px 2px #ccc;
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
  font-size: 13px;
  font-weight: normal;
}

.market-info-table .row.volume-usd,
.market-info-table .row.total-usd {
  height: 25px;
}
.market-info-table .row.volume-eth,
.market-info-table .row.total-eth {
  height: 35px;
}
.market-info-table .row.count {
  height: 25px;
  margin-bottom: 0px;
}
.market-info-table .row.count-all .value {
  height: 10px;
  font-size: 13px;
  font-weight: normal;
}
.market-info-table .row.count-all {
  height: 33px;
}
</style>
