<template>
  <div>
    <div id="chart-header-bar">
      <div class="resolution-puls-price">
        <div id="serie-legend">TOKENS ( Liquidity > 1 ETH) / QTY, 1D, UniswapDEX</div>
      </div>
      <div>
        <div id="serie-legend">COUNT: {{ volume.toFixed(4)}}</div>
      </div>
    </div>
    <div id="token-line-chart"></div>
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
import { createChart } from "lightweight-charts";
import config from "../config";
import axios from "axios";
export default {
  data: function() {
    return {
      price: 0,
      volume: 0,
      range: "3M",
      chart: null
    };
  },
  mounted: async function() {
    let self = this;
    let now = Math.round(new Date() / 1000);
    let from = now - 60 * 60 * 24 * 365;
    let url = `${config.uniswapDexServer}api/histodaytoken?start=${from}`;
    let response = await axios.get(url);
    let data = response.data.result.map(el => ({
      time: parseInt(parseInt(el.timestamp) / 1000),
      value: el.close
    }));
    let chartWidth = parseInt(window.innerWidth * 0.9);
    const chartContainer = document.querySelector("#token-line-chart");
    this.chart = createChart(chartContainer, {
      width: chartWidth,
      height: 500
    });
    const lineSeries = this.chart.addLineSeries({
      color: "#a41ce3 ",
      lineWidth: 2,
      scaleMargins: {
        top: 0.3,
        bottom: 0.3
      }
    });
    lineSeries.setData(data);
    lineSeries.applyOptions({
      priceLineVisible: true,
      priceLineWidth: 1,
      priceLineColor: "#a41ce3",
      priceLineStyle: 3
    });
    this.chart.applyOptions({
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
      }
    });
    this.changeTimeRange("1Y");

    this.chart.subscribeCrosshairMove(param => {
      if (param.time) {
        const price = param.seriesPrices.get(lineSeries);
        self.volume = price || 0;
      }
    });

    // window.onresize = function() {
    //   // console.log(`window resized: ${window.innerWidth}`);
    //   self.chart.applyOptions({
    //     width: parseInt(window.innerWidth * 0.9)
    //   });
    // };

    window.addEventListener("resize", function() {
      // console.log(`window resized: ${window.innerWidth}`);
      self.chart.applyOptions({
        width: parseInt(window.innerWidth * 0.9)
      });
    });
  },
  methods: {
    scrollToLatest(timeScale, range) {
      let newScrollPosition;
      let screenWidth = window.innerWidth;
      if (range === "1Y" || range === "6M") {
        newScrollPosition = screenWidth >= 500 ? 15 : 35;
      } else if (range === "3M") {
        newScrollPosition = screenWidth >= 500 ? 4 : 12;
      } else if (range === "1M") {
        newScrollPosition = screenWidth >= 500 ? 2 : 6;
      } else {
        newScrollPosition = 1;
      }
      timeScale.scrollToPosition(newScrollPosition, true);
    },
    gotoRealtime() {
      if (!this.chart) return;
      let timeScale = this.chart.timeScale();
      timeScale.scrollToRealTime();
    },
    changeTimeRange(range) {
      if (!this.chart) return;
      this.range = range;
      let timeScale = this.chart.timeScale();
      let newTimeObject = this.getTimeObject(range);
      timeScale.setVisibleRange(newTimeObject);
      this.scrollToLatest(timeScale, range);
      return;
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
        to: now + 60 * 60 * 24 * 1
      };
    }
  }
};
</script>
<style>
#token-line-chart {
  width: 90%;
  margin: 0px auto;
}
#token-line-chart > div,
#token-line-chart > div > table {
  width: 100% !important;
  height: 500px !important;
}
#token-line-chart > div > table {
  width: 100% !important;
  height: 500px !important;
  border: 1px solid #d5d8da;
}
</style>

