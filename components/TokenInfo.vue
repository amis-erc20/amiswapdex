<template>
  <section id="token-info-container">
    <!-- Setting Modal -->
    <p style="display:none">{{show.shouldShow}}, {{show.timestamp}}</p>
    <b-modal
      ref="settingModalInInfo_ref"
      id="settingModalInInfo"
      title="Options"
      :hide-footer="true"
    >
      <b-list-group v-if="getSignIn">
        <b-list-group-item
          v-if="getAccount.type === 'credentials'"
          @click="redirect('/backup')"
        >Remote Backup to Google Drive</b-list-group-item>
        <b-list-group-item
          v-if="getAccount.type === 'credentials'"
          @click="redirect('/recoverysetup')"
        >Setup Recovery Q & A</b-list-group-item>
        <b-list-group-item
          v-if="getAccount.type === 'credentials'"
          @click="redirect('/resetpassword')"
        >Change Password</b-list-group-item>
        <b-list-group-item
          v-if="getAccount.type === 'credentials' || getAccount.type === 'private_key'"
          @click="redirect('/privatekey')"
        >Show Private Key</b-list-group-item>
        <b-list-group-item @click="showPage('about')">About</b-list-group-item>
        <b-list-group-item @click="showPage('tos')">Terms of Services</b-list-group-item>
        <b-list-group-item @click="onLogout">Log Out</b-list-group-item>
      </b-list-group>
      <b-list-group v-else>
        <b-list-group-item @click="showPage('about')">About</b-list-group-item>
        <b-list-group-item @click="showPage('tos')">Terms of Services</b-list-group-item>
      </b-list-group>
    </b-modal>

    <!-- Token Info Modal -->
    <b-modal ref="token_info_modal" id="token_info_modal" :hide-footer="true">
      <template slot="modal-header">
        <font-awesome-icon
          class="back-button-svg"
          icon="chevron-left"
          size="lg"
          color="#fff"
          @click="closeTokenInfoModal"
        />
        <div id="main-title-no-connection-container">
          <div class="logo-title-container">
            <img
              class="logo-in-header"
              v-if="getActiveToken==='ETH'"
              src="../assets/eth-logo.png"
              alt
            >
            <img class="logo-in-header" v-else-if="activeTokenLogo" :src="activeTokenLogo" alt>
            <img
              class="logo-in-header"
              v-else-if="!activeTokenLogo"
              src="../assets/default-token.png"
              alt
            >
            <h4>{{ getActiveToken }}</h4>
          </div>
        </div>
        <b-button id="menu-button" v-b-modal.settingModalInInfo variant="outline-light">
          <font-awesome-icon icon="bars" size="lg" color="#fff"/>
        </b-button>
      </template>
      <b-card no-body>
        <b-tabs pills card id="token-info-tabs-container">
          <b-tab
            title="Info"
            :active="activeTokenSubTab === 'info'"
            @click="onTokenTabChange('info')"
          >
            <Info/>
          </b-tab>
          <b-tab
            :active="activeTokenSubTab === 'balance'"
            title="Balance"
            @click="onTokenTabChange('balance')"
          >
            <Header v-if="getSignIn"/>
            <Transactionlist v-if="getSignIn"/>
            <Noaccount v-else/>
          </b-tab>
          <b-tab
            :active="activeTokenSubTab === 'receive'"
            title="Receive"
            @click="onTokenTabChange('receive')"
          >
            <Receive v-if="getSignIn"/>
            <Noaccount v-else/>
          </b-tab>
          <b-tab
            :active="activeTokenSubTab === 'send'"
            title="Send"
            @click="onTokenTabChange('send')"
          >
            <b-card-text>
              <Send v-if="getSignIn"/>
              <Noaccount v-else/>
            </b-card-text>
          </b-tab>
          <b-tab
            :active="activeTokenSubTab === 'swap'"
            title="Swap"
            @click="onTokenTabChange('swap')"
          >
            <b-card-text>
              <Swap v-if="getSignIn && getConnection"/>
              <Noaccount v-else/>
            </b-card-text>
          </b-tab>
          <b-tab
            :active="activeTokenSubTab === 'pool'"
            title="Pool"
            v-if="getActiveToken !== 'ETH'"
            @click="onTokenTabChange('pool')"
          >
            <b-card-text>
              <Liquidity v-if="getSignIn && getConnection"/>
              <Noaccount v-else/>
            </b-card-text>
          </b-tab>
        </b-tabs>
      </b-card>
      <!-- About/TOS Modal -->
      <b-modal ref="about_tos_modal" id="about_tos_modal" :hide-footer="true">
        <template slot="modal-header">
          <font-awesome-icon
            class="back-button-svg"
            icon="chevron-left"
            size="lg"
            color="#fff"
            @click="closeAboutTosModal"
          />
          <div id="main-title-no-connection-container">
            <h4 v-if="pageToRender === 'about'">About UniswapDex</h4>
            <h4 v-if="pageToRender === 'tos'">Term of Services</h4>
          </div>
        </template>
        <About v-if="pageToRender === 'about'"/>
        <Tos v-if="pageToRender === 'tos'"/>
      </b-modal>
    </b-modal>
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
import Tos from "~/components/Tos.vue";
import About from "~/components/About.vue";
import Noaccount from "~/components/Noaccount.vue";
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
    Tos,
    About
  },
  props: ["show"],
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
      showLowLiquidityToken: false,
      pageToRender: ""
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
      getSummary: "getSummary",
      getConnection: "getConnection",
      getTransactionListToken: "transaction/getTransactionListToken",
      getTokenTransactionListToken: "transaction/getTokenTransactionListToken",
      getCredentials: "getCredentials",
      getTokenList: "account/getTokenList",
      getAvailableTokenList: "account/getAvailableTokenList",
      getAuthRedirectUrl: "getAuthRedirectUrl",
      getActiveTab: "getActiveTab",
      getTransactionList: "transaction/getTransactionList",
      getTokenTransactionList: "transaction/getTokenTransactionList",
      getActiveToken: "getActiveToken"
    }),
    activeTokenSubTab: function() {
      let redirectUrl = this.getAuthRedirectUrl;
      return redirectUrl.tokenSubTab || "info";
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
      updateAuthStatus: "updateAuthStatus",
      updateActiveTab: "updateActiveTab",
      updateActiveToken: "updateActiveToken",
      addAccount: "account/addAccount",
      removeAccount: "account/removeAccount",
      resetAllBalances: "account/resetAllBalances",
      resetTransactionList: "transaction/resetTransactionList",
      resetTokenTransactionList: "transaction/resetTokenTransactionList",
      resetTokenList: "account/resetTokenList",
      addToken: "account/addToken",
      setRefresher: "account/setRefresher",
      setAvailableTokenList: "account/setAvailableTokenList",
      updateBalance: "account/updateBalance",
      updateTransactionListToken: "transaction/updateTransactionListToken",
      updateTokenTransactionListToken:
        "transaction/updateTokenTransactionListToken"
    }),
    redirect(url) {
      this.$router.push(url);
    },
    showPage(name) {
      this.pageToRender = name;
      this.hideModal("settingModalInInfo_ref");
      this.showModal("about_tos_modal");
    },
    closeAboutTosModal() {
      this.hideModal("about_tos_modal");
      this.pageToRender = "";
    },
    onTokenTabChange(tabName) {},
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
    closeTokenInfoModal() {
      this.hideModal("token_info_modal");
      this.$emit("child-msg", this.msg);
    },
    onLogout() {
      this.updateAuthStatus(false);
      this.removeAccount();
      this.resetAllBalances();
      this.resetTransactionList();
      this.resetTokenTransactionList();
      this.resetTokenList();
      // localStorage.removeItem("credentials");
      this.hideModal("settingModal_ref");
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.setRefresher(false);
      }
      this.$router.push("/");
      setTimeout(() => {
        document.location.reload(true);
      }, 200);
    }
  },
  mounted: function() {
    let shouldShould = this.show.shouldShow;
    let timestamp = this.show.timestamp;
    if (shouldShould) this.showModal("token_info_modal");
    console.log("mounted");
  },
  beforeUpdate: function() {
    let shouldShould = this.show.shouldShow;
    let timestamp = this.show.timestamp;
    if (shouldShould) this.showModal("token_info_modal");
  }
};
</script>

