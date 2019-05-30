<template>
  <div class="nav-section">
    <nuxt-link to="/" v-if="currentRoute !== '/'">
      <font-awesome-icon icon="chevron-left" size="lg" color="#fff" @click="onPressBack"/>
    </nuxt-link>
    <div class="title">
      <div id="main-title-no-connection-container">
        <div class="logo-title-container">
          <img
            v-if="currentRoute === '/tokendetail' && getActiveToken==='ETH'"
            src="../assets/eth-logo.png"
            alt
          >
          <img
            v-else-if="currentRoute === '/tokendetail' && activeTokenLogo"
            :src="activeTokenLogo"
            alt
          >
          <img
            v-else-if="currentRoute === '/tokendetail' && !activeTokenLogo"
            src="../assets/default-token.png"
            alt
          >
          <h4>{{ title }}</h4>
        </div>
        <no-connection/>
      </div>
    </div>
    <b-button v-b-modal.settingModal variant="outline-light">
      <font-awesome-icon icon="bars" size="lg" color="#fff"/>
    </b-button>
    <b-modal ref="settingModal_ref" id="settingModal" title="Wallet Setting" :hide-footer="true">
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
    <!-- Metamask Modal -->
    <b-modal ref="about_tos_modal" id="about_tos_modal" :hide-footer="true">
      <template slot="modal-header">
        <font-awesome-icon
          class="back-button-svg"
          icon="chevron-left"
          size="lg"
          color="#fff"
          @click="closeSigninModal"
        />
        <div id="main-title-no-connection-container">
          <h4 v-if="pageToRender === 'about'">About UniswapDex</h4>
          <h4 v-if="pageToRender === 'tos'">Term of Services</h4>
        </div>
        <!-- <b-button id="menu-button" v-b-modal.settingModalInInfo variant="outline-light">
              <font-awesome-icon icon="bars" size="lg" color="#fff"/>
        </b-button>-->
      </template>
      <About v-if="pageToRender === 'about'"/>
      <Tos v-if="pageToRender === 'tos'"/>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import cryptoUtils from "../assets/js/cryptoUtils.js";
import Tos from "~/components/Tos.vue";
import About from "~/components/About.vue";
export default {
  components: {
    Tos,
    About
  },
  props: {
    refreshInterval: {
      type: Number
    }
  },
  data: function() {
    return {
      pageToRender: ""
    };
  },
  computed: {
    ...mapGetters({
      getActiveToken: "getActiveToken",
      getCredentials: "getCredentials",
      getSignIn: "getSignIn",
      getAccount: "account/getAccount",
      getAvailableTokenList: "account/getAvailableTokenList"
    }),
    currentRoute: function() {
      return this.$route.path;
    },
    title: function() {
      if (this.currentRoute === "/") return "UniswapDEX";
      if (this.currentRoute === "/receivetoken") return "Receive";
      if (this.currentRoute === "/sendtoken") return "Send";
      if (this.currentRoute === "/swaptoken") return "Swap";
      if (this.currentRoute === "/recoverysetup") return "Recovery";
      if (this.currentRoute === "/about") return "About";
      if (this.currentRoute === "/tos") return "Terms of Service";
      if (this.currentRoute === "/backup") return "Account Backup";
      if (this.currentRoute === "/resetpassword") return "Reset Password";
      if (this.currentRoute === "/privatekey") return "Private Key";
      if (this.currentRoute === "/signup") return "Create Wallet";
      if (this.currentRoute === "/signin") return "Sign In";
      if (this.currentRoute === "/metamask") return "Access by MetaMask";
      if (this.currentRoute === "/privatekeysignin")
        return "Private Key Access";
      else return this.getActiveToken;
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
      updateAuthStatus: "updateAuthStatus",
      removeAccount: "account/removeAccount",
      resetAllBalances: "account/resetAllBalances",
      resetTransactionList: "transaction/resetTransactionList",
      resetTokenTransactionList: "transaction/resetTokenTransactionList",
      setRefresher: "account/setRefresher",
      resetTokenList: "account/resetTokenList",
      updateAuthRedirectUrl: "updateAuthRedirectUrl"
    }),
    hideModal(ref) {
      if (this.$refs[ref]) this.$refs[ref].hide();
    },
    showModal(ref) {
      if (this.$refs[ref]) this.$refs[ref].show();
    },
    showPage(name) {
      this.hideModal("settingModal_ref");
      this.pageToRender = name;
      this.showModal("about_tos_modal");
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
    },
    redirect(url) {
      this.$router.push(url);
    },
    onPressBack() {
      if (this.currentRoute === "/tokendetail") {
        this.updateAuthRedirectUrl({
          tokenSubTab: "info"
        });
      }
    },
    closeSigninModal() {
      this.hideModal("about_tos_modal");
      this.pageToRender = "";
    }
  }
};
</script>


<style>
.nav-section {
  display: flex;
  justify-content: center;
  padding: 10px 15px;
  background: #2851e4;
  color: #fff;
  align-self: center;
  width: 100% !important;
  position: fixed;
  z-index: 2000;
  margin: 0;
  height: 64px;
}
.nav-section .title {
  text-align: center;
  flex-grow: 3;
  padding-left: 20px;
  display: flex;
  justify-content: center;
}
.nav-section .title img {
  margin-right: 15px;
  width: 30px;
  height: 30px;
  margin-top: 10px;
}
.nav-section a {
  padding-top: 10px;
}
.logo-container img {
  width: 55px;
}
.setting-container img {
  width: 35px;
  cursor: pointer;
}
.nav-section h4 {
  font-size: 22px;
  padding-top: 10px;
  margin: 0px;
}
#settingModal {
  color: #333;
  position: fixed;
  top: 150px;
  text-align: center;
  z-index: 3000;
}
#settingModal .modal-header {
  background: #2851e4;
  text-align: center;
}
#settingModal .modal-title {
  flex-grow: 2;
}
#settingModal .modal-body {
  padding: 0px;
}
#settingModal .modal-body p {
  padding: 20px 10px;
}
.nav-section .btn-outline-light {
  border: none;
  outline: none;
}
.nav-section .btn-outline-light:active,
.nav-section .btn-outline-light:focus {
  border: none;
  outline: none;
  background: transparent;
  color: #fff;
  box-shadow: none;
}
#settingModal .list-group-item {
  cursor: pointer;
  font-size: 13px;
}
#main-title-no-connection-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
#main-title-no-connection-container .logo-title-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
