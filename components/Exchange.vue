<template>
  <section id="exchange-container">
    <h4>Uniswap Exchange</h4>
    <b-form>
      <b-form-group>
        <b-form-input
          id="search-token-field"
          v-model="form.query"
          type="text"
          placeholder="Search an ERC-20 Token"
        ></b-form-input>
      </b-form-group>
    </b-form>

    <div class="exchangelist-section">
      <div class="exchange-list-order">
        <div class="order-by">Order By</div>
        <div class="ordery-choice">
          <b-dropdown id="dropdown-right" right :text="orderBy" variant="outline-primary">
            <b-dropdown-item href="#" @click="changeOrder('Liquidity')">Liquidity</b-dropdown-item>
            <!-- <b-dropdown-item href="#" @click="changeOrder('Price')">Price</b-dropdown-item> -->
            <b-dropdown-item href="#" @click="changeOrder('Volume')">24H Volume</b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
      <div class="exchangelist-title">
        <div class="title-order">No</div>
        <div class="title-name">Name</div>
        <div class="title-price">24H Change</div>
        <div class="title-price">Price</div>
        <div class="title-volume">24H Volume</div>
        <div class="title-liquidity">Liquidity Depth</div>
      </div>
      <b-card style="border-top: 0px; background: red">
        <b-list-group flush>
          <b-list-group-item v-for="token in tokenList" :key="token.tokenAddress">
            <div class="token">
              <div class="token-order-container">
                <p class="token-order">{{ token.order }}.</p>
              </div>
              <div class="token-name">
                <img v-if="token.name === 'ULT'" src="../assets/logo.svg" alt>
                <img v-else-if="token.name === 'ETH'" src="../assets/eth-logo.png" alt>
                <img v-else-if="token.src" :src="token.src" alt>
                <img v-else src="../assets/default-token.png">
                <p>{{token.name}}</p>
              </div>
              <div class="token-price-container">
                <p
                  v-if="token.change > 0"
                  class="token-price-usd positive-change"
                >+{{ (token.change * 1000).toFixed(2) }}%</p>
                <p
                  v-if="token.change < 0"
                  class="token-price-usd negative-change"
                >-{{ (Math.abs(token.change) * 1000).toFixed(2) }}%</p>
                <p v-if="token.change == 0" class="token-price-usd zero-change">0.00%</p>
              </div>
              <div class="token-price-container">
                <p class="token-price-usd">${{ numberWithCommas(token.price.toFixed(2)) }}</p>
              </div>
              <div class="token-volume-container">
                <p class="token-volume">${{ numberWithCommas(token.volume.toFixed(0)) }}</p>
              </div>
              <div class="token-liquidity-container">
                <p class="token-liquidity-usd">${{ numberWithCommas(token.liquidity.toFixed(0)) }}</p>
              </div>
            </div>
          </b-list-group-item>
        </b-list-group>
        <b-button variant="primary" id="add-token-button" @click="loadMoreToken">Load More Tokens</b-button>
      </b-card>
    </div>
  </section>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import Token from "~/components/Token.vue";
import { mapActions, mapGetters } from "vuex";
import {
  getWeb3,
  getBalance,
  getTokenBalance,
  getAllListedToken,
  getETHToUSDPrice
} from "../assets/js/utils";
import { setTimeout } from "timers";
import config from "../config";

