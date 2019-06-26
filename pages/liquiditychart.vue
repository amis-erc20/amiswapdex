<template>
  <div>
    <div class="TVChartContainer" :id="containerIdVolumeChart"></div>
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
  name: "TVVolumeChartContainer",
  data: function() {
    return {
      tvWidget: null,
      currentTokenAddress: "",
      chartInfo: {
        tokenName: "LIQUIDITY",
        currency: "USD",
        type: 'liquidity'
      }
    };
  },
  props: {
    interval: {
      default: "1D",
      type: String
    },
    containerIdVolumeChart: {
      default: "tv_chart_container",
      type: String
    },
    libraryPath: {
      default: "/charting_library/",
      type: String
    },
    chartsStorageUrl: {
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
    })
  },
  mounted() {
    let self = this;
    this.initChart();
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
          null,
          this.chartInfo.tokenName,
          this.chartInfo.currency,
          this.chartInfo.type
        ),
        time_frames: [
          { text: "3M", resolution: "1D", description: "3 Months" },
          { text: "1m", resolution: "240", description: "1 Month" },
          { text: "1W", resolution: "60", description: "1 Week" }
        ],
        interval: this.interval,
        container_id: this.containerIdVolumeChart,
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
