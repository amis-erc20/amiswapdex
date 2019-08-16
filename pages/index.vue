<template>
  <section class="main-container">
    <Nav :refreshInterval="refreshInterval" />
    <div class="main-tab">
      <b-card no-body>
        <b-tabs pills card justified>
          <b-tab title="Market" :active="getActiveTab === `market`" @click="onTabChange">
            <b-card-text>
              <Loading v-if="redirecting" message="Redirecting" />
              <Market v-else />
            </b-card-text>
          </b-tab>
          <b-tab title="Exchange" :active="getActiveTab === `exchange`" @click="onTabChange">
            <b-card-text>
              <Loading v-if="redirecting" message="Redirecting" />
              <Exchange v-else />
            </b-card-text>
          </b-tab>
          <b-tab title="Wallet" :active="getActiveTab === `wallet`" @click="onTabChange">
            <b-card-text v-if="getSignIn">
              <div class="wallet-tab-container">
                <div id="total-summary">
                  <h5>TOTAL VALUE</h5>
                  <h2 v-if="getTotalValue >= 1">$ {{ getTotalValue.toFixed(2) }}</h2>
                  <h2 v-else>$ {{ getTotalValue.toFixed(4) }}</h2>
                </div>
                <Tokenlist :balance="tokenBalance" />
                <periodic-backup :backupStatus="getBackupStatus()" />
              </div>
              <b-modal
                ref="backup_advice_modal"
                id="backup_advice_modal"
                title="Activate Remote Backup"
                :hide-footer="true"
              >
                <p>Please activate remote backup to avoid losing your login credentials and private key</p>
                <b-button variant="primary" @click="redirect(`/backup`)">Go to Remote Backup</b-button>
              </b-modal>
              <!-- Install Modal -->
              <b-modal
                ref="install_modal"
                id="install_modal"
                title="Install Shardus"
                :hide-footer="true"
                @hide="onHideInstallModal"
              >
                Install this web app on your iPhone: tap
                <strong>share</strong> button and then
                <strong>Add to Homescreen</strong>
              </b-modal>
            </b-card-text>
            <Noaccount v-else />
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </section>
</template>

<script>
import Vue from "vue";
import Header from "~/components/Header.vue";
import Nav from "~/components/Nav.vue";
import Newtoken from "~/components/Newtoken.vue";
import Tokenlist from "~/components/Tokenlist.vue";
import PeriodicBackup from "~/components/PeriodicBackup.vue";
import Loading from "~/components/Loading.vue";
import Exchange from "~/components/Exchange.vue";
import Market from "~/components/Market.vue";
import NoConnection from "~/components/NoConnection.vue";
import BootstrapVue from "bootstrap-vue";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faLongArrowAltRight,
  faLongArrowAltLeft,
  faArrowDown,
  faExchangeAlt,
  faInfo,
  faShare,
  faHandHoldingUsd,
  fachevronLeft,
  faChevronLeft,
  faBars,
  faCheck,
  faQrcode,
  faPlus,
  faUpload,
  faChartLine,
  faUndo,
  faCopy
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import VueQriously from "vue-qriously";
import Offline from "v-offline";
import vSelect from "vue-select";
import Noaccount from "~/components/Noaccount.vue";
import Toasted from "vue-toasted";
import VueMq from "vue-mq";
import VueGoodTablePlugin from "vue-good-table";
import "vue-good-table/dist/vue-good-table.css";
import VueFriendlyIframe from "vue-friendly-iframe";

Vue.component("vue-friendly-iframe", VueFriendlyIframe);
Vue.use(VueGoodTablePlugin);
Vue.use(Toasted);
Vue.use(VueMq, {
  breakpoints: {
    mobile: 500,
    tablet: 900,
    laptop: 1250,
    desktop: Infinity
  }
});

import {
  getHistory,
  initContracts,
  getTokenHistory,
  isIos,
  isInStandaloneMode,
  getETHToUSDPrice,
  getWeb3Metamask,
  getTokenHoldingByAnAccount,
  getEthToUsdcPrice
} from "../assets/js/utils";

Vue.use(VueQriously);
Vue.use(BootstrapVue);

library.add(faLongArrowAltRight);
library.add(faLongArrowAltLeft);
library.add(faArrowDown);
library.add(faExchangeAlt);
library.add(faInfo);
library.add(faShare);
library.add(faHandHoldingUsd);
library.add(faChevronLeft);
library.add(faBars);
library.add(faCheck);
library.add(faQrcode);
library.add(faPlus);
library.add(faUpload);
library.add(faChartLine);
library.add(faUndo);
library.add(faCopy);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("v-select", vSelect);
Vue.component("no-connection", NoConnection);

