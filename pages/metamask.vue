<template>
  <div>
    <Nav/>
    <div id="metamask-section">
      <no-connection/>

      <scale-loader :loading="loading" :color="`red`" :height="`15px`" :width="`5px`"></scale-loader>
      <p v-if="loading" class="status-message">{{statusMessage}}</p>
      <b-alert v-if="errorMessage.length > 0" show fade variant="primary">{{errorMessage}}</b-alert>

      <img src="../assets/metamask.png" alt="metamask logo">

      <!-- ACCESS METAMASK -->
      <b-form @submit="onAccessMetamask">
        <b-form-group>
          <b-form-checkbox
            id="accept-checkbox"
            v-model="isAccepted"
            name="accept-checkbox"
          >I accept the terms and use to access my wallet</b-form-checkbox>
        </b-form-group>
        <div class="submit-button-group">
          <b-button
            type="submit"
            variant="primary"
            id="metamask-access-btn"
            :disabled="!isAccepted"
          >Access Metamask Wallet</b-button>
        </div>
      </b-form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Web3 from "web3";
import bcrypt from "bcryptjs";
import ScaleLoader from "vue-spinner/src/ScaleLoader.vue";
import Nav from "~/components/Nav.vue";
import {
  getWeb3,
  getWeb3Metamask,
  isIos,
  isInStandaloneMode,
  getAllListedToken
} from "../assets/js/utils";
import sjcl from "../assets/js/sjcl.js";
import cryptoUtils from "../assets/js/cryptoUtils.js";
import GDrive from "../assets/js/googleDrive/GDrive.js";
import CONFIG from "../config.js";
import { faExpand } from "@fortawesome/free-solid-svg-icons";

export default {
  components: {
    ScaleLoader,
    Nav
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
      isAccepted: false
    };
  },
  computed: {
    ...mapGetters({
      getAuthRedirectUrl: "getAuthRedirectUrl"
    })
  },
  created: async function() {
    this.web3 = await getWeb3Metamask();
    // this.web3 = await getWeb3();
    // this.web3 = new Web3(Web3.givenProvider || "wss://mainnet.infura.io/ws");
  },
  methods: {
    ...mapActions({
      addAccount: "account/addAccount",
      setAvailableTokenList: "account/setAvailableTokenList",
      updateAuthStatus: "updateAuthStatus",
      updateCredentials: "updateCredentials",
      updateActiveToken: "updateActiveToken",
      updateAuthRedirectUrl: "updateAuthRedirectUrl"
    }),
    redirect(url) {
      this.$router.push(url);
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
        console.log(accounts);
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
      const account = {
        address: metamaskAddress,
        privateKey: null,
        balance: 0,
        type: "metamask"
      };
      this.updateAuthStatus(true);
      this.addAccount(account);
      let { url, token } = this.getAuthRedirectUrl;
      if (url === "/tokendetail" && token !== null) {
        this.updateActiveToken(token);
        this.redirect("/tokendetail");
        this.updateAuthRedirectUrl({ url: "/", token: null });
      } else {
        this.redirect("/");
      }
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
  min-height: 100vh;
  overflow: hidden;
  /* overflow-y: scroll; */
  width: 90vw;
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
  margin: 30px auto;
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
  font-size: 14px;
  font-weight: bold;
  height: 50px;
  color: #fff;
  background-color: #e8811c;
  border-color: #e8811c;
}
#metamask-access-btn:hover {
  background-color: #d36c16;
  border-color: #e8811c;
}
.file-error {
  font-size: 13px;
}
.show-more-option {
  margin: 10px auto;
}
</style>
