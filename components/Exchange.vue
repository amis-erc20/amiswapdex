<template>
  <section id="exchange-container">
    <Loading v-if="redirecting" message="Redirecting" />
    <b-form>
      <b-form-group>
        <div class="search-field-container">
          <b-form-input
            type="text"
            id="search-token-field"
            v-model="form.query"
            required
            placeholder="Search an ERC-20 Token"
          />
          <button type="button" id="erase" @click="form.query = ''">X</button>
        </div>
      </b-form-group>
    </b-form>
    <div v-if="tokenList.length == 0 && form.query.length == 0">
      <b-spinner style="width: 2rem; height: 2rem;" label="Loading"></b-spinner>
    </div>
    <div v-if="tokenList.length == 0 && form.query.length > 0">
      <b-alert show variant="danger">
        Token
        <strong>{{form.query}}</strong>
        is not listed on Uniswap Exchange or liquidiy is less than 1 ETH for
        <strong>{{form.query}}</strong> exchange contract.
      </b-alert>
    </div>
    <div v-if="tokenList" class="exchangelist-section">
      <div class="show-low-liquidity">
        <b-form-checkbox
          v-model="hideLowLiquidityToken"
          name="check-button"
          switch
        >Hide tokens with liquidity less than 1 ETH</b-form-checkbox>
      </div>
      <div class="exchangelist-title-container" ref="exchangelist-title-container">
        <div v-if="tokenList.length > 0" class="exchangelist-title">
          <div class="title-order">No</div>
          <div class="title-name" @click="changeOrder(`name`)">
            Name
            <font-awesome-icon
              v-if="orderBy[0] === 'name' && orderBy[1] === 'asc'"
              icon="long-arrow-alt-right"
              size="1x"
            />
            <font-awesome-icon
              v-if="orderBy[0] === 'name' && orderBy[1] === 'desc'"
              icon="long-arrow-alt-left"
              size="1x"
            />
          </div>
          <div class="title-price" @click="changeOrder(`price`)">
            Price
            <font-awesome-icon
              v-if="orderBy[0] === 'price' && orderBy[1] === 'desc'"
              icon="long-arrow-alt-right"
              size="1x"
            />
            <font-awesome-icon
              v-if="orderBy[0] === 'price' && orderBy[1] === 'asc'"
              icon="long-arrow-alt-left"
              size="1x"
            />
          </div>
          <!-- <div class="title-price" @click="changeOrder(`change`)" v-if="$mq !== 'mobile'"> -->
          <div class="title-price" @click="changeOrder(`change`)">
            24H Change
            <font-awesome-icon
              v-if="orderBy[0] === 'change' && orderBy[1] === 'desc'"
              icon="long-arrow-alt-right"
              size="1x"
            />
            <font-awesome-icon
              v-if="orderBy[0] === 'change' && orderBy[1] === 'asc'"
              icon="long-arrow-alt-left"
              size="1x"
            />
          </div>

          <!-- <div class="title-volume" @click="changeOrder(`volume`)" v-if="$mq !== 'mobile'"> -->
          <div class="title-volume" @click="changeOrder(`volume`)">
            24H Volume
            <font-awesome-icon
              v-if="orderBy[0] === 'volume' && orderBy[1] === 'desc'"
              icon="long-arrow-alt-right"
              size="1x"
            />
            <font-awesome-icon
              v-if="orderBy[0] === 'volume' && orderBy[1] === 'asc'"
              icon="long-arrow-alt-left"
              size="1x"
            />
          </div>
          <!-- <div class="title-roir" @click="changeOrder(`roir`)" v-if="$mq !== 'mobile'"> -->
          <div class="title-roir" @click="changeOrder(`roir`)">
            ROIR
            <b-button ref="roir-explain-btn" id="roir-explain-btn" variant="outline-success">?</b-button>
            <b-tooltip target="#roir-explain-btn" placement="top" triggers="hover focus">
              <div
                class="roir-exlplain-text"
              >Return On Investment Rank (ROIR) is approximately the Annual Percentage Rate of return for liquidity providers based only on the 0.3% fee. It is calculated as the average of the 24 hour trading volume over the last 7 days divided by the current liquidity and multiplied by 100 to show as a percent.</div>
            </b-tooltip>
            <font-awesome-icon
              v-if="orderBy[0] === 'roir' && orderBy[1] === 'desc'"
              icon="long-arrow-alt-right"
              size="1x"
            />
            <font-awesome-icon
              v-if="orderBy[0] === 'roir' && orderBy[1] === 'asc'"
              icon="long-arrow-alt-left"
              size="1x"
            />
          </div>
          <div class="title-roir" @click="changeOrder(`liquidity`)">
            Liquidity
            <font-awesome-icon
              v-if="orderBy[0] === 'liquidity' && orderBy[1] === 'desc'"
              icon="long-arrow-alt-right"
              size="1x"
            />
            <font-awesome-icon
              v-if="orderBy[0] === 'liquidity' && orderBy[1] === 'asc'"
              icon="long-arrow-alt-left"
              size="1x"
            />
          </div>
          <div class="title-action">Action</div>
        </div>
      </div>
      <b-card style="border-top: 0px; background: red">
        <b-list-group flush class="exchange-token-list" v-on:scroll.passive="onScroll">
          <b-list-group-item v-for="token in tokenList" :key="token.name + token.tokenAddress">
            <div class="token" @click="onSelectToken(token.name, token.tokenAddress)">
              <div class="token-order-container">
                <p class="token-order">{{ token.order }}.</p>
              </div>
              <div class="token-name">
                <img v-if="token.name === 'ULT'" src="../assets/logo.svg" alt />
                <img v-else-if="token.name === 'ETH'" src="../assets/eth-logo.png" alt />
                <img v-else-if="token.src" :src="token.src" alt />
                <img v-else src="../assets/default-token.png" />
                <div>
                  <p class="exchange-token-symbol">{{token.name}}</p>
                  <p class="exchange-token-fullname">{{token.fullname}}</p>
                  <!-- <p class="exchange-token-fullname">{{token.tokenAddress}}</p> -->
                </div>
              </div>
              <div class="token-price-container">
                <p
                  v-if="token.price < 1"
                  class="token-price-usd"
                >${{ numberWithCommas(token.price.toFixed(4)) }}</p>
                <p v-else class="token-price-usd">${{ numberWithCommas(token.price.toFixed(2)) }}</p>
              </div>
              <!-- <div class="token-price-container" v-if="$mq !== 'mobile'"> -->
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

              <!-- <div class="token-volume-container" v-if="$mq !== 'mobile'"> -->
              <div class="token-volume-container">
                <p class="token-volume">${{ numberWithCommas(token.volume.toFixed(0)) }}</p>
              </div>
              <!-- <div class="token-volume-container" v-if="$mq !== 'mobile'"> -->
              <div class="token-volume-container">
                <p class="token-volume">{{ numberWithCommas(token.roir.toFixed(2)) }}%</p>
              </div>
              <div class="token-liquidity-container">
                <p class="token-liquidity-usd">${{ numberWithCommas(token.liquidity.toFixed(0)) }}</p>
              </div>
              <div class="swap-button-container">
                <b-button
                  class="swap-button-exchange-list"
                  variant="outline-primary"
                  @click.stop="onSelectToken(token.name, token.tokenAddress, true)"
                >
                  <font-awesome-icon icon="exchange-alt" size="1x" />Swap
                </b-button>
              </div>
            </div>
          </b-list-group-item>
        </b-list-group>
      </b-card>
    </div>

    <b-button
      variant="outline-primary"
      id="add-token-button"
      @click="loadMoreToken"
    >Load More Tokens</b-button>
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
        <b-alert v-if="errorMessage.length > 0" show fade variant="danger" v-html="errorMessage"></b-alert>
        <!-- <b-alert v-if="errorMessage.length > 0" show fade variant="danger" v-html="errorMessage" >{{errorMessage}}</b-alert> -->
        <b-alert v-if="infoMessage.length > 0" show fade variant="info">{{infoMessage}}</b-alert>
        <b-form-group id="exampleInputGroup1">
          <label>Select Your Token</label>
          <v-select
            :options="listabeTokenList"
            label="title"
            placeholder="Please select a token"
            v-model="form.selectedTokenToList"
            @input="onSelectTokenToList"
            :clearable="false"
          >
            <template slot="option" slot-scope="option">
              <img v-if="option.src" :src="option.src" height="20px" width="20px" />
              <img
                v-else-if="option.title==='ETH'"
                src="../assets/eth-logo.png"
                height="20px"
                width="20px"
              />
              <img v-else src="../assets/default-token.png" height="20px" width="20px" />
              {{ option.title }}
            </template>
          </v-select>
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
    <!-- No Wallet Modal -->
    <b-modal
      ref="no_wallet_modal"
      id="no_wallet_modal"
      title="No Wallet Signed In"
      :hide-footer="true"
    >
      <p>Please open a wallet containing ETH to list a new token</p>
    </b-modal>
    <Tokeninfo
      :show="{shouldShow: showTokenInfoModal, timestamp: Date.now()}"
      :shouldClearTabs="shouldClearTabs"
      v-on:child-msg="closeTokenInfo"
    />
  </section>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import * as R from "ramda";
