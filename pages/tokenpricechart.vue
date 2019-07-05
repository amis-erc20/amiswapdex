<template>
  <div id="token-price-chart-section">
    <p style="display: none">{{ tokenName}}, {{ currency }}, {{ resolution }}</p>
    <!-- <p style="display: block">{{ tokenName}}, {{ currency }}, {{ resolution }}</p> -->
    <div>
      <b-button-group class="buy-or-sell">
        <b-button
          v-bind:class="{ selected: currency === 'USD' }"
          class="switch-sell"
          @click="changeSelectedCurrency('USD')"
        >{{ tokenName }} / USD</b-button>
        <b-button
          v-bind:class="{ selected: currency === 'ETH' }"
          class="switch-buy"
          @click="changeSelectedCurrency('ETH')"
        >{{ tokenName }} / ETH</b-button>
      </b-button-group>
    </div>
    <!-- <button @click="removeVolumeSerie()">remove volume</button>
    <button @click="removeCandleSerie()">remove</button>
    <button @click="drawChart()">draw</button>-->
    <div id="chart-header-bar">
      <div class="resolution-puls-price">
        <b-button-group class="resolution-button-group">
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
        >{{tokenName}} / {{ currency }}, {{resolution}}, UniswapDEX, Close: {{ price.toFixed(4) }}</div>
      </div>
      <div>
        <div id="serie-legend">Volume: {{ volume.toFixed(4)}}</div>
      </div>
    </div>
    <!-- <div v-show="loading" class="loading-box">
      <scale-loader :loading="loading" :color="`#b14ae2`" :height="`25px`" :width="`4px`"></scale-loader>
      <p>Loading Chart Data</p>
    </div>
    <div v-show="errorMessage.length > 0" class="loading-box">
      <scale-loader :loading="loading" :color="`#b14ae2`" :height="`25px`" :width="`4px`"></scale-loader>
      <p>{{ errorMessage}}</p>
    </div>-->
    <div v-show="true" id="token-bar-chart"></div>
    <div id="chart-footer-bar">
      <b-button-group class="timerange-button-group">
        <b-button
          v-bind:class="{ selected: range === '1Y' }"
          class="resolution-btn"
          @click="changeTimeRange('1Y')"
        >1Y</b-button>
        <b-button
          v-bind:class="{ selected: range === '6M' }"
          class="resolution-btn"
          @click="changeTimeRange('6M')"
        >6M</b-button>
        <b-button
          v-bind:class="{ selected: range === '3M' }"
          class="resolution-btn"
          @click="changeTimeRange('3M')"
        >3M</b-button>
        <b-button
          v-bind:class="{ selected: range === '1M' }"
          class="resolution-btn"
          @click="changeTimeRange('1M')"
        >1M</b-button>
        <b-button
          v-bind:class="{ selected: range === '1W' }"
          class="resolution-btn"
          @click="changeTimeRange('1W')"
        >1W</b-button>
      </b-button-group>
      <svg
        @click="gotoRealtime"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 14 14"
        width="14"
        height="14"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-width="2"
          d="M6.5 1.5l5 5.5-5 5.5M3 4l2.5 3L3 10"
        />
      </svg>
    </div>
  </div>
</template>


