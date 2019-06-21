<template>
  <div>
    <p style="display: none">{{ tokenAddress}} {{ currency }} {{tokenName}}</p>
    <div class="TVChartContainer" :id="containerId"></div>
  </div>
</template>

<script>
import { createDatafeed } from "../API/api/index";
import { mapGetters } from "vuex";
import { prepareChart } from "../assets/js/utils";
function getLanguageFromURL() {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

export default {
  name: "TVChartContainer",
  data: function() {
    return {
      tvWidget: null,
      currentTokenAddress: "",
      chartInfo: {
        tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        tokenName: "LIQUIDITY",
        currency: "USD",
        showChart: false,
        market: true
      },
      defaultChart: {
        tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        tokenName: "LIQUIDITY",
        currency: "USD",
        showChart: false,
        market: true
      }
    };
  },
  props: {
    interval: {
      default: "60",
      type: String
    },
    containerId: {
      default: "tv_chart_container",
      type: String
    },
    datafeedUrl: {
      // default: "https://demo_feed.tradingview.com",
      type: String
    },
    libraryPath: {
      default: "/charting_library/",
      type: String
    },
    chartsStorageUrl: {
      // default: "https://saveload.tradingview.com",
      default: "",
      type: String
    },
    chartsStorageApiVersion: {
      default: "1.1",
      type: String
    },
    clientId: {
      default: "uniswapdex.com",
      type: String
    },
    userId: {
      default: "public_user_id",
      type: String
    },
    fullscreen: {
      default: false,
      type: Boolean
    },
    autosize: {
      default: true,
      type: Boolean
    },
    studiesOverrides: {
      type: Object
    }
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getActiveToken: "getActiveToken",
      getAvailableTokenList: "account/getAvailableTokenList",
      getSummary: "getSummary",
      getAvailableTokenList: "account/getAvailableTokenList",
      getPrice: "account/getPrice",
      getEthPrice: "account/getEthPrice"
    }),
    tokenAddress: function() {
      return this.chartInfo.tokenAddress;
    },
    currency: function() {
      return this.chartInfo.currency;
    },
    tokenName: function() {
      return this.chartInfo.tokenName;
    },
    market: function() {
      return this.chartInfo.market;
    }
  },
  mounted() {
    let self = this;
    try {
      this.chartInfo = JSON.parse(localStorage.getItem("chartInfo"));
    } catch (e) {
      // self.chartInfo = self.defaultChart;
    }
    if (this.chartInfo === null) this.chartInfo = this.defaultChart;
    this.initChart();
    setInterval(() => {
      try {
        let newChartInfo = JSON.parse(localStorage.getItem("chartInfo"));
        if (
          newChartInfo.tokenName !== self.chartInfo.tokenName ||
          newChartInfo.currency !== self.chartInfo.currency
        ) {
          self.chartInfo = newChartInfo;
        }
      } catch (e) {
        // self.chartInfo = self.defaultChart;
      }
    }, 1000);
  },
  updated() {
    this.initChart();
  },
  methods: {
    initChart() {
      let self = this;
      const widgetOptions = {
        symbol: `Uniswap:${self.chartInfo.tokenName}/${
          self.chartInfo.currency
        }`,
        datafeed: createDatafeed(
          this.tokenAddress,
          this.tokenName,
          this.currency,
          this.market
        ),
        time_frames: [
          { text: "3M", resolution: "1D", description: "3 Months" },
          { text: "1m", resolution: "240", description: "1 Month" },
          { text: "1W", resolution: "60", description: "1 Week" }
        ],
        interval: this.interval,
        container_id: this.containerId,
        library_path: this.libraryPath,
        charts_storage_url: this.chartsStorageUrl,
        charts_storage_api_version: this.chartsStorageApiVersion,
        autosize: this.autosize,
        disabled_features: [
          "use_localstorage_for_settings",
          "left_toolbar",
          "header_compare",
          "header_undo_redo",
          "header_indicators"
        ],
        enabled_features: ["items_favoriting"],
        favorites: {
          intervals: ["60", "240", "1D"]
        }
        // locale: getLanguageFromURL() || "en",
        // client_id: this.clientId,
        // user_id: this.userId,
        // fullscreen: this.fullscreen,
        // studies_overrides: this.studiesOverrides
      };
      setTimeout(() => {
        const tvWidget = (window.tvWidget = new window.TradingView.widget(
          widgetOptions
        ));
        self.tvWidget = tvWidget;
        tvWidget.onChartReady(() => {
          prepareChart(tvWidget);
        });
      }, 2000);
    },
    destroyChart() {
      if (this.tvWidget !== null && this.tvWidget !== undefined) {
        this.tvWidget.remove();
        this.tvWidget = null;
      }
    }
  }
};
</script>

<style scoped>
.TVChartContainer {
  height: 500px;
  width: 90%;
  margin: 0px auto;
}
</style>
