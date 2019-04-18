<template>
  <section class="main-container">
    <Nav/>
    <Header/>
    <Tokenlist/>
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
    PeriodicBackup
  },
  data: function() {
    return {
      backupCheckInterval: 3 * 60 * 1000,
      ultInUSD: 0
    };
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getBalance: "account/getBalance",
      getBalanceULT: "account/getBalanceULT",
      getBalanceDAI: "account/getBalanceDAI",
      getWeb3: "getWeb3",
      getSignIn: "getSignIn",
      getTransactionList: "transaction/getTransactionList",
      getTokenTransactionList: "transaction/getTokenTransactionList",
      getCredentials: "getCredentials"
    })
  },
  methods: {
    ...mapActions({
      addAccount: "account/addAccount",
      updateBalance: "account/updateBalance",
      updateBalanceULT: "account/updateBalanceULT",
      updateBalanceDAI: "account/updateBalanceDAI",
      updateTransactionList: "transaction/updateTransactionList",
      updateTokenTransactionList: "transaction/updateTokenTransactionList"
    }),
    getBackupStatus() {
      const { Ns } = this.getCredentials;
      const credentials = JSON.parse(localStorage.getItem(Ns));
      console.log(Ns);
      console.log(credentials);
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
      this.ultInUSD = parseFloat(this.getBalanceULT * ultUSD);
    },
    async refresh(web3) {
      if (!this.getSignIn) return;
      let self = this;
      let account = this.getAccount;
      try {
        if (account) {
          // console.log("Refreshing...");
          const balance = await getBalance(account.address, web3);
          const ultBalance = await getTokenBalance(
            account.address,
            "ULT",
            web3
          );
          const daiBalance = await getTokenBalance(
            account.address,
            "DAI",
            web3
          );
          // console.log(balance, ultBalance, daiBalance);
          // this.updateUSDPrices();
          let txList = await getHistory(account.address);
          let tokenTxList = await getTokenHistory(account.address);
          if (!Array.isArray(txList) || !Array.isArray(tokenTxList)) return;
          if (
            txList.length !== this.getTransactionList.length ||
            tokenTxList.length !== this.getTokenTransactionList.length ||
            balance !== this.getBalance ||
            ultBalance !== this.getBalanceULT
          ) {
            this.updateTransactionList(txList);
            this.updateTokenTransactionList(tokenTxList);
            if (balance !== undefined) this.updateBalance(balance);
            if (ultBalance !== undefined) this.updateBalanceULT(ultBalance);
            if (daiBalance !== undefined) this.updateBalanceDAI(daiBalance);
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
      let balance = this.getBalance;
      let balanceULT = this.getBalanceULT;
      let balanceDAI = this.getBalanceDAI;
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
    }, 10000);
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
    console.log(`ETH Balance: ${this.getBalance}`);
    console.log(`ULT Balance: ${this.getBalanceULT}`);
    console.log(`DAI Balance: ${this.getBalanceDAI}`);
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