export default {
  components: { Token },
  data: function() {
    return {
      form: {
        query: ""
      },
      summary: [],
      showLimit: 20,
      orderBy: "Liquidity",
      ethToUsd: 0
    };
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getBalance: "account/getBalance",
      getPrice: "account/getPrice",
      getWeb3: "getWeb3",
      getSignIn: "getSignIn",
      getTransactionList: "transaction/getTransactionList",
      getTokenTransactionList: "transaction/getTokenTransactionList",
      getCredentials: "getCredentials",
      getTokenList: "account/getTokenList",
      getAvailableTokenList: "account/getAvailableTokenList"
    }),
    tokenList: function() {
      let self = this;
      let ethToUsd = this.ethToUsd;
      let unsortedList = this.getAvailableTokenList.map(token => {
        let summaryInfo = self.summary.find(s => s.token_id === token.id);
        if (!summaryInfo)
          return {
            name: token.symbol,
            liquidity: 0,
            volume: 0,
            price: 0,
            src: token.logo,
            order: "-",
            change: 0
          };
        return {
          name: token.symbol,
          tokenAddress: token.tokenAddress,
          liquidity: summaryInfo.liquidity * ethToUsd,
          volume: summaryInfo.volume_eth_1D * ethToUsd,
          price: summaryInfo.price_last_1H * ethToUsd,
          src: token.logo,
          order: summaryInfo.order || "-",
          change: summaryInfo.price_change_24h || 0
        };
      });
      let symbol;
      let filteredList;
      if (!this.form.query) {
        filteredList = unsortedList;
      } else {
        let searchKeyword = this.form.query.trim().toLowerCase();
        filteredList = unsortedList.filter(function(token) {
          if (token.name.toLowerCase().indexOf(searchKeyword) !== -1) {
            return true;
          }
        });
      }
      let sortedList = filteredList.sort(
        (a, b) => b[self.orderBy.toLowerCase()] - a[self.orderBy.toLowerCase()]
      );
      return sortedList.slice(0, this.showLimit);
    }
  },
  methods: {
    ...mapActions({
      addAccount: "account/addAccount",
      addToken: "account/addToken",
      setAvailableTokenList: "account/setAvailableTokenList",
      updateBalance: "account/updateBalance",
      updateTransactionList: "transaction/updateTransactionList",
      updateTokenTransactionList: "transaction/updateTokenTransactionList"
    }),
    numberWithCommas(x) {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    },
    changeOrder(property) {
      this.orderBy = property;
    },
    redirect(url) {
      this.$router.push(url);
    },
    showModal(ref) {
      if (this.$refs[ref]) this.$refs[ref].show();
    },
    async updateUSDPrices() {
      let ultUSD = await getULTToUSDPrice();
      this.ultInUSD = parseFloat(this.getBalance["ULT"] * ultUSD);
    },
    loadMoreToken() {
      this.showLimit += 20;
    }
  },
  created: async function() {
    let response = await axios.get(`${config.uniswapDexServer}api/summary`);
    this.summary = response.data.result;
    let ethPrice = this.getPrice["ETH"];
    if (!ethPrice) {
      ethPrice = await getETHToUSDPrice();
    }
    this.ethToUsd = ethPrice;
  },
  mounted: async function() {}
};
</script>

<style>
#exchange-container {
  min-height: 100vh;
  width: 95%;
  max-width: 650px;
  margin: 70px auto;
}
.main-tab > .card > .tabs .card-body {
  /* padding: 5px; */
}

.exchangelist-title {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  font-size: 12px;
  font-weight: bolder;
  background: #dfdfe0;
  margin-bottom: 5px;
  cursor: pointer;
}
.exchange-list-order {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 10px 10px;
  padding-right: 0px;
}
.exchange-list-order .dropdown-item {
  font-size: 12px;
}
.exchange-list-order .order-by {
  padding-top: 5px;
}
.exchange-list-order .btn.btn-outline-primary.dropdown-toggle {
  font-size: 12px;
  /* padding: 0; */
}

.exchangelist-title > div:hover {
  background: #dfdfe0;
  color: #4d609e;
}

.exchangelist-title .title-volume {
  left: 10px;
  position: relative;
}
.exchangelist-title .title-price {
  left: -20px;
  position: relative;
}

.exchangelist-section .card-body {
  padding: 0px;
}

#search-token-field {
  margin: 15px auto;
}

.exchangelist-section .token {
  display: flex;
  justify-content: space-around;
  background: #fff;
  color: #333;
  padding-top: 10px;
}
.exchangelist-section .token .token-name {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
}
.exchangelist-section .token .token-liquidity-usd,
.exchangelist-section .token .token-price-usd,
.exchangelist-section .token .token-order,
.exchangelist-section .token .token-volume {
  font-size: 12px;
  margin: 0;
  text-align: left;
  height: 100%;
  padding-top: 20px;
}
.exchangelist-section .token .token-name,
.exchangelist-section .token .token-liquidity-usd,
.exchangelist-section .token .token-price-usd,
.exchangelist-section .token .token-volume {
  width: 85px;
}
.exchangelist-section .token .token-name {
  width: 65px;
}
.exchangelist-section .token .token-order {
  /* width: 60px; */
  /* padding: 20px 20px; */
  text-align: center;
}
.token-name img {
  width: 30px;
}
.tokenlist-section a {
  text-decoration: none !important;
}
.token-amount-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.exchangelist-section .list-group-flush .list-group-item {
  border-right: 0;
  border-left: 0;
  border-radius: 0;
  margin-bottom: 5px;
  padding: 0px 0px;
  padding-top: 2px;
}
.exchangelist-section .list-group-flush .list-group-item token > div {
  padding-top: 10px;
}

.token-price-usd {
  color: #2752e4;
  font-weight: bolder;
}

.positive-change {
  color: green;
  font-weight: 400;
}
.negative-change {
  color: red;
  font-weight: 400;
}
.zero-change {
  color: #666;
  font-weight: 400;
}
</style>