<style>
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

#token-info-tabs-container {
  width: 100%;
  margin: 0 auto;
}
#token-info-tabs-container .card-header {
  position: relative;
  padding: 0px;
  height: 44px;
  width: 100%;
  margin: 0 auto;
}
#token-info-tabs-container .card-header-pills {
  width: 100%;
  margin: 0;
}
#token-info-tabs-container .card-body {
  padding: 0px;
}
#token-info-tabs-container .card-header .nav-item {
  height: 44px;
  width: 16.666%;
  background: #fff;
  margin: 0;
}
#token-info-tabs-container .card-header .nav-item {
  height: 44px;
  width: 16.666%;
  background: #f8fafb;
  margin: 0;
  font-size: 13px;
}
#token-info-tabs-container .nav-pills .nav-link {
  padding: 15px;
  height: 44px;
}
#token-info-tabs-container .tab-content {
  position: relative;
  top: 0px;
}
#token-info-tabs-container .transactionlist-section {
  box-shadow: 0px 4px 3px #eee;
  padding-left: 10px;
  padding-right: 10px;
  /* overflow: scroll; */
  /* max-height: 400px; */
  margin-bottom: 15px;
}
#token-info-tabs-container .receive-section {
  padding-top: 20px;
}
/* #token-info-tabs-container .modal-content {
  background-color: #eceeef;
  min-height: 100vh;
  border-radius: 0px;
} */

