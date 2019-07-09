<template>
  <div class="nav-section">
    <nuxt-link to="/" v-if="currentRoute !== '/'">
      <font-awesome-icon icon="chevron-left" size="2x" color="#fff" @click="onPressBack" />
    </nuxt-link>
    <div class="title">
      <div id="main-title-no-connection-container">
        <div class="logo-title-container">
          <img id="uniswapdex-logo" src="../assets/uniswapdex-logo.png" alt />
          <h4>{{ title }}</h4>
        </div>
        <no-connection />
      </div>
    </div>
    <b-button v-b-modal.settingModal variant="outline-light">
      <font-awesome-icon icon="bars" size="2x" color="#fff" />
    </b-button>
    <b-modal ref="settingModal_ref" id="settingModal" title="Options" :hide-footer="true">
      <b-list-group v-if="getSignIn">
        <b-list-group-item
          v-if="getAccount.type === 'credentials'"
          @click="showPage('backup')"
        >Remote Backup to Google Drive</b-list-group-item>
        <b-list-group-item
          v-if="getAccount.type === 'credentials'"
          @click="showPage('recoverysetup')"
        >Setup Recovery Q & A</b-list-group-item>
        <b-list-group-item
          v-if="getAccount.type === 'credentials'"
          @click="showPage('reset_password')"
        >Change Password</b-list-group-item>
        <b-list-group-item
          v-if="getAccount.type === 'credentials' || getAccount.type === 'private_key'"
          @click="showPage('private')"
        >Show Private Key</b-list-group-item>
        <b-list-group-item @click="showPage('about')">About</b-list-group-item>
        <b-list-group-item @click="showPage('tos')">Terms of Services</b-list-group-item>
        <b-list-group-item @click="onLogout">Log Out</b-list-group-item>
      </b-list-group>
      <b-list-group v-else>
        <b-list-group-item @click="showPage('about')">About</b-list-group-item>
        <b-list-group-item @click="showPage('tos')">Terms of Services</b-list-group-item>
        <b-list-group-item>
          <a href="https://gitlab.com/shardus/uniswapdex/issues/new" target="_blank">Report Issues</a>
        </b-list-group-item>
      </b-list-group>
    </b-modal>
    <!-- Metamask Modal -->
    <b-modal ref="about_tos_modal" id="about_tos_modal" :hide-footer="true">
      <template slot="modal-header">
        <font-awesome-icon
          class="back-button-svg"
          icon="chevron-left"
          size="2x"
          color="#fff"
          @click="closeSigninModal"
        />
        <div id="main-title-no-connection-container">
          <h4 v-if="pageToRender === 'backup'">Remote Backup</h4>
          <h4 v-if="pageToRender === 'recoverysetup'">Recovery</h4>
          <h4 v-if="pageToRender === 'reset_password'">Reset Password</h4>
          <h4 v-if="pageToRender === 'private'">Private Key</h4>
          <h4 v-if="pageToRender === 'about'">About UniswapDex</h4>
          <h4 v-if="pageToRender === 'tos'">Term of Services</h4>
        </div>
      </template>
      <Backup v-if="pageToRender === 'backup'" />
      <Recoverysetup v-if="pageToRender === 'recoverysetup'" />
      <Resetpassword v-if="pageToRender === 'reset_password'" />
      <Private v-if="pageToRender === 'private'" />
      <About v-if="pageToRender === 'about'" />
      <Tos v-if="pageToRender === 'tos'" />
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import cryptoUtils from "../assets/js/cryptoUtils.js";
import Tos from "~/components/Tos.vue";
import About from "~/components/About.vue";
import Private from "~/components/Private.vue";
import Backup from "~/components/Backup.vue";
import Resetpassword from "~/components/Resetpassword.vue";
import Recoverysetup from "~/components/Recoverysetup.vue";
export default {
  components: {
    Tos,
    About,
    Private,
    Backup,
    Resetpassword,
    Recoverysetup
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
  background: #ffffff;
  color: #333;
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
  font-size: 20px;
  padding-top: 3px;
  margin: 0px;
  color: #a41de4;
  font-weight: bold;
}
#settingModal {
  color: #333;
  position: fixed;
  top: 150px;
  text-align: center;
  z-index: 3000;
}
#settingModal .modal-header {
  background: #773894;
  text-align: center;
}
#settingModal .modal-title {
  flex-grow: 2;
  color: #fff;
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
.nav-section .btn-outline-light svg {
  color: #a41de4;
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
#settingModal .list-group-item a {
  cursor: pointer;
  font-size: 13px;
  color: #333;
  text-decoration: none;
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
#main-title-no-connection-container .logo-title-container h4 {
  font-size: 18px;
  font-weight: bold;
}
#uniswapdex-logo {
  width: 40px;
  height: 29px;
  margin: 0;
  margin-right: 10px;
  position: relative;
  top: -5px;
}
</style>
