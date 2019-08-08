<template>
  <div class="market-section">
    <Loading v-if="redirecting" message="Redirecting" />
    <Loading v-if="market.count < 1 || loadingCharts" message="Loading" />
    <div v-if="market.count > 1 && !redirecting">
      <div class="market-info-table">
        <b-row class="count">
          <b-col class="description" cols="8">Tokens with liquidity > 1 ETH</b-col>
          <b-col class="value">{{ market.count1 || '...' }}</b-col>
        </b-row>
        <b-row class="count-all">
          <b-col class="description" cols="8"></b-col>
          <b-col v-if="market.count" class="value">{{ market.count }} Total</b-col>
        </b-row>

        <b-row class="volume-eth">
          <b-col class="description">24H Market Volume</b-col>
          <b-col
            v-if="market.volume_eth"
            class="value"
          >{{ numberWithCommas(market.volume_eth.toFixed(0))}} ETH</b-col>
          <b-col v-else class="value">...</b-col>
        </b-row>
        <b-row class="volume-usd">
          <b-col class="description"></b-col>
          <b-col
            v-if="market.volume_usd"
            class="value"
          >{{ numberWithCommas(market.volume_usd.toFixed(0))}} USD</b-col>
        </b-row>
        <b-row class="volume-uniswap-percent">
          <b-col class="description"></b-col>
          <b-col
            v-if="market.volume_uniswapdex || market.volume_uniswapdex === 0"
            class="value uniswap-percent-value"
          >({{ market.volume_uniswapdex.toFixed(2) }}% via uniswapDEX.com)</b-col>
        </b-row>

        <b-row class="total-eth">
          <b-col class="description">Total Market Liquidity</b-col>
          <b-col
            v-if="market.total_eth"
            class="value"
          >{{ numberWithCommas(market.total_eth.toFixed(0))}} ETH</b-col>
          <b-col v-else class="value">...</b-col>
        </b-row>
        <b-row class="total-usd">
          <b-col class="description"></b-col>
          <b-col
            v-if="market.total_usd"
            class="value"
          >{{ numberWithCommas(market.total_usd.toFixed(0))}} USD</b-col>
        </b-row>
      </div>
      <Tokenlinechart />
      <Volumelinechart />
      <Liquiditylinechart />
      <Donation />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Liquiditylinechart from "~/components/Liquiditylinechart.vue";
