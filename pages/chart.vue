<template>
  <div>
    <p style="display: none">{{ tokenAddress}} {{ currency }} {{tokenName}}</p>
    <div class="TVChartContainer" :id="containerId"></div>
  </div>
</template>

<script>
import { createDatafeed } from "../API/api/index";
import { mapGetters } from "vuex";
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
        tokenName: "USDC",
        currency: "USD",
        showChart: false
      },
      defaultChart: {
        tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        tokenName: "USDC",
        currency: "USD",
        showChart: false
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
    }
  },
  mounted() {
    let self = this;
    try {
      self.chartInfo = JSON.parse(localStorage.getItem("chartInfo"));
    } catch (e) {
      self.chartInfo = self.defaultChart;
    }
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
    console.log("Chart Updated");
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
          this.currency
        ),
        time_frames: [
          { text: "3m", resolution: "60", description: "3 Months" }
        ],
        interval: this.interval,
        container_id: this.containerId,
        library_path: this.libraryPath,
        charts_storage_url: this.chartsStorageUrl,
        charts_storage_api_version: this.chartsStorageApiVersion
        // locale: getLanguageFromURL() || "en",
        // disabled_features: ["use_localstorage_for_settings"],
        // enabled_features: ["study_templates"],
        // client_id: this.clientId,
        // user_id: this.userId,
        // fullscreen: this.fullscreen,
        // autosize: this.autosize,
        // studies_overrides: this.studiesOverrides
      };
      setTimeout(() => {
        console.log("Trading view loaded");
        const tvWidget = (window.tvWidget = new window.TradingView.widget(
          widgetOptions
        ));
        self.tvWidget = tvWidget;
        tvWidget.onChartReady(() => {
          const button = tvWidget
            .createButton()
            .attr("title", "Click to show a notification popup")
            .addClass("apply-common-tooltip")
            .on("click", () =>
              tvWidget.showNoticeDialog({
                title: "Notification",
                body: "TradingView Charting Library API works correctly",
                callback: () => {
                  // eslint-disable-next-line no-console
                  console.log("Noticed!");
                }
              })
            );
          button[0].innerHTML = "Check API";
        });
      }, 2000);
    },
    destroyChart() {
      if (this.tvWidget !== null && this.tvWidget !== undefined) {
        console.log("Destroying widget");
        this.tvWidget.remove();
        this.tvWidget = null;
      } else {
        console.log("No need to destroy widget");
        console.log(this.tvWidget);
      }
    }
  }
};
</script>

<style scoped>
.TVChartContainer {
  height: 500px;
  width: 90%;
  margin: 30px auto;
}
</style>
