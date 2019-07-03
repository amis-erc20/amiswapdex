<template>
  <div id="token-line-chart">
    <h6>Total Tokens (Liquidity > 1 ETH), 1D, UNISWAPDEX</h6>
  </div>
</template>


<script>
import { createChart } from "lightweight-charts";
import config from "../config";
import axios from "axios";
export default {
  mounted: async function() {
    let url = `${
      config.uniswapDexServer
    }api/histodaytoken?start=${1541379723000}`;
    let response = await axios.get(url);
    let data = response.data.result.map(el => ({
      time: parseInt(parseInt(el.timestamp) / 1000),
      value: el.close
    }));
    let chartWidth = parseInt(window.innerWidth * 0.9);
    const chartContainer = document.querySelector("#token-line-chart");
    const chart = createChart(chartContainer, {
      width: chartWidth,
      height: 500
    });
    const lineSeries = chart.addLineSeries({
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
    chart.applyOptions({
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

    window.onresize = function() {
      console.log("height: ", window.innerHeight, "px");
      chart.applyOptions({
        width: parseInt(window.innerWidth * 0.9)
      });
    };
  }
};
</script>
<style>
#token-line-chart {
  width: 90%;
  margin: 40px auto;
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

