<template>
  <div class="token-info-section">
    <div class="token-info-table">
      <h1 style="display: none">{{ selectedToken.exchangeAddress }}</h1>
      <b-row>
        <b-col>Name</b-col>
        <b-col v-if="getActiveToken === 'ETH'">Ether</b-col>
        <b-col v-else>{{ selectedToken.name }}</b-col>
      </b-row>
      <b-row>
        <b-col>Symbol</b-col>
        <b-col v-if="getActiveToken === 'ETH'">ETH</b-col>
        <b-col v-else>{{ selectedToken.symbol }}</b-col>
      </b-row>
      <b-row>
        <b-col>Price</b-col>
        <b-col v-if="getActiveToken === 'ETH'">${{ numberWithCommas(getEthPrice.toFixed(2))}}</b-col>
        <b-col v-else-if="selectedToken.price > 1">${{ selectedToken.price.toFixed(2) }}</b-col>
        <b-col v-else-if="selectedToken.price < 1">${{ selectedToken.price.toFixed(4) }}</b-col>
      </b-row>
      <b-row>
        <b-col>24H Change</b-col>
        <b-col
          v-if="selectedToken.change > 0"
          class="token-price-usd positive-change"
        >+{{ (selectedToken.change * 100).toFixed(2) }}%</b-col>
        <b-col
          v-if="selectedToken.change < 0"
          class="token-price-usd negative-change"
        >-{{ (Math.abs(selectedToken.change) * 100).toFixed(2) }}%</b-col>
        <b-col v-if="selectedToken.change == 0" class="token-price-usd zero-change">0.00%</b-col>
      </b-row>
      <b-row>
        <b-col>24H Volume</b-col>
        <b-col>${{ numberWithCommas(selectedToken.volume.toFixed(0)) }}</b-col>
      </b-row>
      <b-row>
        <b-col>Liquidity</b-col>
        <b-col>${{ numberWithCommas(selectedToken.liquidity.toFixed(0)) }}</b-col>
      </b-row>
      <b-row>
        <b-col>ROIR</b-col>
        <b-col>{{ numberWithCommas(selectedToken.roir.toFixed(2)) }}%</b-col>
      </b-row>
      <b-row v-if="getActiveToken !== 'ETH'">
        <b-col>Token Address</b-col>
        <b-col cols="8">
          <a
            target="_blank"
            :href="`https://etherscan.io/token/${selectedToken.tokenAddress}`"
          >{{ selectedToken.tokenAddress }}</a>
        </b-col>
      </b-row>
      <b-row v-if="getActiveToken !== 'ETH'">
        <b-col>Exchange Address</b-col>
        <b-col cols="8">
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${selectedToken.exchangeAddress}`"
          >{{ selectedToken.exchangeAddress }}</a>
        </b-col>
      </b-row>
    </div>

    <vue-friendly-iframe
      v-if="rows.length > 0 && selectedToken.exchangeAddress.length === 42"
      src="/tokenpricechart"
    ></vue-friendly-iframe>

    <h5
      ref="test"
      v-if="rows.length > 0 && selectedToken.exchangeAddress.length === 42"
    >Latest Transactions</h5>
    <vue-good-table
      :columns="columns"
      :rows="rows"
      :line-numbers="true"
      max-height="500px"
      ref="datatable"
      :fixed-header="$mq === 'mobile' ? false : true"
      v-if="getActiveToken !== 'ETH' && rows.length > 0 && selectedToken.exchangeAddress.length === 42"
      :row-style-class="rowStyleClassFn"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import moment from "moment";
import config from "../config";
import {
  getWeb3,
  getWeb3Metamask,
  getBalance,
  getTokenBalance,
  getAllListedToken,
  getETHToUSDPrice,
  getExchangeAddress,
  estimateGas,
  createNewExchange,
  metamaskCreateNewExchange,
  getEvents
} from "../assets/js/utils";
export default {
  components: {},
  data: function() {
    return {
      summary: null,
      ethToUsd: 0,
      chartCurrency: "USD",
      chartLoading: true,
      columns: [
        {
          label: "Date",
          field: "timestamp",
          type: "string",
          sortable: false,
          thClass: "custom-th-class",
          tdClass: "custom-td-class-align-center",
          width: "25%"
        },
        {
          label: "Action",
          field: "action",
          sortable: false,
          thClass: "custom-th-class",
          tdClass: "custom-td-class-align-center",
          width: "10%"
        },
        {
          label: `ETH Amount`,
          field: "amount_eth",
          type: "number",
          sortable: false,
          thClass: "custom-th-class",
          tdClass: "custom-td-class-align-right",
          width: "20%"
        },
        {
          label: `Token Amount`,
          field: "amount_token",
          type: "number",
          sortable: false,
          thClass: "custom-th-class",
          tdClass: "custom-td-class-align-right",
          width: "20%"
        },
        {
          label: "Tx Hash",
          field: "tx_hash",
          type: "string",
          sortable: false,
          html: true,
          thClass: "custom-th-class",
          tdClass: "custom-td-class-align-right",
          width: "25%"
        }
      ],
      rows: []
    };
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getActiveToken: "getActiveToken",
      getActiveTokenAddress: "getActiveTokenAddress",
      getSummary: "getSummary",
      getChartInfo: "getChartInfo",
      getAvailableTokenList: "account/getAvailableTokenList",
      getOwnedTokenList: "account/getOwnedTokenList",
      getPrice: "account/getPrice",
      getEthPrice: "account/getEthPrice"
    }),
    selectedToken: function() {
      let self = this;
      let selectedTokenSymbol;
      let selectedTokenAddress;
      if (this.getActiveToken === "ETH") {
        selectedTokenSymbol = "WETH";
        selectedTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
      } else {
        selectedTokenSymbol = this.getActiveToken;
        selectedTokenAddress = this.getActiveTokenAddress.toLowerCase();
      }
      let token = this.getAvailableTokenList.find(
        t =>
          t.symbol === selectedTokenSymbol &&
          t.tokenAddress.toLowerCase() === selectedTokenAddress.toLowerCase()
      );
      let foundSummary;
      if (token)
        foundSummary = self.getSummary.find(s => s.token_id === token.id);
      if (!foundSummary && token) {
        return {
          name: this.getActiveToken,
          symbol: this.getActiveToken,
          liquidity: 0,
          roir: 0,
          volume: 0,
          price: 0,
          src: "/_nuxt/assets/default-token.png",
          order: "-",
          change: 0,
          tokenAddress: token.tokenAddress,
          exchangeAddress: token.exchangeAddress
        };
      } else if (!foundSummary && !token) {
        let ownedToken = this.getOwnedTokenList.find(
          t => t.symbol === this.getActiveToken
        );
        return {
          name: this.getActiveToken,
          symbol: this.getActiveToken,
          liquidity: 0,
          roir: 0,
          volume: 0,
          price: 0,
          src: "/_nuxt/assets/default-token.png",
          order: "-",
          change: 0,
          tokenAddress: ownedToken ? ownedToken.tokenAddress : "-",
          exchangeAddress: "-"
        };
      } else {
        return {
          name: token.name,
          symbol: token.symbol,
          tokenAddress: token.tokenAddress,
          liquidity: foundSummary.liquidity * this.ethToUsd,
          roir: foundSummary.volume_eth_1W / foundSummary.liquidity,
          volume: foundSummary.volume_eth_1D * this.ethToUsd,
          price: foundSummary.price_last_1H * this.ethToUsd,
          src: token.logo,
          order: foundSummary.order || "-",
          change: foundSummary.price_change_24h || 0,
          tokenAddress: token.tokenAddress,
          exchangeAddress: token.exchangeAddress
        };
      }
    }
  },
  created: async function() {
    let self = this;
    let activeSymbol =
      this.getActiveToken === "ETH" ? "USDC" : this.getActiveToken;
    let token = this.getAvailableTokenList.find(t => t.symbol === activeSymbol);
    if (token) {
      this.summary = this.getSummary.find(s => s.token_id === token.id);
    }
    let ethPrice = this.getPrice["ETH"];
    if (!ethPrice) {
      ethPrice = await getETHToUSDPrice();
    }
    this.ethToUsd = ethPrice;
  },
  mounted: function() {
    let self = this;
    let previousTokenName = this.getActiveToken;
    this.setRows();
    setInterval(self.setRows, 15000);
  },
  beforeUpdate: function() {
    if (this.getActiveToken === null) this.chartCurrency = "ETH";
    if (this.getActiveToken === null) {
      this.rows = [];
    } else if (this.getActiveToken !== null && this.rows.length === 0) {
      this.setRows();
    }
  },
  methods: {
    ...mapActions({
      updateChartInfo: "updateChartInfo"
    }),
    rowStyleClassFn(row) {
      return "row-style";
    },
    async setRows() {
      let token = this.selectedToken;
      if (token.tokenAddress.length < 42 || token.exchangeAddress.length < 42) {
        this.rows = [];
        return;
      }
      let events = await getEvents(token.tokenAddress, 100);
      let result = events.map(e => ({
        timestamp: moment(parseInt(e.timestamp)).calendar(),
        action: e.action,
        amount_eth: e.amount_eth.toFixed(4),
        amount_token: e.amount_token.toFixed(4),
        tx_hash: `<a href="https://etherscan.io/tx/${
          e.tx_hash
        }" target="_blanck">View on Etherscan</a>`
      }));
      this.rows = result;
    },
    changeSelectedCurrency(currency) {
      this.chartCurrency = currency;
      this.updateChartInfo({
        tokenAddress: this.selectedToken.tokenAddress,
        tokenName: this.getActiveToken,
        currency: this.chartCurrency,
        showChart: false
      });
    },
    numberWithCommas(x) {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
  }
};
</script>

