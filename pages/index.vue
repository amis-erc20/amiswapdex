<template>
  <section class="main-container">
    <no-connection/>
    <Nav/>
    <div class="main-tab">
      <b-card no-body>
        <b-tabs pills card justified>
          <b-tab title="Exchange" active>
            <b-card-text>
              <Exchange/>
            </b-card-text>
          </b-tab>
          <b-tab title="Wallet">
            <b-card-text v-if="getSignIn">
              <Header/>
              <Newtoken/>
              <Tokenlist/>
              <periodic-backup :backupStatus="getBackupStatus()"/>
              <b-modal
                ref="backup_advice_modal"
                id="backup_advice_modal"
                title="Activate Remote Backup"
                :hide-footer="true"
              >
                <p>Please activate remote backup to avoid losing your login credentials and private key</p>
                <b-button variant="danger" @click="redirect(`/backup`)">Go to Remote Backup</b-button>
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
            <div class="no-account-container" v-else>
              <p>Please sign in or create a new account to access wallet.</p>
              <nuxt-link to="/signup">
                <b-button type="button" variant="outline-primary" id="backup-btn">Create Account</b-button>
              </nuxt-link>
              <nuxt-link to="/signin">
                <b-button type="button" variant="primary" id="backup-btn">Sign In</b-button>
              </nuxt-link>
            </div>
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
import Exchange from "~/components/Exchange.vue";
import NoConnection from "~/components/NoConnection.vue";
import BootstrapVue from "bootstrap-vue";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faLongArrowAltRight,
  faLongArrowAltLeft,
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
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import VueQriously from "vue-qriously";
import Offline from "v-offline";
import vSelect from "vue-select";

import {
  getHistory,
  initContracts,
  getTokenHistory,
  getULTToUSDPrice,
  isIos,
  isInStandaloneMode,
  getETHToUSDPrice
} from "../assets/js/utils";

Vue.use(VueQriously);
Vue.use(BootstrapVue);

library.add(faLongArrowAltRight);
library.add(faLongArrowAltLeft);
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
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("v-select", vSelect);
Vue.component("no-connection", NoConnection);

import { mapActions, mapGetters } from "vuex";
import {
  getWeb3,
  getBalance,
  getTokenBalance,
  getAllListedToken
} from "../assets/js/utils";
import { setTimeout } from "timers";
import config from "../config";

export default {
  middleware: "auth",
  components: {
    Header,
    Tokenlist,
    Nav,
    Offline,
    PeriodicBackup,
    Newtoken,
    Exchange,
    NoConnection
  },
  data: function() {
    return {
      backupCheckInterval: 3 * 60 * 1000,
      ultInUSD: 0,
      currentTokenCount: 0
    };
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getBalance: "account/getBalance",
      getWeb3: "getWeb3",
      getSignIn: "getSignIn",
      getTransactionList: "transaction/getTransactionList",
      getTokenTransactionList: "transaction/getTokenTransactionList",
      getCredentials: "getCredentials",
      getTokenList: "account/getTokenList",
      getAvailableTokenList: "account/getAvailableTokenList"
    })
  },
  methods: {
    ...mapActions({
      addAccount: "account/addAccount",
      addToken: "account/addToken",
      updatePrice: "account/updatePrice",
      setAvailableTokenList: "account/setAvailableTokenList",
      updateBalance: "account/updateBalance",
      updateTransactionList: "transaction/updateTransactionList",
      updateTokenTransactionList: "transaction/updateTokenTransactionList"
    }),
    getBackupStatus() {
      if (!this.getSignIn) return false;
      const { Ns } = this.getCredentials;
      const credentials = JSON.parse(localStorage.getItem(Ns));
      const { backupStatus } = credentials;
      return backupStatus;
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
    async updateUSDPrices() {
      let ultUSD = await getULTToUSDPrice();
      this.ultInUSD = parseFloat(this.getBalance["ULT"] * ultUSD);
    },
    async refresh(web3) {
      if (!this.getSignIn) return;
      let self = this;
      let account = this.getAccount;
      try {
        if (account) {
          console.log("Refreshing...");
          const balance = await getBalance(account.address, web3);
          let tokenBalanceList = [];

          for (let i = 1; i < this.getTokenList.length; i++) {
            let tokenBalance = await getTokenBalance(
              account.address,
              this.getTokenList[i],
              web3
            );
            tokenBalanceList.push({
              symbol: this.getTokenList[i],
              balance: tokenBalance
            });
          }
          // this.updateUSDPrices();
          let txList = await getHistory(account.address);
          let tokenTxList = await getTokenHistory(account.address);
          if (!Array.isArray(txList) || !Array.isArray(tokenTxList)) return;
          if (
            txList.length !== this.getTransactionList.length ||
            tokenTxList.length !== this.getTokenTransactionList.length ||
            balance !== this.getBalance["ETH"] ||
            this.currentTokenCount !== tokenBalanceList.length
          ) {
            this.updateTransactionList(txList);
            this.updateTokenTransactionList(tokenTxList);
            this.updateBalance({
              symbol: "ETH",
              balance
            });
            // console.log(tokenBalanceList);
            for (let i = 0; i < tokenBalanceList.length; i++) {
              this.updateBalance(tokenBalanceList[i]);
            }
            this.currentTokenCount = tokenBalanceList.length;
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    async checkRemoteBackup(web3) {
      if (!this.getSignIn) return;
      let self = this;
      let account = this.getAccount;
      let balance = this.getBalance["ETH"];
      let balanceULT = this.getBalance["ULT"];
      let balanceDAI = this.getBalance["DAI"];
      try {
        if (
          (account.address && balance > 0) ||
          (account.address && balanceULT > 0) ||
          (account.address && balanceDAI > 0)
        ) {
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
    async updateTokenPrices() {
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
    }
  },
  created: async function() {
    let self = this;
    let web3 = await getWeb3();
    let availableTokens = await getAllListedToken();
    this.setAvailableTokenList(availableTokens);
    await initContracts(web3, availableTokens);
    await this.updateTokenPrices();

    setInterval(() => {
      self.refresh(web3);
    }, config.refreshInterval);
    setTimeout(() => {
      self.checkRemoteBackup(web3);
    }, this.backupCheckInterval);
    setInterval(self.updateTokenPrices, 5 * 60 * 1000);
    try {
      let savedTokenList = JSON.parse(localStorage.getItem("tokenList"));
      savedTokenList.forEach(symbol => {
        self.addToken(symbol);
      });
    } catch (e) {
      console.log("cannot get saved token list");
    }
  },
  mounted: async function() {
    let self = this;
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
  background: #2851e4;
  color: #fff;
}
#backup_advice_modal {
  color: #333;
  position: fixed;
  top: 150px;
}
#ult-chart-link {
  position: relative;
  bottom: -30px;
  text-decoration: none;
  color: #2d547b;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bolder;
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
  z-index: 100000;
}
.nav-pills .nav-link {
  height: 64px;
  padding: 20px;
}
.nav-pills .nav-link.active {
  background: #fff;
  color: #2752e4;
  border-bottom: 2px solid #2752e4;
  border-radius: 0px;
}
.main-tab .card-header .nav-item {
  height: 64px;
  width: 50%;
  background: #fff;
}
.main-tab .tab-content {
  position: relative;
  top: 50px;
}
.no-account-container {
  position: relative;
  top: 20vh;
}
.no-account-container button {
  width: 150px;
  height: 50px;
}
</style>
