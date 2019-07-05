// P = user password
<template>
  <div class="reset-container">
    <Nav></Nav>
    <div v-if="!getConnection" class="no-internet-description">
      <p>No Internet Connection</p>
    </div>
    <div id="reset-section" v-if="getConnection">
      <scale-loader :loading="loading && !success" :color="`red`" :height="`15px`" :width="`5px`"></scale-loader>
      <font-awesome-icon v-if="success" icon="check" size="2x" color="green" />
      <p v-if="loading || success" class="status-message">{{statusMessage}}</p>
      <nuxt-link to="/" v-if="success">
        <b-button type="button" variant="primary" id="create-account-btn">Go Back</b-button>
      </nuxt-link>

      <!-- New Password Form -->
      <b-form @submit="onUpdatePassword" v-if="loading !== true && success === false">
        <b-alert
          v-if="resetErrorMessage.length > 0"
          show
          fade
          variant="primary"
        >{{resetErrorMessage}}</b-alert>
        <!-- <b-form-group>
          <label for>Email</label>
          <b-form-input type="email" v-model="form.email" required/>
        </b-form-group>-->
        <b-form-group>
          <label for>Current Password</label>
          <b-form-input type="password" v-model="form.currentPassword" required />
        </b-form-group>
        <b-form-group>
          <label for>New Password</label>
          <b-form-input
            type="password"
            v-model="form.password1"
            required
            :state="validatePassword()"
          />
        </b-form-group>
        <b-form-group>
          <label for>Retype New Password</label>
          <b-form-input
            type="password"
            v-model="form.password2"
            required
            :state="validatePassword()"
          />
          <b-form-invalid-feedback :state="validatePassword()">{{errorMessage}}</b-form-invalid-feedback>
        </b-form-group>
        <div class="submit-button-group">
          <b-button
            type="submit"
            variant="primary"
            id="create-account-btn"
            :disabled="!validatePassword() || loading"
          >Reset Password</b-button>
        </div>
      </b-form>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters, mapActions } from "vuex";
import bcrypt from "bcryptjs";
import ScaleLoader from "vue-spinner/src/ScaleLoader.vue";
import Nav from "~/components/Nav.vue";
import { getWeb3, normaliseText } from "../assets/js/utils";
import sjcl from "../assets/js/sjcl.js";
import cryptoUtils from "../assets/js/cryptoUtils.js";
import GDrive from "../assets/js/googleDrive/GDrive.js";
import { normalizeUnits } from "moment";
import CONFIG from "../config.js";

