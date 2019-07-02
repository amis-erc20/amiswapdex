<template>
  <div>
    <div id="admin-login-section">
      <scale-loader :loading="loading" :color="`red`" :height="`15px`" :width="`5px`"></scale-loader>
      <p v-if="loading" class="status-message">{{statusMessage}}</p>
      <b-alert v-if="errorMessage.length > 0" show fade variant="primary">{{errorMessage}}</b-alert>


      <!-- LOCAL SIGN IN -->
      <h3>Admin Log In</h3>
      <b-form @submit="onLocalSignIn " v-if="downloadMethod === 'local' && !loading">
        <b-form-group>
          <label for>Username</label>
          <b-form-input type="text" v-model="form.username" required/>
        </b-form-group>
        <b-form-group>
          <label for>Password</label>
          <b-form-input type="password" v-model="form.password1" required/>
        </b-form-group>
        <div class="submit-button-group">
          <b-button
            type="submit"
            variant="primary"
            id="signin-btn"
          >Log In</b-button>
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
import Tos from "~/components/Tos.vue";
import {
  getWeb3,
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
      downloadMethod: "local",
      selected: "remote",
      isFileValid: false,
      showMoreOptions: false,
      Ns: null,
      isAccepted: false
    };
  },
  computed: {
    ...mapGetters({
      getSignIn: "getSignIn",
      getAuthRedirectUrl: "getAuthRedirectUrl"
    }),
    shouldDisableButton() {
      let valid =
        this.validateEmail(this.form.email) &&
        this.validatePassword(this.form.password1) &&
        this.isAccepted;
      // console.log(valid);
      return !valid;
    }
  },
  created: async function() {
    this.web3 = await getWeb3();
  },
  methods: {
    ...mapActions({
      addAccount: "account/addAccount",
      addToken: "account/addToken",
      setOwnedTokenList: "account/setOwnedTokenList",
      setAvailableTokenList: "account/setAvailableTokenList",
      updateAuthStatus: "updateAuthStatus",
      updateCredentials: "updateCredentials",
      updateActiveToken: "updateActiveToken",
      updateAuthRedirectUrl: "updateAuthRedirectUrl",
      adminLogIn: "adminLogIn"
    }),
    validateEmail(email) {
      if (!email) return false;
      if (email.length > 0) return true;
      return false;
    },
    validatePassword(password) {
      if (!password) return false;
      if (password.length > 0) return true;
      return false;
    },
    showTos() {
      this.showModal("about_tos_modal");
    },
    closeTos() {
      this.hideModal("about_tos_modal");
    },
    redirect(url) {
      this.$router.push(url);
    },
    async getAccountFromPrivateKey(key) {
      const {
        address,
        privateKey
      } = await this.web3.eth.accounts.privateKeyToAccount(key);
      const account = { address, privateKey, balance: 0, type: "credentials" };
      return account;
    },
    onChangeShowMore(e) {
      if (e) this.downloadMethod = "remote";
      else this.downloadMethod = "local";
    },
    onSelectRemote(e) {
      this.downloadMethod = "remote";
    },
    onSelectUpload(e) {
      this.downloadMethod = "upload";
    },
    onSelectLocal(e) {
      this.downloadMethod = "local";
      this.showMoreOptions = false;
    },
    onFileChange(event) {
      let file = event.target.files[0];
      let reader = new FileReader();
      let self = this;
      reader.readAsText(file);
      reader.onload = function(e) {
        try {
          self.credentials = JSON.parse(e.target.result);
          let { De, Ep } = self.credentials;
          if (De !== undefined && Ep !== undefined) self.isFileValid = true;
        } catch (e) {
          console.log(e);
          self.isFileValid = false;
        }
      };
    },
    async onLocalSignIn(evt) {
      evt.preventDefault();
        if (this.form.username === CONFIG.adminUsername && this.form.password1=== CONFIG.adminPassword) {
            console.log('password correct')
            this.adminLogIn(true)
            this.$router.push('/')
        } else {
            console.log(this.form)
            alert('wrong username or password')
        }
    },
    async onRemoteSignIn(evt) {
      evt.preventDefault();
      this.loading = true;
      await this.wait(100);
      this.credentials = await this.downloadFromGDrive();
      if (!this.credentials) {
        return;
      }
      await this.signIn();
      this.loading = false;
    },
    async onUploadSignIn(evt) {
      evt.preventDefault();
      this.loading = true;
      await this.wait(100);
      await this.signIn();
      this.loading = false;
    },
    async signIn() {
      try {
        const P = this.form.password1;
        let { Ep, De } = this.credentials;
        const Ps = await cryptoUtils.keyStretchPassword(P, 10000);
        const E = sjcl.decrypt(Ps, Ep);
        const D = sjcl.decrypt(E, De); // D = privateKey
        const account = await this.getAccountFromPrivateKey(D);
        account.type = "credentials";
        this.addAccount(account);
        this.updateAuthStatus(true);
        if (this.downloadMethod === "remote")
          localStorage.setItem(
            this.Ns,
            JSON.stringify({ Ep, De, Ns: this.Ns, backupStatus: true })
          );
        else if (this.downloadMethod === "upload") {
          localStorage.setItem(
            this.Ns,
            JSON.stringify({ Ep, De, Ns: this.Ns, backupStatus: false })
          );
        }
        this.updateCredentials({ Ep, De, Ns: this.Ns, E, Ps });
        this.loadWallet(account.address);
      } catch (e) {
        console.log(e);
        console.log(`Incorrect Password`);
        this.form.password1 = "";
        this.loading = false;
        this.errorMessage = "Incorrect Password. Try Again";
      }
    },
    comparePassword(password, hash) {
      return bcrypt.compareSync(password, hash);
    },
    async downloadFromGDrive() {
      this.statusMessage = "Connectiong to Google Account";
      await this.initialGoogle();
      if (GDrive.isInitialized()) {
        this.statusMessage = "Fetching wallet credentials from Google Drive";
        try {
          this.Ns = await cryptoUtils.keyStretchPassword(
            this.form.email,
            10000
          );
          let webWalletFolder;
          let accountFolder;
          let fileId;
          webWalletFolder = await GDrive.files.getId(
            "Shardus-Web-Wallet",
            [`root`],
            GDrive.files.mimeFolder
          );
          accountFolder = await GDrive.files.getId(
            this.Ns,
            [webWalletFolder],
            GDrive.files.mimeFolder
          );
          fileId = await GDrive.files.getId(
            "current",
            [accountFolder],
            "text/plain"
          );
          console.log(`Fild Id is ${fileId}`);
          let res = await GDrive.files.get(fileId, {
            alt: "media"
          });
          if (res.ok) {
            let data = await res.json();
            return data;
          } else {
            console.log(e);
            this.form.password1 = "";
            this.loading = false;
            this.errorMessage =
              "Something went wrong while trying to import your wallet credentials from Google Drive";
          }
        } catch (e) {
          console.log(e);
          this.form.password1 = "";
          this.loading = false;
          this.errorMessage =
            "Unable to download wallet credential file associated to entered password !";
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
    async loadWallet(address) {
      let self = this;
      let ownedTokenList = await getTokenHoldingByAnAccount(address);
      ownedTokenList.forEach(token => {
        self.addToken(token);
      });
      self.setOwnedTokenList(ownedTokenList);
      console.log("Wallet loaded.");
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
#admin-login-section {
  width: 400px;
  height: 100vh;
  max-width: 650px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#admin-login-section img {
  width: 120px;
  text-align: center;
  animation: rotateLogo 14s infinite linear;
}
#admin-login-section h4 {
  margin: 0px auto;
}
#admin-login-section form label {
  font-weight: bolder;
  font-size: 13px;
}
#admin-login-section form {
  width: 90%;
}
#admin-login-section p {
  font-size: 12px;
  margin-top: 10px;
}
.alert {
  font-size: 12px;
  width: 100%;
  max-width: 650px;
  margin: 10px auto;
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
#admin-login-section div {
  text-align: left;
  margin: 5px auto;
}
.more-options-container label,
.show-more-option label {
  padding-top: 5px;
}
#signin_modal {
  padding-left: 0 !important;
}
</style>
