<template>
  <div class="nav-section">
    <nuxt-link to="/" v-if="currentRoute !== '/'">
      <font-awesome-icon icon="chevron-left" size="lg" color="#fff"/>
    </nuxt-link>
    <h4 class="title">{{ title }}</h4>

    <b-button v-b-modal.settingModal variant="outline-light">
      <font-awesome-icon icon="bars" size="lg" color="#fff"/>
    </b-button>

    <b-modal ref="settingModal_ref" id="settingModal" title="Wallet Setting" :hide-footer="true">
      <b-list-group v-if="getSignIn">
        <b-list-group-item @click="redirect('/backup')">Remote Backup to Google Drive</b-list-group-item>
        <b-list-group-item @click="redirect('/recoverysetup')">Setup Recovery Q & A</b-list-group-item>
        <b-list-group-item @click="redirect('/resetpassword')">Change Password</b-list-group-item>
        <b-list-group-item @click="redirect('/privatekey')">Show Private Key</b-list-group-item>
        <b-list-group-item @click="redirect('/about')">About</b-list-group-item>
        <b-list-group-item @click="redirect('/tos')">Terms of Services</b-list-group-item>
        <b-list-group-item @click="onLogout">Log Out</b-list-group-item>
      </b-list-group>
      <p v-else>Please sign into your wallet first.</p>
    </b-modal>
    <no-connection/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import cryptoUtils from "../assets/js/cryptoUtils.js";
export default {
  computed: {
    ...mapGetters({
      getActiveToken: "getActiveToken",
      getCredentials: "getCredentials",
      getSignIn: "getSignIn"
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
      else return this.getActiveToken;
    }
  },
  methods: {
    ...mapActions({
      updateAuthStatus: "updateAuthStatus",
      removeAccount: "account/removeAccount",
      resetAllBalances: "account/resetAllBalances",
      resetTransactionList: "transaction/resetTransactionList",
      resetTokenTransactionList: "transaction/resetTokenTransactionList"
    }),
    onLogout() {
      this.updateAuthStatus(false);
      this.removeAccount();
      this.resetAllBalances();
      this.resetTransactionList();
      this.resetTokenTransactionList();
      // localStorage.removeItem("credentials");
      this.$router.push("/");
    },
    redirect(url) {
      this.$router.push(url);
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
}
.nav-section .title {
  text-align: center;
  flex-grow: 3;
  padding-left: 20px;
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
}
#settingModal {
  color: #333;
  position: fixed;
  top: 150px;
  text-align: center;
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
</style>
