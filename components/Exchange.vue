<template>
  <section id="exchange-container">
    <h4 id="main-title">Uniswap Decentralized Exchange</h4>
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
      <div class="show-low-liquidity">
        <b-form-checkbox
          v-model="showLowLiquidityToken"
          name="check-button"
          switch
        >Show tokens with liquidity less than 1 ETH</b-form-checkbox>
      </div>
      <div class="exchangelist-title">
        <div class="title-order">No</div>
        <div class="title-name" @click="changeOrder(`name`)">
          Name
          <font-awesome-icon
            v-if="orderBy[0] === 'name' && orderBy[1] === 'asc'"
            icon="long-arrow-alt-right"
            size="xs"
          />
          <font-awesome-icon
            v-if="orderBy[0] === 'name' && orderBy[1] === 'desc'"
            icon="long-arrow-alt-left"
            size="xs"
          />
        </div>
        <div class="title-price" @click="changeOrder(`price`)">
          Price
          <font-awesome-icon
            v-if="orderBy[0] === 'price' && orderBy[1] === 'desc'"
            icon="long-arrow-alt-right"
            size="xs"
          />
          <font-awesome-icon
            v-if="orderBy[0] === 'price' && orderBy[1] === 'asc'"
            icon="long-arrow-alt-left"
            size="xs"
          />
        </div>
        <div class="title-price" @click="changeOrder(`change`)">
          24H Change
          <font-awesome-icon
            v-if="orderBy[0] === 'change' && orderBy[1] === 'desc'"
            icon="long-arrow-alt-right"
            size="xs"
          />
          <font-awesome-icon
            v-if="orderBy[0] === 'change' && orderBy[1] === 'asc'"
            icon="long-arrow-alt-left"
            size="xs"
          />
        </div>

        <div class="title-volume" @click="changeOrder(`volume`)">
          24H Volume
          <font-awesome-icon
            v-if="orderBy[0] === 'volume' && orderBy[1] === 'desc'"
            icon="long-arrow-alt-right"
            size="xs"
          />
          <font-awesome-icon
            v-if="orderBy[0] === 'volume' && orderBy[1] === 'asc'"
            icon="long-arrow-alt-left"
            size="xs"
          />
        </div>
        <div class="title-liquidity" @click="changeOrder(`liquidity`)">
          Liquidity Depth
          <font-awesome-icon
            v-if="orderBy[0] === 'liquidity' && orderBy[1] === 'desc'"
            icon="long-arrow-alt-right"
            size="xs"
          />
          <font-awesome-icon
            v-if="orderBy[0] === 'liquidity' && orderBy[1] === 'asc'"
            icon="long-arrow-alt-left"
            size="xs"
          />
        </div>
      </div>
      <b-card style="border-top: 0px; background: red">
        <b-list-group flush>
          <b-list-group-item v-for="token in tokenList" :key="token.tokenAddress">
            <div class="token" @click="onSelectToken(token.name)">
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
                <p class="token-price-usd">${{ numberWithCommas(token.price.toFixed(2)) }}</p>
              </div>
              <div class="token-price-container">
                <p
                  v-if="token.change > 0"
                  class="token-price-usd positive-change"
                >+{{ (token.change * 100).toFixed(2) }}%</p>
                <p
                  v-if="token.change < 0"
                  class="token-price-usd negative-change"
                >-{{ (Math.abs(token.change) * 100).toFixed(2) }}%</p>
                <p v-if="token.change == 0" class="token-price-usd zero-change">0.00%</p>
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
        <b-button
          variant="outline-primary"
          id="add-token-button"
          @click="loadMoreToken"
        >Load More Tokens</b-button>
      </b-card>
    </div>

    <b-button id="listToken" variant="primary" @click="showListToken">+ List ERC-20 Token</b-button>

    <!-- LIST TOKEN MODAL -->
    <b-modal
      ref="list_token_modal"
      id="list_token_modal"
      title="List A Token"
      :hide-footer="true"
      @hidden="onHideModal"
    >
      <b-form @submit="onListToken">
        <b-alert v-if="errorMessage.length > 0" show fade variant="danger">{{errorMessage}}</b-alert>
        <b-alert v-if="infoMessage.length > 0" show fade variant="info">{{infoMessage}}</b-alert>
        <b-form-group id="exampleInputGroup1">
          <label>Token Address</label>
          <b-form-input type="text" v-model="form.tokenAddress"/>
        </b-form-group>
        <b-button type="submit" variant="primary" :disabled="loading">List Token</b-button>
      </b-form>
    </b-modal>

    <!-- Success Modal -->
    <b-modal
      ref="success_modal_ref"
      id="success_modal"
      title="Transaction Submitted"
      :hide-footer="true"
      @hide="redirect"
    >
      <p>Your transaction is successfully submitted to Ethereum Network. Click link below to view your transaction on etherscan.io</p>
      <a
        id="txUrl"
        target="_blank"
        rel="noopener noreferrer"
        :href="`https://etherscan.io/tx/${txHash}`"
      >View tx on etherscan.io</a>
    </b-modal>
  </section>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import * as R from "ramda";
