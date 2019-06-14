<template>
  <div>
    <p style="display: none">{{ tokenAddress}}</p>
    <div class="TVChartContainer" :id="containerId"/>
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
      showChart: false
    };
  },
  props: {
    tokenAddress: {
      default: "",
      type: String
    },
    symbol: {
      default: "Shardus:ULT/ETH",
      type: String
    },
    currency: {
      default: "ETH",
      type: String
    },
    interval: {
      default: "60",
      type: String
    },
    containerId: {
      default: "tv_chart_container",
      type: String
    },
    datafeedUrl: {
      default: "https://demo_feed.tradingview.com",
      type: String
    },
    libraryPath: {
      default: "/charting_library/",
      type: String
    },
    chartsStorageUrl: {
      default: "https://saveload.tradingview.com",
      type: String
    },
    chartsStorageApiVersion: {
      default: "1.1",
      type: String
    },
    clientId: {
      default: "tradingview.com",
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
      getSummary: "getSummary",
      getAvailableTokenList: "account/getAvailableTokenList",
      getPrice: "account/getPrice",
      getEthPrice: "account/getEthPrice"
    })
  },
  tvWidget: null,
  mounted() {
    console.log("TV mounted...");
    console.log(this.tokenAddress);
    this.initChart();
  },
  beforeUpdate() {
    console.log("before update");
    console.log(this.tokenAddress);
    this.initChart();
  },
  destroyed() {
    if (this.tvWidget !== null) {
      //   this.tvWidget.remove();
      //   this.tvWidget = null;
    }
  },
  methods: {
    initChart() {
      let self = this;
      const widgetOptions = {
        symbol: `Uniswap:${this.getActiveToken}/USD`,
        datafeed: createDatafeed(this.tokenAddress, this.getActiveToken),
        time_frames: [
          { text: "3m", resolution: "60", description: "3 Months" }
        ],
        interval: this.interval,
        container_id: this.containerId,
        library_path: this.libraryPath,
        locale: getLanguageFromURL() || "en",
        disabled_features: ["use_localstorage_for_settings"],
        enabled_features: ["study_templates"],
        charts_storage_url: this.chartsStorageUrl,
        charts_storage_api_version: this.chartsStorageApiVersion,
        client_id: this.clientId,
        user_id: this.userId,
        fullscreen: this.fullscreen,
        autosize: this.autosize,
        studies_overrides: this.studiesOverrides
      };

      setTimeout(() => {
        console.log("Trading view loaded");
        console.log(window.TradingView);
        const tvWidget = (window.tvWidget = new window.TradingView.widget(
          widgetOptions
        ));
        this.tvWidget = tvWidget;
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
      }, 3000);

      //   setTimeout(() => {
      //     self.showChart = true;
      //   }, 4000);
    }
  }
};
</script>

<style scoped>
.TVChartContainer {
  height: 500px;
  width: 70%;
  margin: 30px auto;
}
</style>
