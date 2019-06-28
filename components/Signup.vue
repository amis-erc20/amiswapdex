<template>
  <div>
    <div id="signup-section">
      <scale-loader :loading="loading && !success" :color="`red`" :height="`15px`" :width="`5px`"></scale-loader>
      <font-awesome-icon v-if="success" icon="check" size="2x" color="green" align="center"/>
      <p v-if="loading" class="status-message">{{statusMessage}}</p>
      <nuxt-link to="/backup" v-if="success">
        <b-button
          type="button"
          variant="primary"
          class="create-account-success-btn"
        >Backup to Google Drive</b-button>
      </nuxt-link>
      <b-button
        v-if="success"
        @click="onContinueToWallet"
        type="button"
        variant="outline-primary"
        class="create-account-success-btn"
      >Continue to Wallet</b-button>
      <b-form @submit="onCreate" v-if="!loading">
        <b-form-group>
          <label for>Email</label>
          <b-form-input type="email" v-model="form.email" required :state="validateEmail"/>
        </b-form-group>
        <b-form-group>
          <label for>Password</label>
          <b-form-input
            type="password"
            v-model="form.password1"
            required
            :state="validatePassword"
          />
        </b-form-group>
        <b-form-group>
          <label for>Retype Your Password</label>
          <b-form-input
            type="password"
            v-model="form.password2"
            required
            :state="validatePassword"
          />
          <b-form-invalid-feedback :state="validatePassword">{{errorMessage}}</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group>
          <input type="checkbox" v-model="isAccepted">
          <span
            id="metamask-agree-text"
            @click="isAccepted = !isAccepted"
          >To create and use my wallet, I accept the</span>
          <span @click="showTos">
            <em id="link-to-tos">Terms</em>
          </span>
        </b-form-group>
        <div class="submit-button-group">
          <b-button
            type="submit"
            variant="primary"
            id="create-account-btn"
            :disabled="!validateEmail || !validatePassword || !isAccepted || loading"
          >Create Wallet</b-button>
        </div>
      </b-form>
      <!-- Install Modal -->
      <b-modal ref="install_modal" id="install_modal" title="Install Shardus" :hide-footer="true">
        Install this web app on your iPhone: tap
        <strong>share</strong> button and then
        <strong>Add to Homescreen</strong>
      </b-modal>
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
/* eslint-disable */
import { mapGetters, mapActions } from "vuex";
import bcrypt from "bcryptjs";
import ScaleLoader from "vue-spinner/src/ScaleLoader.vue";
import {
  getWeb3,
  normaliseText,
  isIos,
  isInStandaloneMode,
  getTokenHoldingByAnAccount
} from "../assets/js/utils";
import sjcl from "../assets/js/sjcl.js";
import cryptoUtils from "../assets/js/cryptoUtils.js";
import GDrive from "../assets/js/googleDrive/GDrive.js";
import CONFIG from "../config.js";
import Nav from "~/components/Nav.vue";
import Tos from "~/components/Tos.vue";

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
        password2: ""
      },
      loading: false,
      errorMessage: "",
      web3: null,
      statusMessage: "",
      success: false,
      isAccepted: false
    };
  },
  computed: {
    ...mapGetters({
      getSignIn: "getSignIn",
      getAuthRedirectUrl: "getAuthRedirectUrl"
    }),
    validatePassword() {
      let password1 = normaliseText(this.form.password1);
      let password2 = normaliseText(this.form.password2);
      if (password1.length === 0 || password2.length === 0) {
        return false;
      }
      if (password1 !== password2) {
        this.errorMessage = "Passwords do not match each other !";
        return false;
      }
      if (password1.length < 8) {
        this.errorMessage = "Password must be at least 8 characters long";
        return false;
      }
      return true;
    },
    validateEmail() {
      let email = normaliseText(this.form.email);
      if (email.length === 0) {
        return false;
      }
      let regX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let isValid = regX.test(email);
      if (!isValid) {
        this.errorMessage = "Invalid Email Address.";
      }
      return isValid;
    }
  },
  created: async function() {
    this.web3 = await getWeb3();
  },
  mounted: async function() {},
  methods: {
    ...mapActions({
      addAccount: "account/addAccount",
      addToken: "account/addToken",
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
    async createNewAccount() {
      const { address, privateKey } = await this.web3.eth.accounts.create();
      const account = { address, privateKey, balance: 0, type: "crednetials" };
      this.addAccount(account);
      return account;
    },
    async onCreate(evt) {
      this.loading = true;
      this.statusMessage = "Creating a new account";
      evt.preventDefault();
      await this.wait(100);
      const P = this.form.password1;
      const Ps = await cryptoUtils.keyStretchPassword(P, 10000);
      const N = this.form.email;
      const Ns = await cryptoUtils.keyStretchPassword(N, 10000);
      const E = cryptoUtils.getRandomNumber(32); // 32bytes = 256 bits
      const Ep = sjcl.encrypt(Ps, E);

      const newAccount = await this.createNewAccount();
      const D = newAccount.privateKey;
      const De = sjcl.encrypt(E, D);

      localStorage.setItem(
        Ns,
        JSON.stringify({ Ep, De, Ns, backupStatus: false })
      );
      this.updateCredentials({ Ep, De, Ps, E, Ns });
      this.updateAuthStatus(true);
      this.loadWallet(newAccount.address);
      this.success = true;
      this.statusMessage = "Successfully created a new account !";
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
    onContinueToWallet() {
      let { url, token } = this.getAuthRedirectUrl;
      if (url === "/tokendetail" && token !== null) {
        this.updateActiveToken(token);
        this.redirect("/tokendetail");
        this.updateAuthRedirectUrl({ url: "/", token: null });
      } else {
        this.redirect("/");
      }
    },
    comparePassword(password, hash) {
      return bcrypt.compareSync(password, hash);
    },
    async uploadToGDrive(data) {
      try {
        await this.initialGoogle();
        console.log(GDrive.isInitialized());
      } catch (e) {
        console.log(e);
      }
      // console.log(`GDrive.isInitialized()`);
      if (GDrive.isInitialized()) {
        try {
          const Ps = await cryptoUtils.keyStretchPassword(
            this.form.password1,
            10000
          );
          const webWalletFolder = await GDrive.files.safeCreateFolder({
            name: "Shardus-Web-Wallet",
            parents: ["root"]
          });
          console.log(`Created Shardus-Web-Wallet folder...`);
          const accountFolder = await GDrive.files.safeCreateFolder({
            name: Ps,
            parents: [webWalletFolder]
          });
          console.log(`Created account folder ${Ps}`);
          let res = await GDrive.files.createFileMultipart(
            JSON.stringify(data),
            "text/plain",
            {
              // parents: ["root"],
              parents: [accountFolder],
              name: "current"
            }
          );
          if (res.ok) {
            this.success = true;
            this.statusMessage =
              "Your wallet credentials are successfully stored in your Google Drive.";
          } else {
            console.log(res.headers);
            alert(
              "Something went wrong while trying to storage your wallet credentials in your Google Drive"
            );
          }
        } catch (e) {
          console.log(e);
        }
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
    },
    updateSignInStatus(isSignedIn) {
      if (isSignedIn) {
        const token = gapi.auth2
          .getAuthInstance()
          .currentUser.get()
          .getAuthResponse().access_token;
        GDrive.setAccessToken(token);
        this.statusMessage = "Storing credentials in your Google Drive";
        GDrive.init();
      }
    },
    initialGoogle: function() {
      this.statusMessage = "Connecting to Google Account";
      return new Promise((resolve, reject) => {
        try {
          gapi.load("auth2", async () => {
            if (!gapi.auth2.getAuthInstance()) {
              await gapi.auth2.init(CONFIG.googleApiKeys);
            }
            gapi.auth2.getAuthInstance().isSignedIn.listen(isSignedIn => {
              this.updateSignInStatus(isSignedIn);
              resolve();
            });
            if (
              gapi.auth2.getAuthInstance() &&
              !gapi.auth2.getAuthInstance().isSignedIn.get()
            ) {
              try {
                gapi.auth2.getAuthInstance().signIn();
              } catch (e) {
                this.updateSignInStatus(true);
                resolve();
              }
            }
            if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
              this.updateSignInStatus(true);
              resolve();
            }
          });
        } catch (e) {
          console.log(e);
          reject(e);
        }
      });
    }
  }
};
</script>

<style>
#token_info_modal #signup-section {
  width: 100%;
  max-width: 650px;
  margin: 45px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#signup-section img {
  width: 120px;
  text-align: center;
  animation: rotateLogo 14s infinite linear;
}
#signup-section form label {
  font-weight: bolder;
  font-size: 13px;
}
#signup-section form {
  width: 90%;
  max-width: 650px;
  margin: 20px auto;
}
#signup-section p {
  font-size: 12px;
  margin-top: 10px;
}
#create-account-btn {
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  height: 50px;
}
.status-message {
  color: #295469;
  font-size: 12px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 40px;
}
/* #signup-section a button { */
.create-account-success-btn {
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  height: 50px;
  width: 180px;
  margin-bottom: 20px;
  font-size: 13px;
}
@keyframes rotateLogo {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
  }
}
</style>
