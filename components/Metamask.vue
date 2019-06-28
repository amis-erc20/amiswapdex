<template>
  <div>
    <div id="metamask-section">
      <scale-loader :loading="loading" :color="`red`" :height="`15px`" :width="`5px`"></scale-loader>
      <p v-if="loading" class="status-message">{{statusMessage}}</p>
      <b-alert v-if="errorMessage.length > 0" show fade variant="danger">{{errorMessage}}</b-alert>

      <img src="../assets/metamask.png" alt="metamask logo">

      <!-- ACCESS METAMASK -->
      <b-form @submit="onAccessMetamask" v-if="shouldRender && !loading">
        <b-form-group>
          <!-- <b-form-checkbox
            id="accept-checkbox"
            v-model="isAccepted"
            name="accept-checkbox"
          >I accept the terms and use to access my wallet</b-form-checkbox>-->
          <input type="checkbox" v-model="isAccepted">
          <span
            id="metamask-agree-text"
            @click="isAccepted = !isAccepted"
          >To access my wallet, I accept the</span>
          <span @click="showTos">
            <em id="link-to-tos">Terms</em>
          </span>
        </b-form-group>
        <div class="submit-button-group">
          <b-button
            type="submit"
            variant="primary"
            :disabled="!isAccepted"
            id="metamask-access-btn"
          >Access Metamask Wallet</b-button>
        </div>
        <!-- :disabled="!isAccepted" -->
      </b-form>

      <!-- TOS Modal -->
      <b-modal ref="about_tos_modal" id="about_tos_modal" :hide-footer="true">
        <template slot="modal-header">
          <font-awesome-icon
            class="back-button-svg"
            icon="chevron-left"
            size="2x"
            color="#fff"
            @click="closeTos"
          />
          <div id="main-title-no-connection-container">
            <h4>Term of Services</h4>
          </div>
        </template>
        <Tos/>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Web3 from "web3";
import bcrypt from "bcryptjs";
import ScaleLoader from "vue-spinner/src/ScaleLoader.vue";
import Nav from "~/components/Nav.vue";
import Tos from "~/components/Tos.vue";
import {
  getWeb3,
  getWeb3Metamask,
  isIos,
  isInStandaloneMode,
  getAllListedToken,
  getTokenHoldingByAnAccount
} from "../assets/js/utils";
import sjcl from "../assets/js/sjcl.js";
import cryptoUtils from "../assets/js/cryptoUtils.js";
import GDrive from "../assets/js/googleDrive/GDrive.js";
import CONFIG from "../config.js";
import { faExpand } from "@fortawesome/free-solid-svg-icons";

export default {
  components: {
    ScaleLoader,
    Nav,
    Tos
  },
  data() {
    return {
      form: {
        email: "",
        password1: "",
        file: null
      },
      loading: false,
      errorMessage: "",
      web3: null,
      statusMessage: "",
      credentials: null,
      isAccepted: false,
      shouldRender: true
    };
  },
  computed: {
    ...mapGetters({
      getAuthRedirectUrl: "getAuthRedirectUrl"
    })
  },
  created: async function() {
    this.web3 = await getWeb3Metamask();
    if (this.web3 === null) {
      this.errorMessage =
        "No Matamask extension or Metamask web3 instance is overwritten by an another wallet extension. Please disable other wallet extensions";
      this.shouldRender = false;
    }
  },
  methods: {
    ...mapActions({
      addAccount: "account/addAccount",
      addToken: "account/addToken",
      setAvailableTokenList: "account/setAvailableTokenList",
      setOwnedTokenList: "account/setOwnedTokenList",
      updateAuthStatus: "updateAuthStatus",
      updateCredentials: "updateCredentials",
      updateActiveToken: "updateActiveToken",
      updateAuthRedirectUrl: "updateAuthRedirectUrl"
    }),
    redirect(url) {
      this.$router.push(url);
    },
    showTos() {
      this.showModal("about_tos_modal");
    },
    closeTos() {
      this.hideModal("about_tos_modal");
    },
    async getAccountFromPrivateKey(key) {
      const {
        address,
        privateKey
      } = await this.web3.eth.accounts.privateKeyToAccount(key);
      const account = { address, privateKey, balance: 0 };
      return account;
    },
    async isLoggedIn() {
      let accounts;
      try {
        accounts = await this.web3.eth.getAccounts();
      } catch (e) {
        console.log(e);
        console.log("Cannot get wallet account. Please log into metamask");
        return false;
      }
      if (accounts && accounts.length > 0) return accounts[0];
      else return false;
    },
    async initiateMetamsk() {
      try {
        await window.ethereum.enable();
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    async onAccessMetamask(evt) {
      evt.preventDefault();
      this.loading = true;
      await this.wait(100);
      try {
        this.statusMessage = "Requesting Metamask Access...";
        let isInitiated = await this.initiateMetamsk();
        if (isInitiated) {
          let metamaskAddress = await this.isLoggedIn();
          console.log(`Metamask Address is: ${metamaskAddress}`);

          if (metamaskAddress) {
            this.signIn(metamaskAddress);
          } else {
            alert("NO METAMASK ACCOUNT");
          }
        }
      } catch (e) {
        console.log(e);
        this.loading = false;
        this.errorMessage = "Cannot access Meatamask extension";
        return;
      }
      this.loading = false;
    },
    async signIn(metamaskAddress) {
      let self = this;
      const account = {
        address: metamaskAddress,
        privateKey: null,
        balance: 0,
        type: "metamask"
      };
      this.updateAuthStatus(true);
      this.addAccount(account);
      this.loadWallet(metamaskAddress);
      // let { url, token } = this.getAuthRedirectUrl;
      // if (url === "/tokendetail" && token !== null) {
      //   this.updateActiveToken(token);
      //   this.redirect("/tokendetail");
      //   this.updateAuthRedirectUrl({ url: "/", token: null });
      // } else {
      //   this.redirect("/");
      // }
    },
    async loadWallet(address) {
      let self = this;
      let ownedTokenList = await getTokenHoldingByAnAccount(address);
      ownedTokenList.forEach(token => {
        self.addToken(token);
      });
      self.setOwnedTokenList(ownedTokenList);
      console.log("Wallet loaded.");
    },
    showModal(ref) {
      this.$refs[ref].show();
    },
    hideModal(ref) {
      this.$refs[ref].hide();
    },
    wait(ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, ms);
      });
    }
  }
};
</script>

<style>
#metamask-section {
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#metamask-section img {
  width: 150px;
  text-align: center;
  margin: 30px auto;
}
#metamask-section h4 {
  /* margin: 30px auto; */
}
#metamask-section form label {
  font-weight: bolder;
  font-size: 13px;
  padding-top: 5px;
}
#metamask-section form {
  width: 90%;
}
#metamask-section p {
  font-size: 12px;
  margin-top: 10px;
}
.alert {
  font-size: 12px;
  width: 100%;
  max-width: 450px;
}
#metamask-access-btn {
  width: 100%;
  font-size: 13px;
  font-weight: bold;
  height: 50px;
  color: #fff;
  background-color: #773894;
  border-color: #773894;
}
#metamask-access-btn:hover {
  background-color: #773894;
  border-color: #773894;
}
#metamask-agree-text {
  cursor: pointer;
}
#link-to-tos {
  color: #773894;
  cursor: pointer;
}
/* #metamask-section #tos-description {
  position: relative;
  top: 0px;
}
#metamask-section .tos-view {
  overflow: hidden;
} */
</style>