import Volumelinechart from "~/components/Volumelinechart.vue";
import Tokenlinechart from "~/components/Tokenlinechart.vue";
import Swap from "~/components/Swap.vue";
import Send from "~/components/Send.vue";
import Noaccount from "~/components/Noaccount.vue";
import Loading from "~/components/Loading.vue";
import Donation from "~/components/Donation.vue";
import axios from "axios";
import config from "../config";
import * as R from "ramda";
import { getETHToUSDPrice, getTokenToUSDPrice } from "../assets/js/utils";
export default {
  data: function() {
    return {
      market: {
        count: 0,
        count1: 0,
        total_eth: 0,
        total_usd: 0,
        volume_eth: 0,
        volume_usd: 0
      },
      donationCurrency: "",
      loadingWallet: false,
      redirecting: false,
      loadingCharts: true
    };
  },
  components: {
    Liquiditylinechart,
    Volumelinechart,
    Tokenlinechart,
    Swap,
    Send,
    Noaccount,
    Loading,
    Donation
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getBalance: "account/getBalance",
      getOwnedTokenList: "account/getOwnedTokenList",
      getPrice: "account/getPrice",
      getAvailableTokenList: "account/getAvailableTokenList",
      getActiveToken: "getActiveToken",
      getTokenList: "account/getTokenList",
      getTotalValue: "account/getTotalValue",
      getActiveTab: "getActiveTab",
      getConnection: "getConnection",
      getSignIn: "getSignIn"
    }),
    tokenList: function() {
      return [];
    },
    isValid: function() {
      return true;
    },
    availableInputTokens: function() {
      let self = this;
      let list = this.getTokenList
        .map(symbol => {
          let token = self.getAvailableTokenList.find(t => t.symbol === symbol);
          if (token)
            return {
              title: symbol,
              balance: self.getBalance[symbol],
              priceInUsd: self.getPrice[symbol],
              src: token ? token.logo : null
            };
          else return null;
        })
        .filter(t => t !== null)
        .sort((a, b) => b.priceInUsd - a.priceInUsd);
      list.unshift({ title: "ETH", src: null });
      return list;
    },
    isLoadingWallet: function() {
      if (this.getSignIn && this.getOwnedTokenList.length === 0) return true;
      else return false;
    }
  },
  methods: {
    ...mapActions({
      updatePrice: "account/updatePrice",
      updateSummary: "updateSummary",
      updateActiveToken: "updateActiveToken",
      updateCurrentView: "updateCurrentView",
      updateChartInfo: "updateChartInfo",
      updateActiveTokenAddress: "updateActiveTokenAddress",
      updateActiveTab: "updateActiveTab"
    }),
    onSelectDonationCurrency(value) {
      if (!value) return;
      this.donationCurrency = value.title;
    },
    closeDonationModal() {
      this.hideModal("donate_modal");
    },
    redirect(url) {
      this.$router.push(url);
    },
    showModal(ref) {
      if (this.$refs[ref]) this.$refs[ref].show();
    },
    hideModal(ref) {
      if (this.$refs[ref]) this.$refs[ref].hide();
    },
    calculateBalance: function(balance) {
      if (!balance) return 0.0;
      return balance.toFixed(4);
    },
    wait(ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, ms);
      });
    },
    async getSummaryFromServer() {
      console.log("REFRESHING SUMMARY INFO");
      try {
        let response = await axios.get(`${config.uniswapDexServer}api/summary`);
        this.summary = response.data.result;
        await this.updateSummary(this.summary);
      } catch (e) {
        console.warn("Unable to refresh summary info!");
      }
    },
    numberWithCommas(x) {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    },
    async updateMarketInfo(force = false) {
      if (this.getActiveTab === "market" || force === true) {
        let data = {};
        let res = await axios.get(`${config.uniswapDexServer}api/marketdata`);
        if (res.data.result) {
          let ethToUsd = await getETHToUSDPrice();
          data.count = res.data.result.count;
          data.count1 = res.data.result.count1;
          let liquidityResponse = await axios.get(
            `${config.uniswapDexServer}api/histodaymarket?start=${Date.now() -
              1000 * 60 * 60 * 24 * 3}`
          );
          let todayLiquidity = R.last(liquidityResponse.data.result);
          if (todayLiquidity) {
            data.total_usd = todayLiquidity.close * ethToUsd;
            data.total_eth = todayLiquidity.close;
          }
          let volumeResponse = await axios.get(
            `${config.uniswapDexServer}api/histodayvolume?start=${Date.now() -
              1000 * 60 * 60 * 24 * 3}`
          );
          console.log(
            `${config.uniswapDexServer}api/histodayvolume?start=${Date.now() -
              1000 * 60 * 60 * 24 * 3}`
          );
          const volumeFromUniswapDEX = volumeResponse.data.volumeFromUniswapDEX;
          let todayVolume = R.last(volumeResponse.data.result);
          if (todayVolume) {
            data.volume_eth = todayVolume.amount_eth;
            data.volume_usd =
              todayVolume.amount_eth * todayVolume.price_eth_usd;
            data.volume_uniswapdex =
              (volumeFromUniswapDEX * 100) / todayVolume.amount_eth;
            this.market = data;
          }
        }
      }
    },
    onSubmitDonation() {}
  },
  mounted: async function() {
    let self = this;
    self.updateMarketInfo(true);
    if (self.getConnection) {
      await self.getSummaryFromServer();
      await self.updateSummary(self.summary);
    }
    let redirectTokenAddress = self.$route.query.token;
    if (redirectTokenAddress) {
      self.redirecting = true;
      setTimeout(() => {
        try {
          let token = self.getAvailableTokenList.find(
            t =>
              t.tokenAddress.toLowerCase() ===
              redirectTokenAddress.toLowerCase()
          );
          self.updateActiveToken(token.symbol);
          self.updateActiveTokenAddress(token.tokenAddress || "");
          self.updateActiveTab("exchange");
          self.updateCurrentView("tokeninfo");
          self.updateChartInfo({
            currency: "USD",
            showChart: true,
            tokenAddress: redirectTokenAddress,
            tokenName: token.symbol
          });
          self.redirecting = false;
        } catch (e) {
          console.log(e);
          alert("Invalid Token Address !");
          self.redirecting = false;
        }
      }, 1500);
    }
    setInterval(self.updateMarketInfo, 60000);
    setTimeout(() => {
      self.loadingCharts = false;
    }, 4000);
  }
};
</script>

