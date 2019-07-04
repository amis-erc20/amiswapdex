<template>
  <div id="token-price-chart-section">
    <p style="display: none">{{ getActiveToken}}, {{ currency }}, {{ resolution }}</p>
    <!-- <p style="display: block">{{ getActiveToken}}, {{ currency }}, {{ resolution }}</p> -->
    <div>
      <b-button-group class="buy-or-sell">
        <b-button
          v-bind:class="{ selected: currency === 'USD' }"
          class="switch-sell"
          @click="changeSelectedCurrency('USD')"
        >{{ getActiveToken }} / USD</b-button>
        <b-button
          v-bind:class="{ selected: currency === 'ETH' }"
          class="switch-buy"
          @click="changeSelectedCurrency('ETH')"
        >{{ getActiveToken }} / ETH</b-button>
      </b-button-group>
    </div>
    <!-- <button @click="removeVolumeSerie()">remove volume</button>
    <button @click="removeCandleSerie()">remove</button>
    <button @click="drawChart()">draw</button>-->
    <div id="chart-header-bar">
      <b-button-group class="buy-or-sell">
        <b-button
          v-bind:class="{ selected: resolution === '60' }"
          class="resolution-btn"
          @click="changeResolution('60')"
        >H</b-button>
        <b-button
          v-bind:class="{ selected: resolution === '240' }"
          class="resolution-btn"
          @click="changeResolution('240')"
        >4H</b-button>
        <b-button
          v-bind:class="{ selected: resolution === '1D' }"
          class="resolution-btn"
          @click="changeResolution('1D')"
        >1D</b-button>
      </b-button-group>
      <div
        id="serie-legend"
      >{{getActiveToken}} / {{ currency }}, {{resolution}}, UniswapDEX, Close: {{ price.toFixed(4) }}, Volume: {{ volume.toFixed(4)}}</div>
    </div>
    <!-- <div v-show="loading" class="loading-box">
      <scale-loader :loading="loading" :color="`#b14ae2`" :height="`25px`" :width="`4px`"></scale-loader>
      <p>Loading Chart Data</p>
    </div>
    <div v-show="errorMessage.length > 0" class="loading-box">
      <scale-loader :loading="loading" :color="`#b14ae2`" :height="`25px`" :width="`4px`"></scale-loader>
      <p>{{ errorMessage}}</p>
    </div>-->
    <!-- <div v-show="true" id="token-bar-chart">abc</div> -->
  </div>
</template>