import Token from "~/components/Token.vue";
import Transactionlist from "~/components/Transactionlist.vue";
import Header from "~/components/Header.vue";
import Receive from "~/components/Receive.vue";
import Info from "~/components/Info.vue";
import Send from "~/components/Send.vue";
import Swap from "~/components/Swap.vue";
import Liquidity from "~/components/Liquidity.vue";
import Noaccount from "~/components/Noaccount.vue";
import Tokeninfo from "~/components/Tokeninfo.vue";
import Loading from "~/components/Loading.vue";
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
  components: {
    Token,
    Noaccount,
    Transactionlist,
    Header,
    Info,
    Receive,
    Send,
    Swap,
    Liquidity,
    Tokeninfo,
    Loading
  },
  data: function() {
    return {
      form: {
        query: "",
        tokenAddress: "",
        selectedTokenToList: ""
      },
      summary: [],
      showLimit: 20,
      orderBy: ["liquidity", "desc"],
      ethToUsd: 0,
      errorMessage: "",
      infoMessage: "",
      txHash: "",
      loading: false,
      hideLowLiquidityToken: true,
      showTokenInfoModal: false,
      redirecting: false,
      shouldClearTabs: "NO"
    };
  },
  events: {
    "child-msg": function(msg) {}
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getBalance: "account/getBalance",
      getPrice: "account/getPrice",
      getRefresher: "account/getRefresher",
      getWeb3: "getWeb3",
      getSignIn: "getSignIn",
      getSummary: "getSummary",
      getConnection: "getConnection",
      getTransactionListToken: "transaction/getTransactionListToken",
      getTokenTransactionListToken: "transaction/getTokenTransactionListToken",
      getCredentials: "getCredentials",
      getTokenList: "account/getTokenList",
      getOwnedTokenList: "account/getOwnedTokenList",
      getAvailableTokenList: "account/getAvailableTokenList",
      getBadTokenList: "account/getBadTokenList",
      getAuthRedirectUrl: "getAuthRedirectUrl",
      getActiveTab: "getActiveTab",
      getTransactionList: "transaction/getTransactionList",
      getTokenTransactionList: "transaction/getTokenTransactionList",
      getActiveToken: "getActiveToken"
    }),
    getTxList: function() {
      if (this.getActiveToken === "ETH") return this.getTransactionList;
      else return this.getTokenTransactionList;
    },
    activeTokenSubTab: function() {
      let redirectUrl = this.getAuthRedirectUrl;
      return redirectUrl.tokenSubTab || "info";
    },
    tokenList: function() {
      let self = this;
      let ethToUsd = this.ethToUsd;
      let count = R.countBy(R.toLower)(
        this.getAvailableTokenList.map(token => token.symbol)
      );
      let sameSymbolTokens = [];
      for (let item in count) {
        if (count[item] > 1) {
          let obj = {};
          obj[item] = count[item];
          sameSymbolTokens.push(obj);
        }
      }
      // console.log(sameSymbolTokens);
      let unsortedList = this.getAvailableTokenList
        .map(token => {
          let summaryInfo = self.getSummary.find(s => s.token_id === token.id);
          if (!summaryInfo) {
            return {
              name: token.symbol,
              fullname: token.name,
              tokenAddress: token.tokenAddress,
              liquidity: 0,
              volume: 0,
              price: 0,
              src: token.logo,
              order: "-",
              change: 0,
              roir: 0
            };
          } else {
            return {
              name: token.symbol,
              fullname: token.name,
              tokenAddress: token.tokenAddress,
              liquidity: summaryInfo.liquidity * ethToUsd,
              volume: summaryInfo.volume_eth_1D * ethToUsd,
              price: summaryInfo.price_last_1H * ethToUsd,
              src: token.logo,
              order: summaryInfo.order || "-",
              change: summaryInfo.price_change_24h || 0,
              roir: summaryInfo.volume_eth_1W / summaryInfo.liquidity
            };
          }
        })
        .filter(token => {
          if (!this.hideLowLiquidityToken) {
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
          if (
            token.name.toLowerCase().indexOf(searchKeyword) !== -1 ||
            token.fullname.toLowerCase().indexOf(searchKeyword) !== -1
          ) {
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
    },
    listabeTokenList: function() {
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
          else
            return {
              title: symbol,
              balance: self.getBalance[symbol],
              priceInUsd: 0,
              src: null
            };
        })
        .filter(t => t !== null)
        .filter(t => t.balance > 0 && t.title !== self.form.outputCurrency)
        .sort((a, b) => b.priceInUsd - a.priceInUsd);
      return list;
    },
    activeTokenLogo() {
      let self = this;
      const token = this.getAvailableTokenList.find(
        t => t.symbol === self.getActiveToken
      );
      if (token) return token.logo;
      else if (this.getActiveToken === "ETH") return null;
      else return null;
    }
  },
  methods: {
    ...mapActions({
      updateAuthRedirectUrl: "updateAuthRedirectUrl",
      updateSummary: "updateSummary",
      updateChartInfo: "updateChartInfo",
      updateActiveTab: "updateActiveTab",
      updateCurrentView: "updateCurrentView",
      updateActiveToken: "updateActiveToken",
      updateActiveTokenAddress: "updateActiveTokenAddress",
      addAccount: "account/addAccount",
      addToken: "account/addToken",
      setRefresher: "account/setRefresher",
      setAvailableTokenList: "account/setAvailableTokenList",
      updateBalance: "account/updateBalance",
      updateTransactionListToken: "transaction/updateTransactionListToken",
      updateTokenTransactionListToken:
        "transaction/updateTokenTransactionListToken"
    }),
    onTokenTabChange(tabName) {
      this.updateAuthRedirectUrl({
        url: "/tokendetail",
        token: this.getActiveToken,
        tokenSubTab: tabName
      });
    },
    numberWithCommas(x) {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    },
    changeOrder(property, dir) {
      let currentOrderProperty = this.orderBy[0];
      let currentOrderDir = this.orderBy[1];
      let newDir = "desc";
      if (property === currentOrderProperty) {
        if (currentOrderDir === "asc") newDir = "desc";
        else if (currentOrderDir === "desc") newDir = "asc";
      }
      this.orderBy = [property, newDir];
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
    onSelectTokenToList() {
      let self = this;
      let foundToken = this.getOwnedTokenList.find(
        t => t.symbol === self.form.selectedTokenToList.title
      );
      this.form.tokenAddress = foundToken.tokenAddress.toLowerCase();
    },
    loadMoreToken() {
      this.showLimit += 20;
    },
    showListToken() {
      if (this.getSignIn) this.showModal("list_token_modal");
      else this.showModal("no_wallet_modal");
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
      if (!tokenAddress) {
        this.loading = false;
        this.errorMessage = "Invalid token address";
        return;
      }
      let badToken = this.getBadTokenList.find(
        t => t.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()
      );
      if (badToken) {
        console.log(`BAD TOKEN: ${badToken.tokenAddress}`);
        this.resetMessages();
        this.errorMessage = ` Warning not all tokens will work with Uniswap. Read
          <a
            href="https://www.reddit.com/r/UniSwap/comments/c0k63p/contract_not_working/"
          >this</a> and make sure that your token contract is compatible with Uniswap.`;
        this.form.tokenAddress = "";
        this.loading = false;
        return;
      }
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
          console.log(
            `Exchange address already existed for ${
              this.form.selectedTokenToList.title
            } token`
          );
          this.resetMessages();
          this.errorMessage = `Exchange address (${exchangeAddress}) already existed for ${
            this.form.selectedTokenToList.title
          }`;
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
    onSelectToken(name, address, selectSwapTab = false) {
      if (selectSwapTab) {
        this.updateAuthRedirectUrl({
          url: "/",
          token: this.getActiveToken,
          tokenSubTab: "swap"
        });
      } else {
        this.updateAuthRedirectUrl({
          url: "/",
          token: this.getActiveToken,
          tokenSubTab: "info"
        });
      }
      this.showTokenInfoModal = true;
      this.updateActiveToken(name);
      this.updateActiveTokenAddress(address || "");

      this.updateCurrentView("tokeninfo");
      this.updateChartInfo({
        currency: "USD",
        showChart: true,
        tokenAddress: address,
        tokenName: name
      });
    },
    closeTokenInfo() {
      this.showTokenInfoModal = false;
      this.shouldClearTabs = "YES";
      this.updateCurrentView("main");
    },
    isExchangeTabActive() {
      if (this.$route.path === "/") return true;
      else return false;
    },
    async getSummaryFromServer() {
      if (
        !this.isExchangeTabActive() ||
        this.getActiveTab !== "exchange" ||
        !this.getConnection
      )
        return;
      console.log("REFRESHING SUMMARY INFO");
      try {
        let response = await axios.get(`${config.uniswapDexServer}api/summary`);
        this.summary = response.data.result;
        await this.updateSummary(this.summary);
      } catch (e) {
        console.warn("Unable to refresh summary info!");
      }
    },
    closeTokenInfoModal() {
      this.hideModal("token_info_modal");
    },
    onScroll(e) {
      const scrollX = e.target.scrollLeft;
      this.$refs["exchangelist-title-container"].scrollLeft = scrollX;
    }
  },
  created: async function() {
    this.summary = this.getSummary;
    // if (this.getConnection) {
    //   await this.getSummaryFromServer();
    //   await this.updateSummary(this.summary);
    // } else {
    //   this.summary = this.getSummary;
    // }
    let ethPrice = this.getPrice["ETH"];
    if (!ethPrice) {
      ethPrice = await getETHToUSDPrice();
    }
    this.ethToUsd = ethPrice;
    this.web3 = await getWeb3();
    this.web3Metamask = await getWeb3Metamask();
  },
  mounted: async function() {
    let self = this;
    let redirectTokenAddress = this.$route.query.token;
    setTimeout(() => {
      if (redirectTokenAddress) {
        try {
          self.showTokenInfoModal = true;
        } catch (e) {
          console.log(e);
        }
      }
    }, 1000);
    let summaryUpdator = setInterval(() => {
      self.getSummaryFromServer();
    }, config.refreshInterval);
  }
};
</script>

<style>
#exchange-container {
  min-height: 100vh;
  width: 95%;
  max-width: 700px;
  margin: 40px auto;
  margin-top: 10px;
}
.main-tab > .card > .tabs .card-body {
  /* padding: 5px; */
}

.exchangelist-title {
  display: flex;
  justify-content: space-between;
  padding: 15px 15px;
  font-size: 12px;
  font-weight: bolder;
  background: #d0d0d0;
  margin-bottom: 5px;
  cursor: pointer;
  position: sticky;
  height: 50px;
  width: 100%;
  min-width: 700px;
  top: 126px;
  z-index: 500;
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
  left: 20px;
  position: relative;
}
.exchangelist-title .title-price {
  left: 20px;
  position: relative;
}
.exchangelist-title .title-roir {
  left: 10px;
  position: relative;
}
.exchangelist-title .title-name {
  position: relative;
  left: -10px;
}

.exchangelist-section .card-body {
  padding: 0px;
  overflow-x: hidden;
}

#search-token-field {
  margin: 15px auto;
  width: 100%;
}

