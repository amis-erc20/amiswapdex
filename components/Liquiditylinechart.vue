<template>
  <div>
    <div id="chart-header-bar">
      <div class="resolution-puls-price">
        <div id="serie-legend">LIQUIDITY / ETH, 1D, UniswapDEX</div>
      </div>
      <div>
        <div id="serie-legend">Volume: {{ volume.toFixed(4)}}</div>
      </div>
    </div>
    <div id="liquidity-line-chart"></div>
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
    let url = `${config.uniswapDexServer}api/histodaymarket?start=${from}`;
    let response = await axios.get(url);
    let data = response.data.result.map(el => ({
      time: parseInt(parseInt(el.timestamp) / 1000),
      value: el.close
    }));
    let chartWidth = parseInt(window.innerWidth * 0.9);
    const chartContainer = document.querySelector("#liquidity-line-chart");
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
    //   console.log(`window resized: ${window.innerWidth}`);
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
      if (range === "1Y" || range === "6M") {
        newScrollPosition = 15;
      } else if (range === "3M") {
        newScrollPosition = 4;
      } else if (range === "1M") {
        newScrollPosition = 2;
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
        to: now + 60 * 60 * 24 * 30
      };
    }
  }
};
</script>
<style>
#liquidity-line-chart {
  width: 90%;
  margin: 0px auto;
  /* margin-top: 0px; */
}
#liquidity-line-chart > div,
#liquidity-line-chart > div > table {
  width: 100% !important;
  height: 500px !important;
}
#liquidity-line-chart > div > table {
  width: 100% !important;
  height: 500px !important;
  border: 1px solid #d5d8da;
}
#serie-legend {
  text-align: left;
  font-weight: bold;
  color: #b14ae2;
  font-size: 14px;
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
  position: relative;
  top: 50px;
  z-index: 100;
  padding-right: 60px;
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
  color: #333;
  border: none;
  font-size: 11px;
  padding: 5px 10px;
  cursor: pointer;
  outline: none;
  border: none;
}

.timerange-button-group .resolution-btn {
  background: rgba(255, 255, 255, 0.8);
  color: #333;
  border: 1px solid #773794;
  margin: 3px;
  font-size: 11px;
  padding: 5px 10px;
  cursor: pointer;
  outline: none;
}
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

