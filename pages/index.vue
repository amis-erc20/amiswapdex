<template>
  <section class="main-container">
    <Nav/>
    <Header/>
    <Tokenlist/>
    <Newtoken/>
    <periodic-backup :backupStatus="getBackupStatus()"/>
    <a href="http://bounty.shardus.com:3333/" id="ult-chart-link" target="_blank">
      <font-awesome-icon icon="chart-line" size="lg" color="#333"/>
      {{" "}}ULT Price Chart
    </a>
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
  </section>
</template>

<script>
import Vue from "vue";
import Header from "~/components/Header.vue";
import Nav from "~/components/Nav.vue";
import Newtoken from "~/components/Newtoken.vue";
import Tokenlist from "~/components/Tokenlist.vue";
import PeriodicBackup from "~/components/PeriodicBackup.vue";
import BootstrapVue from "bootstrap-vue";
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
  faSlidersH
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
  isInStandaloneMode
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
library.add(faSlidersH);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("v-select", vSelect);

import { mapActions, mapGetters } from "vuex";
import { getWeb3, getBalance, getTokenBalance } from "../assets/js/utils";
import { setTimeout } from "timers";

export default {
  middleware: "auth",
  components: {
    Header,
    Tokenlist,
    Nav,
    Offline,
    PeriodicBackup,
    Newtoken
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
      getTokenList: "account/getTokenList"
    })
  },
  methods: {
    ...mapActions({
      addAccount: "account/addAccount",
      addToken: "account/addToken",
      updateBalance: "account/updateBalance",
      updateTransactionList: "transaction/updateTransactionList",
      updateTokenTransactionList: "transaction/updateTokenTransactionList"
    }),
    getBackupStatus() {
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
          // console.log("Refreshing...");
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
    }
  },
  created: async function() {
    let web3 = await getWeb3();
    await initContracts(web3);
    let self = this;
    setInterval(() => {
      self.refresh(web3);
    }, 5000);
    setTimeout(() => {
      self.checkRemoteBackup(web3);
    }, this.backupCheckInterval);
  },
  mounted: function() {
    let self = this;
    setTimeout(() => {
      if (isIos() && !isInStandaloneMode()) {
        let isShown = localStorage.getItem("isInstallMessageShown");
        if (isShown !== "true") {
          this.showModal("install_modal");
        }
      }
    }, 3000);
    console.log(`ETH Balance: ${this.getBalance["ETH"]}`);
    console.log(`ULT Balance: ${this.getBalance["ULT"]}`);
    console.log(`DAI Balance: ${this.getBalance["DAI"]}`);
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
}
.modal-header {
  background: #ed1b24;
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
</style>