.search-field-container {
  position: relative;
  width: 100%;
}

.search-field-container > #erase {
  top: 0px;
  color: #b3b3b3;
}

.exchangelist-section .token {
  display: flex;
  justify-content: space-between;
  background: #fff;
  color: #333;
  padding: 10px 10px;
  width: 100%;
  min-width: 700px;
  transition: 0.5s;
}
.exchangelist-section .token:hover {
  cursor: pointer;
  /* border-bottom: 2px solid purple;
  box-sizing: border-box; */
  box-shadow: 0px 2px 5px #bcc0c1;
  -webkit-transform: scale(1.03);
  transform: scale(1.03);
}
.exchangelist-section .token .token-name {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  display: flex;
  flex-grow: 0.4;
}
.exchangelist-section .token .token-name > div {
  margin-left: 10px;
}
.exchange-token-symbol {
  font-size: 12px;
  text-align: left;
  margin-bottom: 5px;
}
.exchange-token-fullname {
  font-size: 10px;
  text-align: left;
  color: #666;
  font-weight: normal;
}
.exchangelist-section .token .token-liquidity-usd,
.exchangelist-section .token .token-price-usd,
.exchangelist-section .token .token-order,
.exchangelist-section .token .token-volume {
  font-size: 12px;
  margin: 0;
  text-align: right;
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
  width: 20px !important;
  padding-top: 5px;
}
.exchangelist-section .token .token-order-container {
  width: 30px !important;
}
.exchangelist-section .token .token-order {
  /* width: 60px; */
  /* padding: 20px 20px; */
  text-align: center;
}
.token-name img {
  width: 30px;
  height: 30px;
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
  color: #7338cc;
  font-weight: bolder;
  padding-right: 15px;
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
#success_modal,
#no_wallet_modal {
  position: fixed;
  top: 150px;
}
.modal-header,
.modal-title {
  text-align: center;
  width: 100%;
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
.btn.swap-button-exchange-list {
  font-size: 12px;
  font-weight: bold;
  padding: 5px 10px;
}
.btn.swap-button-exchange-list svg {
  margin-right: 5px;
}
.swap-button-container {
  padding-top: 10px;
}
.roir-exlplain-text {
  padding: 5px;
  text-align: left;
}
#roir-explain-btn {
  padding: 0px;
  font-weight: normal;
  font-size: 12px;
  border: none;
  background: #8b7f91;
  color: #fff !important;
  border-radius: 20px !important;
  width: 18px;
  height: 18px;
}

@media screen and (max-width: 500px) {
  .exchangelist-title .title-price {
    /* left: 0px; */
    position: relative;
  }
  .exchangelist-section .token .token-name {
    width: 85px;
    font-size: 10px;
    text-align: left;
    padding: 0px;
    position: relative;
    top: 10px;
  }
  .exchangelist-section .token .token-liquidity-usd,
  .exchangelist-section .token .token-price-usd,
  .exchangelist-section .token .token-volume {
    width: 85px;
    font-size: 10px;
    text-align: right;
    padding: 0px;
    position: relative;
    top: 20px;
  }
  .exchange-token-list {
    overflow-x: scroll;
  }
  .exchangelist-title-container {
    overflow-x: scroll;
  }
}
</style>
