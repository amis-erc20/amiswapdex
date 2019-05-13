<template>
  <div>
    <Nav/>
    <div id="signin-section">
      <no-connection/>
      <h6>Please provide your private key to access your wallet</h6>
      <scale-loader :loading="loading" :color="`red`" :height="`15px`" :width="`5px`"></scale-loader>
      <p v-if="loading" class="status-message">{{statusMessage}}</p>
      <b-alert v-if="errorMessage.length > 0" show fade variant="primary">{{errorMessage}}</b-alert>

      <!-- PRIVATE KEY SIGN IN -->
      <b-form @submit="onSubmitPrivateKey">
        <b-form-group>
          <b-form-input type="text" v-model="form.privateKey" placeholder="Private Key" required/>
        </b-form-group>
        <div class="submit-button-group">
          <b-button type="submit" variant="primary" id="signin-btn">Access Wallet</b-button>
        </div>
      </b-form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import bcrypt from "bcryptjs";
import ScaleLoader from "vue-spinner/src/ScaleLoader.vue";
import Nav from "~/components/Nav.vue";
import {
  getWeb3,
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
        privateKey: ""
      },
      loading: false,
      errorMessage: "",
      web3: null,
      statusMessage: "",
      credentials: null,
      Ns: null
    };
  },
  computed: {},
  created: async function() {
    this.web3 = await getWeb3();
  },
  methods: {
    ...mapActions({
      addAccount: "account/addAccount",
      setAvailableTokenList: "account/setAvailableTokenList",
      updateAuthStatus: "updateAuthStatus",
      updateCredentials: "updateCredentials"
    }),
    redirect(url) {
      this.$router.push(url);
    },
    async getAccountFromPrivateKey(key) {
      const {
        address,
        privateKey
      } = await this.web3.eth.accounts.privateKeyToAccount(key);
      const account = { address, privateKey, balance: 0, type: "private_key" };
      return account;
    },
    async onSubmitPrivateKey(evt) {
      evt.preventDefault();
      this.loading = true;
      await this.wait(100);
      this.statusMessage = "Retrieving your wallet using your private key...";
      await this.signIn();
      this.loading = false;
    },
    async signIn() {
      try {
        const account = await this.getAccountFromPrivateKey(
          this.form.privateKey
        );
        account.type = "private_key";
        this.addAccount(account);
        this.updateAuthStatus(true);
        this.redirect("/");
      } catch (e) {
        console.log(e);
        console.log(`Invalid Private Key`);
        this.form.privateKey = "";
        this.loading = false;
        this.errorMessage = "Invalid Private Key. Try Again";
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
#signin-section {
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
#signin-section img {
  width: 120px;
  text-align: center;
  animation: rotateLogo 14s infinite linear;
}
#signin-section h4 {
  margin: 30px auto;
}
#signin-section form label {
  font-weight: bolder;
  font-size: 13px;
}
#signin-section form {
  width: 90%;
}
#signin-section p {
  font-size: 12px;
  margin-top: 10px;
}
.alert {
  font-size: 12px;
  width: 100%;
  max-width: 450px;
}
#signin-btn {
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  height: 50px;
}
@keyframes rotateLogo {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
  }
}
.file-error {
  font-size: 13px;
}
.show-more-option {
  margin: 10px auto;
}
</style>