export default {
  components: {
    ScaleLoader,
    Nav
  },
  data() {
    return {
      form: {
        email: "",
        currentPassword: "",
        password1: "",
        password2: ""
      },
      loading: false,
      errorMessage: "",
      resetErrorMessage: "",
      web3: null,
      statusMessage: "",
      success: false
    };
  },
  computed: {
    ...mapGetters({
      getSignIn: "getSignIn",
      getConnection: "getConnection",
      getCredentials: "getCredentials"
    })
  },
  created: async function() {
    this.web3 = await getWeb3();
  },
  mounted: async function() {},
  methods: {
    ...mapActions({
      addAccount: "account/addAccount",
      updateAuthStatus: "updateAuthStatus"
    }),
    redirect(url) {
      this.$router.push(url);
    },
    async onUpdatePassword(evt) {
      this.loading = true;
      this.statusMessage = "Updating Password";
      evt.preventDefault();
      await this.wait(100);
      try {
        const P = this.form.currentPassword;
        const Pn = this.form.password1;
        if (P === Pn) {
          this.resetErrorMessage = "New password is same as current password";
          this.clearPasswords();
          this.loading = false;
          return;
        }

        const Ps = await cryptoUtils.keyStretchPassword(P, 10000);
        let { E, Ns } = this.getCredentials;
        let { Ep, De } = await this.downloadFromGDrive(Ns);
        const E2 = sjcl.decrypt(Ps, Ep);
        if (E2 !== E) {
          this.resetErrorMessage = "Incorrect current password !";
          this.clearPasswords();
          this.loading = false;
          return;
        }
        const newPs = await cryptoUtils.keyStretchPassword(Pn, 10000);
        const newEp = sjcl.encrypt(newPs, E);

        await this.uploadToGDrive({ Ep: newEp, De }, Ns);
        localStorage.setItem(
          Ns,
          JSON.stringify({ Ep: newEp, De, Ns, backupStatus: true })
        );
        this.updateCredentials({ E, Ep: newEp, De, Ns });
        this.statusMessage = "Successfully updated your password !";
        this.loading = false;
      } catch (e) {
        console.log(e);
        this.resetErrorMessage = "Incorrect current password !";
        this.clearPasswords();
        this.loading = false;
      }
    },
    validatePassword() {
      let password1 = normaliseText(this.form.password1);
      let password2 = normaliseText(this.form.password2);
      if (password1 !== password2) {
        this.errorMessage = "New Passwords do not match each other !";
        return false;
      }
      if (password1.length < 8) {
        this.errorMessage = "Passwords must be at least 8 characters long";
        return false;
      }
      return true;
    },
    validateCurrentPassword() {
      if (this.form.currentPassword.length < 8) {
        this.errorMessage =
          "Current Password must be at least 8 characters long";
        return false;
      }
      return true;
    },
    async getAccountFromPrivateKey(key) {
      const {
        address,
        privateKey
      } = await this.web3.eth.accounts.privateKeyToAccount(key);
      const account = { address, privateKey, balance: 0 };
      return account;
    },
    clearPasswords() {
      this.form.currentPassword = "";
      this.form.password1 = "";
      this.form.password2 = "";
    },
    async deleteOldFile(Ns) {
      this.statusMessage = "Removing old file...";
      let webWalletFolder = await GDrive.files.getId(
        "Shardus-Web-Wallet",
        [`root`],
        GDrive.files.mimeFolder
      );
      let accountFolder = await GDrive.files.getId(
        Ns,
        [webWalletFolder],
        GDrive.files.mimeFolder
      );
      let oldFileId = await GDrive.files.getId(
        "current",
        [accountFolder],
        "text/plain"
      );
      await GDrive.files.delete(oldFileId);
    },
    async uploadToGDrive(data, Ns) {
      try {
        await this.initialGoogle();
        console.log(GDrive.isInitialized());
      } catch (e) {
        console.log(e);
      }
      if (GDrive.isInitialized()) {
        try {
          const webWalletFolder = await GDrive.files.safeCreateFolder({
            name: "Shardus-Web-Wallet",
            parents: ["root"]
          });
          console.log(`Created Shardus-Web-Wallet folder...`);
          const accountFolder = await GDrive.files.safeCreateFolder({
            name: Ns,
            parents: [webWalletFolder]
          });
          console.log(`Created account folder ${Ns}`);
          await this.deleteOldFile(Ns);
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
              "Your new password is successfully stored in your Google Drive.";
            GDrive.files.createFileMultipart(
              JSON.stringify(data),
              "text/plain",
              {
                parents: [accountFolder],
                name: `${Date.now()}`
              }
            );
          } else {
            console.log(res.headers);
            alert(
              "Something went wrong while trying to save your new password in your Google Drive"
            );
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
    async downloadFromGDrive(Ns) {
      this.statusMessage = "Connectiong to Google Account";
      await this.initialGoogle();
      if (GDrive.isInitialized()) {
        this.statusMessage = "Fetching recovery information from Google Drive";
        try {
          let webWalletFolder = await GDrive.files.getId(
            "Shardus-Web-Wallet",
            [`root`],
            GDrive.files.mimeFolder
          );
          let accountFolder = await GDrive.files.getId(
            Ns,
            [webWalletFolder],
            GDrive.files.mimeFolder
          );
          let fileId = await GDrive.files.getId(
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
            alert("Cannot get recovery information from Google Drive");
          }
        } catch (e) {
          console.log(e);
          this.form.password1 = "";
          this.loading = false;
          this.errorMessage =
            "Cannot get recovery information from Google Drive";
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
        this.isSignedIn = true;
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
#reset-section {
  width: 100%;
  max-width: 650px;
  max-height: 500px;
  overflow: hidden;
  width: 90vw;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
#reset-section img {
  width: 120px;
  text-align: center;
  animation: rotateLogo 14s infinite linear;
}
#reset-section h4 {
  margin: 30px auto;
  text-align: center;
}
#reset-section form label {
  font-weight: bolder;
  font-size: 13px;
}
#reset-section form {
  width: 90%;
}
#reset-section p {
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
@keyframes rotateLogo {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
  }
}
</style>