<style>
.token-info-section {
  text-align: center;
  width: 90%;
  /* max-width: 700px; */
  margin: 0 auto;
  margin-top: 30px;
  overflow: scroll;
  padding-top: 55px;
  height: calc(100vh - 94px);
}
.token-info-table {
  width: 90%;
  max-width: 500px;
  margin: 0 auto;
}
.token-info-table .row .col {
  height: 40px;
  text-align: left;
  width: 100px;
  font-size: 13px;
}
.token-info-table .row .col:nth-of-type(2) {
  height: 40px;
  text-align: right;
}
.token-info-table .row .col-8 {
  text-align: right;
}
.token-info-table .row .col-8 a {
  font-size: 11px;
  text-align: right;
}
.vue-friendly-iframe > iframe {
  width: 100%;
  height: 630px;
  border: none;
  overflow: hidden;
}
iframe {
  width: 100%;
  height: 700px;
  border: none;
  overflow: hidden;
}
.vgt-wrap {
  width: 90%;
  margin: 20px auto;
}
.row-style {
  font-size: 12px;
  padding-top: 10px;
}
.custom-th-class {
  color: #b14ae2 !important;
  font-size: 13px;
  text-align: center;
}
.custom-td-class-align-center {
  /* width: 20% !important; */
  padding: 10px !important;
  text-align: center;
}
.custom-td-class-align-left {
  /* width: 20% !important; */
  padding: 10px !important;
  text-align: left;
}
.custom-td-class-align-right {
  /* width: 20% !important; */
  padding: 10px !important;
  text-align: right;
}
.vgt-table.bordered td,
.vgt-table.bordered th {
  border-left: 0px !important;
  border-right: 0px !important;
}
@media screen and (max-width: 500px) {
  .token-info-table {
    margin: 20px auto;
  }
  .vue-friendly-iframe > iframe {
    height: 500px;
    width: 90%;
  }
  .custom-th-class {
    color: #b14ae2 !important;
    font-size: 12px;
    text-align: center;
    left: 10px;
  }
}
</style>