<style>
.market-info-table {
  height: 220px;
  width: 50%;
  max-width: 700px;
  min-width: 300px;
  font-size: 15px;
  margin: 60px auto;
  margin-bottom: 70px;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0px 2px 2px #ccc;
}
.market-info-table .row {
  height: 45px;
}
.market-info-table .row .value {
  font-weight: bold;
  text-align: right;
}
.market-info-table .row .description {
  text-align: left;
}
.loading-icon {
  margin-top: 50px;
}
.market-info-table .row.volume-usd .value,
.market-info-table .row.total-usd .value {
  font-size: 13px;
  font-weight: normal;
}

.market-info-table .row.volume-eth,
.market-info-table .row.volume-usd,
.market-info-table .row.total-eth {
  height: 25px;
}
.row.volume-uniswap-percent {
  height: 35px;
  font-weight: normal;
  font-size: 13px;
}

.market-info-table .row.count {
  height: 25px;
  margin-bottom: 0px;
}
.market-info-table .row.count-all .value {
  height: 10px;
  font-size: 13px;
  font-weight: normal;
}
.market-info-table .row.count-all {
  height: 33px;
}
.built-by-message {
  text-align: center;
  font-size: 13px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.built-by-message p {
  padding-top: 10px;
  margin-left: 10px;
}
.built-by-message a {
  color: #ed1b24 !important;
  text-decoration: none;
  font-weight: bold;
}
.built-by-message a:hover {
  color: #a41de4;
  text-decoration: none;
}
#donation-info > p {
  width: 90%;
  max-width: 600px;
  font-size: 13px;
  text-align: center;
  margin: 10px auto;
  line-height: 1.5;
}
#donate-button {
  width: 160px;
  height: 40px;
  margin: 20px auto;
}

#token_info_modal,
#donate_modal {
  position: fixed;
  top: 0px;
}
#token_info_modal .modal-header,
#donate_modal .modal-header {
  border-radius: 0px !important;
  border: none;
  position: fixed;
  top: 0px;
  z-index: 666;
}

#token_info_modal .token-info-section {
  height: auto;
  width: 100%;
  padding-top: 0px;
  overflow: hidden;
}
#token_info_modal,
#donate_modal {
  position: fixed;
  top: 0px;
  width: 100%;
  height: 100vh;
  max-width: 100%;
  padding: 0;
  z-index: 2000;
}
#token_info_modal .modal-dialog,
#donate_modal .modal-dialog {
  width: 100%;
  margin: 0 auto;
}
#token_info_modal .modal-body,
#donate_modal .modal-body {
  padding: 0;
  background: #eceeef;
  position: relative;
  top: 70px;
  z-index: 500;
}

#token_info_modal .modal-dialog,
#token-info-modal .modal-content,
#donate_modal .modal-dialog,
#donate_modal .modal-content {
  background-color: #eceeef;
  height: 100vh;
  width: 100vw;
  max-width: 100vw !important;
  margin: 0px;
  padding: 0;
  border-radius: 0px;
}
#donate_modal .modal-dialog,
#donate_modal .modal-content {
  /* overflow: hidden; */
  overflow-y: scroll;
  overflow-x: hidden;
}
#token_info_modal___BV_modal_content_ {
  border: none;
}
#token-info-modal .modal-header .title,
#donate_modal .modal-header .title {
  text-align: center;
  flex-grow: 3;
  padding-left: 20px;
  display: flex;
  justify-content: center;
}
#token-info-modal .modal-header a,
#donate_modal .modal-header a {
  padding-top: 10px;
}
.select-donation-currency {
  padding-top: 20px;
  width: 90%;
  max-width: 700px;
  margin: 0 auto;
}
.select-donation-currency label {
  text-align: left;
  width: 100%;
}
.uniswap-percent-value {
  font-weight: normal !important;
}
@media screen and (max-width: 500px) {
  .select-donation-currency label {
    font-size: 11px;
  }
  .market-info-table {
    height: 220px;
    width: 50%;
    max-width: 700px;
    min-width: 300px;
    font-size: 13px;
    margin: 30px auto;
    margin-bottom: 20px;
    padding: 20px;
  }
}
</style>