import Token from "~/components/Token.vue";
import { mapActions, mapGetters } from "vuex";
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
  metamaskCreateNewExchange
} from "../assets/js/utils";
import {
  factoryAddress,
  tokenAddresses,
  exchangeAddresses
} from "../assets/js/token";
import { setTimeout } from "timers";
import config from "../config";
export default {
  components: { Token },
  data: function() {
    return {
      form: {
        query: "",
        tokenAddress: ""
      },
      summary: [],
      showLimit: 20,
      orderBy: ["liquidity", "desc"],
      ethToUsd: 0,
      errorMessage: "",
      infoMessage: "",
      txHash: "",
      loading: false,
      showLowLiquidityToken: false
    };
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getBalance: "account/getBalance",
      getPrice: "account/getPrice",
      getRefresher: "account/getRefresher",
      getWeb3: "getWeb3",
      getSignIn: "getSignIn",
      getTransactionListToken: "transaction/getTransactionListToken",
      getTokenTransactionListToken: "transaction/getTokenTransactionListToken",
      getCredentials: "getCredentials",
      getTokenList: "account/getTokenList",
      getAvailableTokenList: "account/getAvailableTokenList"
    }),
    tokenList: function() {
      let self = this;
      let ethToUsd = this.ethToUsd;
      let unsortedList = this.getAvailableTokenList
        .map(token => {
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
        })
        .filter(token => {
          if (this.showLowLiquidityToken) {
            return true;
          } else {
            return token.liquidity / ethToUsd > 1;
          }
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
      let orderyProperty = this.orderBy[0] || "Liquidity";
      let orderDir = this.orderBy[1] || "desc";
      let sortedList;

      if (orderyProperty === "name" && orderDir === "asc") {
        sortedList = filteredList.sort(function(a, b) {
          var textA = a.name.toUpperCase();
          var textB = b.name.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
      } else if (orderyProperty === "name" && orderDir === "desc") {
        sortedList = filteredList.sort(function(a, b) {
          var textA = a.name.toUpperCase();
          var textB = b.name.toUpperCase();
          return textB < textA ? -1 : textB > textA ? 1 : 0;
        });
      } else if (orderyProperty === "change") {
        sortedList = filteredList.sort((a, b) => {
          let y = parseFloat(b["change"]);
          let x = parseFloat(a["change"]);
          if (orderDir === "desc") return y - x;
          else if (orderDir === "asc") return x - y;
        });
      } else {
        sortedList = filteredList.sort((a, b) => {
          let y = b[orderyProperty.toLowerCase()];
          let x = a[orderyProperty.toLowerCase()];
          if (orderDir === "desc") return y - x;
          else if (orderDir === "asc") return x - y;
        });
      }
      return sortedList.slice(0, this.showLimit);
    }
  },
  methods: {
    ...mapActions({
      updateAuthRedirectUrl: "updateAuthRedirectUrl",
      updateActiveTab: "updateActiveTab",
      updateActiveToken: "updateActiveToken",
      addAccount: "account/addAccount",
      addToken: "account/addToken",
      setRefresher: "account/setRefresher",
      setAvailableTokenList: "account/setAvailableTokenList",
      updateBalance: "account/updateBalance",
      updateTransactionListToken: "transaction/updateTransactionListToken",
      updateTokenTransactionListToken:
        "transaction/updateTokenTransactionListToken"
    }),
    numberWithCommas(x) {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    },
    changeOrder(property, dir) {
      let currentOrderProperty = this.orderBy[0];
      let currentOrderDir = this.orderBy[1];
      console.log(currentOrderProperty, currentOrderDir);
      let newDir = "desc";
      if (property === currentOrderProperty) {
        if (currentOrderDir === "asc") newDir = "desc";
        else if (currentOrderDir === "desc") newDir = "asc";
      }
      this.orderBy = [property, newDir];
      console.log(this.orderBy);
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
    onHideModal() {
      this.form.tokenAddress = "";
      this.errorMessage = "";
      this.infoMessage = "";
    },
    async updateUSDPrices() {
      let ultUSD = await getULTToUSDPrice();
      this.ultInUSD = parseFloat(this.getBalance["ULT"] * ultUSD);
    },
    loadMoreToken() {
      this.showLimit += 20;
    },
    showListToken() {
      this.showModal("list_token_modal");
    },
    async onListToken(e) {
      e.preventDefault();
      this.loading = true;
      if (!this.getSignIn) {
        this.resetMessages();
        this.errorMessage = `Please sign into wallet to create a new exchange`;
        this.form.tokenAddress = "";
        this.loading = false;
        return;
      }
      let tokenAddress = this.form.tokenAddress.toLowerCase();
      let exchangeAddress = await getExchangeAddress(tokenAddress);
      console.log(`Exchange address: ${exchangeAddress}`);
      if (!exchangeAddress) {
        this.resetMessages();
        this.errorMessage = `Invalid Token Address. Failed to calculate exchange address from provided token address!`;
        this.form.tokenAddress = "";
        this.loading = false;
        return;
      }
      try {
        if (
          exchangeAddress &&
          exchangeAddress !== "0x0000000000000000000000000000000000000000"
        ) {
          console.log("Exchange address already existed for selected token");
          this.resetMessages();
          this.errorMessage = `Exchange address (${exchangeAddress}) already existed for selected token address.`;
          this.form.tokenAddress = "";
          this.loading = false;
        } else if (
          exchangeAddress === "0x0000000000000000000000000000000000000000"
        ) {
          let accountType = this.getAccount.type;
          if (accountType === "metamask") {
            this.resetMessages();
            this.infoMessage =
              "Please confirm your transaction on Metamask Wallet.";
            this.txHash = await metamaskCreateNewExchange(
              {
                from: this.getAccount.address
              },
              tokenAddress
            );
          } else {
            this.txHash = await createNewExchange(
              {
                from: this.getAccount.address
              },
              tokenAddress,
              this.getAccount.privateKey,
              this.web3
            );
          }
          this.form.tokenAddress = "";
          this.loading = false;
          if (this.txHash) {
            this.hideModal("list_token_modal");
            this.showModal("success_modal_ref");
          }
        } else {
          this.loading = false;
          console.log("Invalid token address");
          this.resetMessages();
          this.errorMessage = "Invalid Token Address";
          return;
        }
      } catch (e) {
        this.loading = false;
        this.resetMessages();
        this.errorMessage = `Unexpected error while trying to create exchange!`;
        console.log(e);
      }
    },
    resetMessages() {
      this.infoMessage = "";
      this.errorMessage = "";
    },
    onSelectToken(name) {
      // if (this.getSignIn) {
      //   this.updateActiveToken(name);
      //   this.redirect("/tokendetail");
      // }
      this.updateAuthRedirectUrl({
        url: "/tokendetail",
        token: name
      });
      this.updateActiveToken(name);
      this.redirect("/tokendetail");
      this.updateActiveTab("exchange");
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
    this.web3 = await getWeb3();
    this.web3Metamask = await getWeb3Metamask();
  },
  mounted: async function() {}
};
</script>

<style>
#exchange-container {
  min-height: 100vh;
  width: 95%;
  max-width: 650px;
  margin: 40px auto;
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
  left: -8px;
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
  transition: 0.5s;
}
.exchangelist-section .token:hover {
  cursor: pointer;
  box-shadow: 0px 2px 5px #bcc0c1;
  transform: scale(1.03);
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

#list_token_modal,
#success_modal {
  position: fixed;
  top: 150px;
}
#list_token_modal .alert {
  font-size: 0.9rem;
  line-height: 1.5;
  max-width: 100% !important;
  text-align: left;
}
#list_token_modal button[type="submit"] {
  width: 100%;
}
#listToken {
  width: 100%;
  font-weight: bolder;
}
.exchangelist-title div svg {
  transform: rotateZ(90deg);
}
#main-title {
  font-weight: normal;
  font-size: 1.5rem;
  margin: 30px auto;
  color: #434d6f;
  text-transform: uppercase;
}
.show-low-liquidity {
  margin-bottom: 20px;
  text-align: left;
  font-weight: normal;
}
.show-low-liquidity label {
  font-weight: normal;
  font-size: 12px;
  padding-top: 5px;
}
</style>