<script>
import { mapGetters, mapActions } from "vuex";
import { createChart, CrosshairMode } from "lightweight-charts";
import ScaleLoader from "vue-spinner/src/ScaleLoader.vue";
import config from "../config";
import axios from "axios";
import chartObj from "./chartObj";
export default {
  components: {
    ScaleLoader
  },
  data: function() {
    return {
      tokenName: "WETH",
      currency: "USD",
      resolution: "60",
      chart: null,
      candleSeries: null,
      volumeSeries: null,
      defaultToken: {
        symbol: "WETH",
        tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      },
      price: 0,
      volume: 0,
      shouldUpdateChart: false,
      loading: true,
      errorMessage: ""
    };
  },
  computed: {
    ...mapGetters({
      getActiveToken: "getActiveToken",
      getAvailableTokenList: "account/getAvailableTokenList",
      getActiveTab: "getActiveTab",
      getConnection: "getConnection"
    })
  },
  created: async function() {
    setTimeout(this.drawChart, 1000);
  },
  updated: async function() {
    // console.log("component updated...");
    if (this.getActiveToken !== this.tokenName) {
      this.shouldUpdateChart = true;
      this.tokenName = this.getActiveToken;
    }
    if (this.shouldUpdateChart) {
      this.errorMessage = "";
      this.loading = true;
      setTimeout(this.removeVolumeSerie, 0);
      setTimeout(this.removeCandleSerie, 4000);
      setTimeout(() => {
        this.drawChart();
        this.loading = false;
        this.shouldUpdateChart = false;
      }, 6000);

      // let chartData = await this.getChartData();
      // chartObj.candleSeries.setData(chartData);
    }
  },
  methods: {
    removeCandleSerie() {
      chartObj.chart.removeSeries(chartObj.candleSeries);
      chartObj.candleSeries = null;
      // chartObj.chart.removeSeries(chartObj.volumeSeries);
    },
    removeVolumeSerie() {
      chartObj.chart.removeSeries(chartObj.volumeSeries);
      chartObj.volumeSeries = null;
    },
    changeSelectedCurrency(currency) {
      this.currency = currency;
      this.shouldUpdateChart = true;
    },
    changeResolution(resolution) {
      this.loading = false;
      this.resolution = resolution;
      this.shouldUpdateChart = true;
    },
    async syncToResolution() {},
    async drawChart() {
      let self = this;
      console.log("Drawing chart...");
      let chartWidth = parseInt(window.innerWidth * 0.9);
      let container = document.querySelector("#token-bar-chart");
      if (!chartObj.chart) {
        let chartElement = document.createElement("div");
        chartElement.setAttribute("id", "token-bar-chart");
        document
          .querySelector("#token-price-chart-section")
          .appendChild(chartElement);
        const chartContainer = document.querySelector("#token-bar-chart");
        chartObj.chart = createChart(chartContainer, {
          width: chartWidth,
          height: 500
        });
      }
      chartObj.chart.applyOptions({
        grid: {
          vertLines: {
            color: "rgba(70, 130, 180, 0.4)",
            style: 1,
            visible: true
          },
          horzLines: {
            color: "rgba(70, 130, 180, 0.4)",
            style: 1,
            visible: true
          }
        },
        priceScale: {
          position: "right",
          mode: 1,
          autoScale: true,
          alignLabels: true,
          borderVisible: true,
          borderColor: "#555ffd",
          scaleMargins: {
            top: 0.3,
            bottom: 0.25
          }
        },
        timeScale: {
          rightOffset: 12,
          barSpacing: 3,
          fixLeftEdge: true,
          lockVisibleTimeRangeOnResize: true,
          rightBarStaysOnScroll: true,
          borderVisible: false,
          borderColor: "#fff000",
          visible: true,
          timeVisible: true,
          secondsVisible: false
        }
      });

      let chartData;
      if (!chartObj.candleSeries) {
        console.log("Drawing candle series for the first time");
        chartData = await this.getChartData();
        chartObj.candleSeries = chartObj.chart.addCandlestickSeries();
        chartObj.candleSeries.setData(chartData);
        chartObj.candleSeries.applyOptions({
          priceLineVisible: true,
          priceLineWidth: 1,
          priceLineColor: "#a41ce3",
          priceLineStyle: 3
        });
      }

      chartObj.chart.applyOptions({
        width: parseInt(window.innerWidth * 0.9)
      });

      if (!chartObj.volumeSeries) {
        let volumeChartData = chartData.map(d => ({
          time: d.time,
          value: d.volume,
          color:
            d.close > d.open
              ? "rgba(23, 150, 89, 0.5)"
              : "rgba(247, 74, 83, 0.5)"
        }));
        chartObj.volumeSeries = chartObj.chart.addHistogramSeries({
          color: "#26a69a",
          lineWidth: 2,
          priceFormat: {
            type: "volume"
          },
          overlay: true,
          scaleMargins: {
            top: 0.8,
            bottom: 0
          }
        });
        chartObj.volumeSeries.setData(volumeChartData);
      }

      window.onresize = function() {
        chartObj.chart.applyOptions({
          width: parseInt(window.innerWidth * 0.9)
        });
      };

      chartObj.chart.subscribeCrosshairMove(param => {
        if (param.time) {
          const price = param.seriesPrices.get(chartObj.candleSeries);
          self.price = price || 0;
        }
      });
      chartObj.chart.subscribeCrosshairMove(param => {
        if (param.time) {
          const price = param.seriesPrices.get(chartObj.volumeSeries);
          self.volume = price || 0;
        }
      });
    },
    async getChartData() {
      let self = this;
      let url;
      let token = this.getAvailableTokenList.find(
        t => t.symbol === this.getActiveToken
      );
      if (!token) token = this.defaultToken;
      if (this.resolution === "60") {
        url = `${config.uniswapDexServer}api/histohour?tokenAddress=${
          token.tokenAddress
        }&start=${1541379723000}`;
      } else if (this.resolution === "240") {
        url = `${config.uniswapDexServer}api/histo4hour?tokenAddress=${
          token.tokenAddress
        }&start=${1541379723000}`;
      } else {
        url = `${config.uniswapDexServer}api/histoday?tokenAddress=${
          token.tokenAddress
        }&start=${1541379723000}`;
      }
      // console.log(url);
      let response = await axios.get(url);
      let data = response.data;
      if (!data.result || data.result.length === 0) {
        console.log("Fail to get chart data from server !");
        this.errorMessage = "Fail to get chart data from server !";
        return [];
      }
      if (data.result.length > 0) {
        let arr = [];
        arr.push(data.result[0]);
        var bars = data.result.map(el => {
          return {
            time: parseInt(parseInt(el.timestamp) / 1000),
            low: el.low,
            high: el.high,
            open: el.open,
            close: el.close,
            volume: el.volume_eth,
            price_eth_usd: el.price_eth_usd
          };
        });
        if (self.currency === "USD") {
          for (let i = bars.length - 1; i >= 1; i--) {
            bars[i].open = bars[i].open * bars[i - 1].price_eth_usd;
            bars[i].close = bars[i].close * bars[i].price_eth_usd;
            bars[i].high = bars[i].high * bars[i].price_eth_usd;
            bars[i].low = bars[i].low * bars[i].price_eth_usd;
            bars[i].volume = bars[i].volume * bars[i].price_eth_usd;
          }
          bars[0].open = bars[0].open * bars[0].price_eth_usd;
          bars[0].close = bars[0].close * bars[0].price_eth_usd;
          bars[0].high = bars[0].high * bars[0].price_eth_usd;
          bars[0].low = bars[0].low * bars[0].price_eth_usd;
          bars[0].volume = bars[0].volume * bars[0].price_eth_usd;
        }
        bars[bars.length - 1].close = bars[bars.length - 1].open;
        // console.log("Chart data received from server...");
        return bars;
      } else {
        return [];
      }
    }
  }
};
</script>
<style>
#token-bar-chart {
  width: 90%;
  margin: 40px auto;
  margin-top: 5px;
}
.loading-box {
  width: 90%;
  margin: 40px auto;
  margin-top: 5px;
  height: 500px;
  background: #ddd;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
#token-bar-chart > div,
#token-bar-chart > div > table {
  width: 100% !important;
  height: 500px !important;
}
#token-bar-chart > div > table {
  width: 100% !important;
  height: 500px !important;
  border: 1px solid #d5d8da;
}
#serie-legend {
  text-align: left;
  font-weight: bold;
  color: #b14ae2;
  font-size: 12px;
  padding: 0px;
  padding: 10px;
}
#chart-header-bar {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 90%;
  margin: 0 auto;
  background: #fdfdfd;
  padding: 5px;
}
/* .buy-or-sell .resolution-btn {
  background: #bbc1c3;
  border: none;
  font-size: 11px;
} */
</style>

