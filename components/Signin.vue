<template>
  <div>
    <div id="signin-section">
      <scale-loader :loading="loading" :color="`red`" :height="`15px`" :width="`5px`"></scale-loader>
      <p v-if="loading" class="status-message">{{statusMessage}}</p>
      <b-alert v-if="errorMessage.length > 0" show fade variant="primary">{{errorMessage}}</b-alert>

      <b-form-group v-if="downloadMethod !== `local` && !loading">
        <b-form-radio
          value="remote"
          v-model="selected"
          name="some-radios"
          @change="onSelectRemote"
        >Download from Google Drive</b-form-radio>
        <b-form-radio
          value="upload"
          v-model="selected"
          name="some-radios"
          @change="onSelectUpload"
        >Import from computer</b-form-radio>
        <b-form-radio
          value="local"
          v-model="selected"
          name="some-radios"
          @change="onSelectLocal"
        >Local Sign In</b-form-radio>
      </b-form-group>

      <!-- LOCAL SIGN IN -->
      <b-form @submit="onLocalSignIn " v-if="downloadMethod === 'local' && !loading">
        <b-form-group>
          <label for>Email</label>
          <b-form-input type="email" v-model="form.email" required/>
        </b-form-group>
        <b-form-group>
          <label for>Password</label>
          <b-form-input type="password" v-model="form.password1" required/>
        </b-form-group>
        <div class="submit-button-group">
          <b-button type="submit" variant="primary" id="signin-btn">Sign In</b-button>
        </div>
      </b-form>

      <!-- REMOTE SIGN IN -->
      <b-form @submit="onRemoteSignIn " v-if="downloadMethod === 'remote' && !loading">
        <b-form-group>
          <label for>Email</label>
          <b-form-input type="email" v-model="form.email" required/>
        </b-form-group>
        <b-form-group>
          <label for>Password</label>
          <b-form-input type="password" v-model="form.password1" required/>
        </b-form-group>

        <div class="submit-button-group">
          <b-button type="submit" variant="primary" id="signin-btn">Sign In with Google Drive</b-button>
        </div>
      </b-form>
      <!-- FILE UPLOAD -->
      <b-form @submit="onUploadSignIn " v-if="downloadMethod === 'upload' && !loading">
        <b-form-group>
          <label for>Email</label>
          <b-form-input type="email" v-model="form.email" required/>
        </b-form-group>
        <b-form-group>
          <label for>Password</label>
          <b-form-input type="password" v-model="form.password1" required/>
        </b-form-group>
        <b-form-group>
          <b-form-file
            v-model="form.file"
            :state="isFileValid"
            placeholder="Choose credential file..."
            drop-placeholder="Drop file here..."
            accept=".txt"
            @change="onFileChange"
          />
          <!-- <div class="mt-3">Selected file: {{ form.file ? form.file.name : '' }}</div> -->
          <div class="file-error" v-if="isFileValid">File is valid.</div>
          <div class="file-error" v-if="!isFileValid">Invalid File</div>
        </b-form-group>

        <div class="submit-button-group">
          <b-button
            type="submit"
            variant="primary"
            id="signin-btn"
            :disabled="!isFileValid"
          >Import & Sign In</b-button>
        </div>
      </b-form>

      <b-form-group class="show-more-option" v-if="!loading">
        <b-form-checkbox
          switch
          v-model="showMoreOptions"
          name="check-button"
          @change="onChangeShowMore"
        >Show more sign in options</b-form-checkbox>
      </b-form-group>

      <p v-if="!loading">
        Don't have an account ? Please
        <nuxt-link to="/signup">sign up</nuxt-link>. If you forget your password,
        <nuxt-link to="/recovery">recover{{" "}}</nuxt-link>your account here
      </p>
      <!-- Install Modal -->
      <b-modal ref="install_modal" id="install_modal" title="Install Shardus" :hide-footer="true">
        Install this web app on your iPhone: tap
        <strong>share</strong> button and then
        <strong>Add to Homescreen</strong>
      </b-modal>
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
      downloadMethod: "local",
      selected: "remote",
      isFileValid: false,
      showMoreOptions: false,
      Ns: null
    };
  },
  computed: {
    ...mapGetters({
      getSignIn: "getSignIn",
      getAuthRedirectUrl: "getAuthRedirectUrl"
    })
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
      updateAuthRedirectUrl: "updateAuthRedirectUrl"
    }),
    validatePassword() {
      if (this.form.password1 !== this.form.password2) {
        this.errorMessage = "Passwords do not match each other !";
        return false;
      }
      if (this.form.password1.length < 4) {
        this.errorMessage = "Password must be at least 4 characters long";
        return false;
      }
      return true;
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
      this.loading = true;
      await this.wait(100);
      try {
        this.statusMessage =
          "Loading login credentials from your device storage...";
        this.Ns = await cryptoUtils.keyStretchPassword(this.form.email, 10000);
        this.credentials = JSON.parse(localStorage.getItem(this.Ns));
        this.downloadMethod = "local";
      } catch (e) {
        console.log(e);
        this.form.password1 = "";
        this.loading = false;
        this.errorMessage =
          "Cannot find login credentials stored in your device";
        return;
      }
      if (!this.credentials) {
        this.form.password1 = "";
        this.loading = false;
        this.errorMessage =
          "Cannot find login credentials stored in your device. Please select a method to load your credential file";
        this.downloadMethod = "remote";
        return;
      }
      await this.signIn();
      this.loading = false;
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
        // let { url, token } = this.getAuthRedirectUrl;
        // if (url === "/tokendetail" && token !== null) {
        //   this.updateActiveToken(token);
        //   this.redirect("/tokendetail");
        //   this.updateAuthRedirectUrl({ url: "/", token: null });
        // } else {
        //   this.redirect("/");
        // }
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
            console.log(data);
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
#signin-section {
  width: 100%;
  overflow: hidden;
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
#signin-section div {
  text-align: left;
  margin: 5px auto;
}
</style>