<script>
import { mapGetters, mapActions } from "vuex";
import { createChart, CrosshairMode } from "lightweight-charts";
import ScaleLoader from "vue-spinner/src/ScaleLoader.vue";
import config from "../config";
import axios from "axios";
import chartObj from "../components/chartObj";
import { timeout } from "q";
export default {
  components: {
    ScaleLoader
  },
  data: function() {
    return {
      tokenName: "WETH",
      tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      currency: "USD",
      resolution: "1D",
      range: "3M",
      chart: null,
      candleSeries: null,
      volumeSeries: null,
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
    let self = this;
    setInterval(() => {
      try {
        let newChartInfo = JSON.parse(localStorage.getItem("chartInfo"));
        if (!newChartInfo) {
          localStorage.setItem(
            "chartInfo",
            JSON.stringify({
              tokenName: this.tokenName,
              tokenAddress: this.tokenAddress,
              currency: this.currency,
              resolution: this.resolution
            })
          );
        }
        if (newChartInfo.tokenName !== self.tokenName) {
          console.log(
            `Token name changed from ${self.tokenName} to ${
              newChartInfo.tokenName
            }`
          );
          self.shouldUpdateChart = true;
          self.tokenName = newChartInfo.tokenName;
          self.tokenAddress = newChartInfo.tokenAddress;
          self.currency = newChartInfo.currency;
          self.resolution = newChartInfo.resolution || "60";
          self.updateChart();
        } else if (
          newChartInfo.resolution &&
          newChartInfo.resolution !== self.resolution
        ) {
          console.log(
            `Resolution changed from ${self.resolution} to ${
              newChartInfo.resolution
            }`
          );
          self.shouldUpdateChart = true;
          self.tokenName = newChartInfo.tokenName;
          self.tokenAddress = newChartInfo.tokenAddress;
          self.currency = newChartInfo.currency;
          self.resolution = newChartInfo.resolution;
          self.updateChart();
        } else if (newChartInfo.currency !== self.currency) {
          console.log(
            `Currency changed from ${self.currency} to ${newChartInfo.currency}`
          );
          self.shouldUpdateChart = true;
          self.tokenName = newChartInfo.tokenName;
          self.tokenAddress = newChartInfo.tokenAddress;
          self.currency = newChartInfo.currency;
          self.resolution = newChartInfo.resolution;
          self.updateChart();
        }
      } catch (e) {
        console.log(e);
        localStorage.setItem(
          "chartInfo",
          JSON.stringify({
            tokenName: this.tokenName,
            tokenAddress: this.tokenAddress,
            currency: this.currency,
            resolution: this.resolution
          })
        );
      }
    });
    setTimeout(this.drawChart, 1000);
  },
  methods: {
    updateChart() {
      console.log("RELOADING CHART....");
      this.errorMessage = "";
      this.loading = true;
      setTimeout(this.removeVolumeSerie, 1000);
      setTimeout(this.removeCandleSerie, 2000);
      setTimeout(this.drawChart, 3000);
    },
    removeCandleSerie() {
      try {
        chartObj.chart.removeSeries(chartObj.candleSeries);
        chartObj.candleSeries = null;
        console.log(`Candle Serie is removed !`);
      } catch (e) {}
    },
    removeVolumeSerie() {
      try {
        chartObj.chart.removeSeries(chartObj.volumeSeries);
        chartObj.volumeSeries = null;
        console.log(`Volume Serie is removed !`);
      } catch (e) {}
    },
    changeSelectedCurrency(currency) {
      this.loading = false;
      localStorage.setItem(
        "chartInfo",
        JSON.stringify({
          tokenName: this.tokenName,
          tokenAddress: this.tokenAddress,
          currency: currency,
          resolution: this.resolution
        })
      );
    },
    changeResolution(resolution) {
      this.loading = false;
      localStorage.setItem(
        "chartInfo",
        JSON.stringify({
          tokenName: this.tokenName,
          tokenAddress: this.tokenAddress,
          currency: this.currency,
          resolution: resolution
        })
      );
    },
    async syncToResolution() {},
    async drawChart() {
      let self = this;
      if (!chartObj.chart) {
        console.log("Drawing chart...");
        let chartWidth = parseInt(window.innerWidth * 0.9);
        let chartContainer = document.querySelector("#token-bar-chart");
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
        try {
          chartObj.candleSeries = chartObj.chart.addCandlestickSeries();
          chartObj.candleSeries.setData(chartData);
          chartObj.candleSeries.applyOptions({
            priceLineVisible: true,
            priceLineWidth: 1,
            priceLineColor: "#a41ce3",
            priceLineStyle: 3,
            priceFormat: {
              type: "price",
              precision: 4
            }
          });
        } catch (e) {}
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
        try {
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
            },
            priceScale: {
              position: "left",
              mode: 3,
              autoScale: false,
              invertScale: true,
              alignLabels: false,
              borderVisible: false,
              borderColor: "#555ffd",
              scaleMargins: {
                top: 0.3,
                bottom: 0.25
              }
            }
          });
          chartObj.volumeSeries.setData(volumeChartData);
        } catch (e) {}
        // volumeChartData._series._priceScale._options.mode = 1;
        // console.log(volumeChartData._series._priceScale._options);
      }
      if (this.resolution === "60") this.changeTimeRange("1M");
      if (this.resolution === "240") this.changeTimeRange("3M");
      else this.changeTimeRange(this.range);

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
    gotoRealtime() {
      if (!chartObj.chart) return;
      let timeScale = chartObj.chart.timeScale();
      timeScale.scrollToRealTime();
    },
    changeTimeRange(range) {
      if (!chartObj.chart) return;
      if (range === "1Y" || range === "6M") {
        if (this.resolution === "1D" || this.resolution === "240") {
          this.range = range;
          let timeScale = chartObj.chart.timeScale();
          let newTimeObject = this.getTimeObject(range);
          timeScale.setVisibleRange(newTimeObject);
        } else {
          this.range = range;
          this.changeResolution("1D");
          let timeScale = chartObj.chart.timeScale();
          let newTimeObject = this.getTimeObject(range);
          timeScale.setVisibleRange(newTimeObject);
        }

        return;
      } else {
        let timeScale = chartObj.chart.timeScale();
        let newTimeObject = this.getTimeObject(range);
        timeScale.setVisibleRange(newTimeObject);
      }
      // console.log(newTimeObject);
      // console.log(`Desired: ${new Date(newTimeObject.from * 1000)}`);
      // console.log("Time Range Updated");
      this.range = range;
    },
    getTimeObject(range) {
      let now = Math.round(new Date() / 1000);
      let from;
      if (range === "1Y") from = now - 60 * 60 * 24 * 365;
      else if (range === "6M") from = now - 60 * 60 * 24 * 180;
      else if (range === "3M") from = now - 60 * 60 * 24 * 90;
      else if (range === "1M") from = now - 60 * 60 * 24 * 30;
      else from = now - 60 * 60 * 24 * 7;
      return {
        from: from,
        to: now
      };
    },
    async getChartData() {
      let self = this;
      let url;
      if (this.resolution === "60") {
        url = `${config.uniswapDexServer}api/histohour?tokenAddress=${
          this.tokenAddress
        }&start=${1541379723000}`;
      } else if (this.resolution === "240") {
        url = `${config.uniswapDexServer}api/histo4hour?tokenAddress=${
          this.tokenAddress
        }&start=${1541379723000}`;
      } else {
        url = `${config.uniswapDexServer}api/histoday?tokenAddress=${
          this.tokenAddress
        }&start=${1541379723000}`;
      }
      console.log(url);
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
        console.log("Chart data received from server...");
        return bars;
      } else {
        return [];
      }
    }
  }
};
</script>
<style>
#token-price-chart-section {
  overflow: hidden;
}
#token-bar-chart {
  width: 90%;
  margin: 5px auto;
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
  justify-content: space-between;
  width: 90%;
  margin: 0 auto;
  background: transparent;
  padding: 5px;
  position: absolute;
  left: 5.5vw;
  top: 60px;
  z-index: 333;
  padding-right: 80px;
}
#chart-header-bar .resolution-puls-price {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.buy-or-sell {
  text-align: center;
}
.buy-or-sell .switch-buy,
.buy-or-sell .switch-sell {
  width: 170px;
  height: 50px;
  font-size: 13px;
  outline: none;
  border: none;
  background: #bbc1c3;
  color: #333;
  cursor: pointer;
}
.buy-or-sell .switch-buy:hover,
.buy-or-sell .switch-sell:hover {
  outline: none;
  border: none;
  background: #aaa;
}
.buy-or-sell .switch-buy:focus,
.buy-or-sell .switch-sell:focus {
  outline: none;
  border: none;
  box-shadow: none;
}
.buy-or-sell .selected,
.buy-or-sell .selected:hover,
.timerange-button-group .selected {
  background: #773794;
  color: #fff;
  font-weight: bold;
}
.resolution-button-group,
.timerange-button-group {
  padding: 5px;
}
.resolution-button-group .resolution-btn {
  background: #bbc1c3;
  border: none;
  font-size: 11px;
  padding: 5px 10px;
  cursor: pointer;
  outline: none;
  border: none;
}
.resolution-button-group .resolution-btn,
.timerange-button-group .resolution-btn {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #773794;
  font-size: 11px;
  padding: 5px 10px;
  cursor: pointer;
  outline: none;
}
.resolution-button-group .resolution-btn.selected,
.timerange-button-group .resolution-btn.selected {
  background: #773794;
  font-weight: bold;
  color: #fff;
}
#chart-footer-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
  margin: 0 auto;
  background: transparent;
  padding: 5px;
  position: relative;
  top: -70px;
  z-index: 333;
  padding-right: 80px;
}
#chart-footer-bar svg {
  color: #773794;
  background: white;
  border: 1px solid #fff;
  width: 30px;
  height: 30px;
  border-radius: 100px;
  padding: 5px;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0px 1px 3px 2px #676061;
}
#chart-footer-bar svg:hover {
  color: #fff;
  border: none;
  background: #773794;
}
</style>