import { mapActions, mapGetters } from "vuex";
import {
  getWeb3,
  getBalance,
  getTokenBalance,
  getAllListedToken,
  getAllBadToken
} from "../assets/js/utils";
import { setTimeout } from "timers";
import config from "../config";

export default {
  components: {
    Header,
    Tokenlist,
    Nav,
    Offline,
    PeriodicBackup,
    Newtoken,
    Exchange,
    NoConnection,
    Noaccount,
    Loading,
    Market
  },
  data: function() {
    return {
      backupCheckInterval: 3 * 60 * 1000,
      currentTokenCount: 0,
      refreshInterval: null,
      redirecting: false,
      web3: null,
      tokenBalance: {}
    };
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getBalance: "account/getBalance",
      getTotalValue: "account/getTotalValue",
      getWeb3: "getWeb3",
      getSignIn: "getSignIn",
      getConnection: "getConnection",
      getServerStatus: "getServerStatus",
      getTransactionList: "transaction/getTransactionList",
      getTokenTransactionList: "transaction/getTokenTransactionList",
      getCredentials: "getCredentials",
      getTokenList: "account/getTokenList",
      getOwnedTokenList: "account/getOwnedTokenList",
      getAvailableTokenList: "account/getAvailableTokenList",
      getRefresher: "account/getRefresher",
      getActiveTab: "getActiveTab"
    })
  },
  methods: {
    ...mapActions({
      updateActiveTab: "updateActiveTab",
      updateActiveToken: "updateActiveToken",
      updateServerStatus: "updateServerStatus",
      addAccount: "account/addAccount",
      addToken: "account/addToken",
      setBadTokenList: "account/setBadTokenList",
      setOwnedTokenList: "account/setOwnedTokenList",
      updatePrice: "account/updatePrice",
      updateEthPrice: "account/updateEthPrice",
      setAvailableTokenList: "account/setAvailableTokenList",
      updateBalance: "account/updateBalance",
      setRefresher: "account/setRefresher",
      updateTransactionList: "transaction/updateTransactionList",
      updateTokenTransactionList: "transaction/updateTokenTransactionList",
      updateAuthRedirectUrl: "updateAuthRedirectUrl",
      updateChartInfo: "updateChartInfo"
    }),
    scrollToTop(x, y) {
      window.scrollTo(x, y);
    },
    onTabChange(e) {
      let selectedTab = e.target.text.toLowerCase();
      this.updateActiveTab(selectedTab);
      this.scrollToTop(0, 0);
      if (selectedTab === "exchange") {
        this.updateAuthRedirectUrl({ url: "/", token: null });
      }
      if (selectedTab === "market") {
        this.updateAuthRedirectUrl({ url: "/", token: null });
        this.updateChartInfo({
          tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          tokenName: "LIQUIDITY",
          currency: "USD",
          showChart: false,
          market: true
        });
      } else {
        this.updateChartInfo({
          tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          tokenName: "WETH",
          currency: "USD",
          showChart: false,
          market: false
        });
      }
    },
    getBackupStatus() {
      if (!this.getSignIn) return false;
      try {
        const { Ns } = this.getCredentials;
        const credentials = JSON.parse(localStorage.getItem(Ns));
        const { backupStatus } = credentials;
        return backupStatus;
      } catch (e) {
        return false;
      }
    },
    onHideInstallModal() {
      localStorage.setItem("isInstallMessageShown", "true");
    },
    handleConnectivityChange(status) {
      console.log(`Connection Status: ${status}`);
    },
    redirect(url) {
      this.$router.push(url);
    },
    showModal(ref) {
      if (this.$refs[ref]) this.$refs[ref].show();
    },
    async refreshWallet(web3) {
      if (
        !this.getSignIn ||
        !this.getConnection ||
        this.getActiveTab !== "wallet"
      ) {
        return;
      }
      let self = this;
      let account = this.getAccount;
      try {
        if (account) {
          console.log("Refreshing Wallet");
          let txList = await getHistory(account.address);
          let tokenTxList = await getTokenHistory(account.address);
          if (!Array.isArray(txList) || !Array.isArray(tokenTxList)) return;
          let newTokenHolding = await getTokenHoldingByAnAccount(
            account.address
          );
          let isBalanceChanged = false;
          for (let i = 0; i < newTokenHolding.length; i++) {
            let symbol = newTokenHolding[i].symbol;
            if (symbol === "UNI-V1") continue;
            if (self.getBalance[symbol] !== newTokenHolding[i].balance) {
              isBalanceChanged = true;
              break;
            }
          }
          if (
            txList.length !== this.getTransactionList.length ||
            tokenTxList.length !== this.getTokenTransactionList.length ||
            isBalanceChanged
          ) {
            // console.log("UPDATING TXS and WALLET BALANCES");
            this.updateTransactionList(txList);
            this.updateTokenTransactionList(tokenTxList);
            newTokenHolding.forEach(token => {
              console.log(token.symbol);
              if (token.symbol === "UNI-V1") {
                let tokenDetail = self.getAvailableTokenList.find(
                  t =>
                    t.exchangeAddress.toLowerCase() ===
                    token.tokenAddress.toLowerCase()
                );
                if (tokenDetail) {
                  // console.log(tokenDetail);
                  // token.symbol = token.symbol + "_" + tokenDetail.symbol;
                  token.symbol = tokenDetail.symbol + "_LIQUIDITY";
                  token.name = tokenDetail.symbol + " Liquidity Share";
                }
              }
              self.addToken(token);
              self.updateBalance(token);
              self.tokenBalance[token.symbol] = token.balance;
            });
            self.setOwnedTokenList(newTokenHolding);
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    async checkRemoteBackup(web3) {
      if (!this.getSignIn) return;
      if (this.getAccount.type !== "credentials") return;
      let self = this;
      let account = this.getAccount;
      let balance = this.getTotalValue;
      try {
        if (account.address && balance > 0) {
          let { Ns } = this.getCredentials;
          let { backupStatus } = JSON.parse(localStorage.getItem(Ns));
          if (backupStatus === false) {
            this.showModal("backup_advice_modal");
            setTimeout(() => {
              self.checkRemoteBackup(self.web3);
            }, this.backupCheckInterval);
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    scheduleNextBackupCheck() {
      let self = this;
      setTimeout(() => {
        self.checkRemoteBackup(self.web3);
      }, this.backupCheckInterval);
    },
    isExchangeTabActive() {
      if (this.$route.path === "/") return true;
      else return false;
    },
    async refreshTokenPrices() {
      if (
        !this.isExchangeTabActive() ||
        this.getActiveTab !== "exchange" ||
        !this.getConnection
      )
        return;
      // console.log(`Refreshing EXCHANGE TOKEN PRICES`);
      try {
        let self = this;
        let ethPrice = await getETHToUSDPrice();
        await self.updatePrice({
          symbol: "ETH",
          price: ethPrice
        });
        let response = await axios.get(`${config.uniswapDexServer}api/summary`);
        let summary = response.data.result;
        this.getAvailableTokenList.forEach(token => {
          let summaryInfo = summary.find(s => s.token_id === token.id);
          if (!summaryInfo)
            self.updatePrice({
              symbol: token.symbol,
              price: 0.0
            });
          else
            self.updatePrice({
              symbol: token.symbol,
              price: summaryInfo.price_last_1H * ethPrice
            });
        });
        return ethPrice;
      } catch (e) {
        console.warn("Unable to refresh token prices!");
      }
    },
    async refreshTokenList(web3) {
      if (
        !this.isExchangeTabActive() ||
        this.getActiveTab === "wallet" ||
        !this.getConnection
      )
        return;
      try {
        // console.log("Refreshing EXCHANGE TOKEN LIST");
        let allTokens = await getAllListedToken();
        this.setAvailableTokenList(allTokens);
        await initContracts(web3, allTokens);
      } catch (e) {
        console.warn("Unable to refresh token list!");
      }
    },
    refreshServerStatus() {
      let self = this;
      let url = `${config.uniswapDexServer}api/status`;
      axios
        .get(url)
        .then(res => {
          if (res.status === 200) {
            self.updateServerStatus(true);
          }
        })
        .catch(e => {
          self.updateServerStatus(false);
        });
    }
  },
  created: async function() {
    let self = this;
    let web3 = await getWeb3();
    let metamaskWeb3 = await getWeb3Metamask();
    let availableTokens = await getAllListedToken();

    localStorage.removeItem("chartInfo");
    this.setAvailableTokenList(availableTokens);
    await initContracts(web3, availableTokens);
    this.refreshServerStatus();
    this.refreshTokenList(web3);
    this.refreshTokenPrices();

    if (self.getSignIn) {
      let accountType = self.getAccount.type;
      if (accountType === "metamask") {
        self.refreshWallet(metamaskWeb3);
      } else {
        self.refreshWallet(web3);
      }
    }
    const isRefresherExisted = self.getRefresher;
    if (!isRefresherExisted) {
      self.refreshInterval = setInterval(async () => {
        if (self.getSignIn) {
          let accountType = self.getAccount.type;
          if (accountType === "metamask") {
            self.refreshWallet(metamaskWeb3);
          } else {
            self.refreshWallet(web3);
          }
        }
      }, 10000);
    }
    let remoteBackupChecker = setTimeout(() => {
      self.checkRemoteBackup(web3);
    }, this.backupCheckInterval);
    let tokenPriceUpdater = setInterval(
      self.refreshTokenPrices,
      config.refreshInterval
    );
    let tokenListUpdater = setInterval(() => {
      self.refreshTokenList(web3);
    }, config.refreshInterval);
    let serverStatusUpdater = setInterval(() => {
      self.refreshServerStatus();
    }, 3000);
    let signInChecker = setInterval(() => {
      if (self.getSignIn) {
        self.refreshWallet(web3);
        clearInterval(signInChecker);
      }
    }, 3000);
  },
  mounted: async function() {
    let self = this;
    getAllBadToken().then(tokens => {
      self.setBadTokenList(tokens);
    });
    setTimeout(() => {
      if (isIos() && !isInStandaloneMode()) {
        let isShown = localStorage.getItem("isInstallMessageShown");
        if (isShown !== "true") {
          this.showModal("install_modal");
        }
      }
    }, 3000);
  }
};
</script>

<style>
.main-container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #eceeef;
}
.modal-header {
  background: #ffffff;
  color: #b14ae2;
}
#backup_advice_modal {
  color: #333;
  position: fixed;
  top: 150px;
}
.main-tab {
  top: 64px;
  position: relative;
  width: 100%;
  border-radius: 0px;
}
.main-tab .card {
  border-radius: 0px;
  background-color: #eceeef !important;
  border: none;
}
.main-tab .card-header {
  position: fixed;
  padding: 0px;
  height: 64px;
  width: 100%;
  z-index: 777;
}
.nav-pills .nav-link {
  height: 64px;
  padding: 25px;
  text-transform: uppercase;
  color: #777777;
  font-size: 14px;
}
.nav-pills .nav-link.active {
  background: #f8fafb !important;
  color: #a41ce3 !important;
  font-weight: bold;
  border-bottom: 2px solid #a41de4;
  border-radius: 0px;
}
.main-tab .card-header .nav-item {
  height: 64px;
  width: 33.333%;
  background: #f8fafb;
}
.main-tab .tab-content {
  position: relative;
  top: 50px;
}
.main-tab .tablist {
  box-shadow: 0px 2px 2px #e2e2e2;
}
div {
  outline: none;
}
#metamask-btn {
  width: 225px;
}
#redirecting_modal {
  color: #333;
  position: fixed;
  top: 150px;
}
#total-summary {
  text-align: center;
  margin-top: 15px;
}
#total-summary h2 {
  font-size: 45px;
  position: relative;
  left: 0px;
  margin: 10px auto;
  font-weight: normal;
  color: #2f3c42;
}
#total-summary h5 {
  font-size: 16px;
}
.modal-header .close {
  font-size: 30px;
  color: #a41de4;
}
.btn-primary {
  color: #fff;
  background-color: #773894;
  border-color: #773894;
  height: 50px;
  font-size: 13px;
  text-transform: uppercase;
  font-weight: bolder;
}
.btn-outline-dark {
  color: #343a40;
  border-color: #343a40;
  height: 50px;
  font-size: 13px;
  text-transform: uppercase;
  font-weight: bolder;
}
.btn-primary:hover,
.btn-primary:active,
.btn-primary:focus,
.btn-primary:disabled {
  color: #fff;
  background-color: #5f1f7b;
  border-color: #5f1e7b;
}
.btn-outline-primary {
  color: #773894;
  border-color: #773894;
}
.btn-outline-primary:hover {
  color: #fff;
  background: #773894;
  border-color: #773894;
}
.spinner-border {
  margin: 20px !important;
}
@media screen and (max-width: 500px) {
  .nav-pills .nav-link {
    height: 64px;
    padding: 25px;
    font-size: 13px;
  }
  .wallet-tab-container {
    overflow-x: hidden;
  }
}
</style>