#token_info_modal,
#about_tos_modal {
  position: fixed;
  top: 0px;
}
#token_info_modal .modal-header,
#about_tos_modal .modal-header {
  border-radius: 0px !important;
  border: none;
}

#token_info_modal .token-info-section {
  height: auto;
  width: 100%;
  padding-top: 0px;
}
#token_info_modal,
#about_tos_modal {
  position: fixed;
  top: 0px;
  width: 100%;
  height: 100vh;
  max-width: 100%;
  padding: 0;
  z-index: 2000;
}
#token_info_modal .modal-dialog,
#about_tos_modal .modal-dialog {
  width: 100%;
  margin: 0 auto;
}
#token_info_modal .modal-body,
#about_tos_modal .modal-body {
  padding: 0;
  background: #eceeef;
}

#token_info_modal .modal-dialog,
#token-info-modal .modal-content,
#about_tos_modal .modal-dialog,
#about_tos_modal .modal-content {
  background-color: #eceeef;
  height: 100vh;
  width: 100vw;
  max-width: 100vw !important;
  margin: 0px;
  padding: 0;
  border-radius: 0px;
}
#about_tos_modal .modal-dialog,
#about_tos_modal .modal-content {
  overflow: hidden;
}
#token_info_modal___BV_modal_content_ {
  border: none;
}
#token-info-modal .modal-header .title,
#about_tos_modal .modal-header .title {
  text-align: center;
  flex-grow: 3;
  padding-left: 20px;
  display: flex;
  justify-content: center;
}
.logo-in-header {
  margin-right: 15px;
  width: 30px;
  height: 30px;
}
#token-info-modal .modal-header a,
#about_tos_modal .modal-header a {
  padding-top: 10px;
}
#token-info-modal .logo-title-container {
  position: relative;
  top: 5px;
}
#menu-button {
  color: #a41de4;
}
#menu-button svg {
  border: none !important;
  outline: none !important;
  color: #a41de4;
}
.setting-container img {
  width: 35px;
  cursor: pointer;
}
#token-info-modal .modal-header h4 {
  font-size: 22px;
  padding-top: 10px;
  margin: 0px;
}
#settingModalInInfo {
  color: #333;
  position: fixed;
  top: 150px;
  text-align: center;
  z-index: 3000;
}
#settingModalInInfo .modal-header {
  background: #773894;
  text-align: center;
}
#settingModalInInfo .modal-title {
  flex-grow: 2;
  color: #fff;
}
#settingModalInInfo .modal-body {
  padding: 0px;
}
#settingModalInInfo .modal-body p {
  padding: 20px 10px;
}
#menu-button:active,
#menu-button:focus,
#menu-button:hover {
  border: none !important;
  outline: none !important;
  background: transparent !important;
  color: #fff !important;
  box-shadow: none;
}
#settingModalInInfo .list-group-item {
  cursor: pointer;
  font-size: 13px;
}
.back-button-svg {
  position: relative;
  cursor: pointer;
  top: 5px;
  left: 10px;
  color: #a41de4;
}
@media screen and (max-width: 450px) {
  #token-info-tabs-container .nav-pills .nav-link {
    padding: 15px 0px;
    height: 44px;
    font-size: 12px;
  }
}
</style>
