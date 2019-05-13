// P = user password
// Ps = key stretched version of P
// C = answers to common recovery questions
// Cs = key stretched version of C
// Q = user selected recovery questions
// A = answers to user selected recovery questions
// As = key stretched version of A
// E = randomly selected symmetric encryption key
// D = data to be stored in online storage; such as private keys
// De = encrypt(D, E) - D encrypted with E
// Ep = encrypt(E, Ps)
// Ea = encrypt(E, As)
// Qc = encrypt(Q, Cs)

<template>
  <div class="recovery-container">
    <nav/>
    <div v-if="!isSignedIn || !isInfoDownloaded" id="signin-section">
      <img src="../assets/logo.svg" alt>
      <h4>Google Sign In</h4>
      <scale-loader :loading="loading" :color="`red`" :height="`15px`" :width="`5px`"></scale-loader>
      <p v-if="loading" class="status-message">{{statusMessage}}</p>
      <b-form @submit="onGoogleSignin" v-if="loading !== true">
        <b-form-group>
          <label for>Email</label>
          <b-form-input type="email" required v-model="form.email"/>
        </b-form-group>
        <div class="submit-button-group">
          <b-button type="submit" variant="danger" id="signin-btn">Sign Into Google Account</b-button>
        </div>
      </b-form>
      <p v-if="!loading">
        Don't have an account ? Please
        <nuxt-link to="/signup">sign up</nuxt-link>. If you know your password,
        <nuxt-link to="/signin">sign into{{" "}}</nuxt-link>your account here
      </p>
    </div>
    <div id="recovery-section" v-if="isSignedIn && isInfoDownloaded">
      <img src="../assets/logo.svg" alt>

      <scale-loader :loading="loading && !success" :color="`red`" :height="`15px`" :width="`5px`"></scale-loader>
      <font-awesome-icon v-if="success" icon="check" size="2x" color="green"/>
      <p v-if="loading" class="status-message">{{statusMessage}}</p>
      <nuxt-link to="/" v-if="success">
        <b-button type="button" variant="danger" id="create-account-btn">Continue to Wallet</b-button>
      </nuxt-link>

      <!--Common Question Form -->
      <b-form @submit="onSubmitCommonAnswers" v-if="loading !== true && this.step === 'common'">
        <h4>Common Questions</h4>
        <b-alert v-if="errorMessage.length > 0" show fade variant="danger">{{errorMessage}}</b-alert>
        <b-alert v-if="succssMessage.length > 0" show fade variant="success">{{successMessage}}</b-alert>
        <!-- Common Question 1 -->
        <b-form-group>
          <label for>{{ form.commonQuestion1 }}</label>
          <b-form-input type="text" required v-model="form.commonAnswer1"/>
        </b-form-group>
        <!-- Common Question 2 -->
        <b-form-group>
          <label for>{{ form.commonQuestion2 }}</label>
          <b-form-input type="text" required v-model="form.commonAnswer2"/>
        </b-form-group>
        <div class="submit-button-group">
          <b-button @click="redirect(`/welcome`)" variant="outline-dark">Cancel</b-button>
          <b-button type="submit" variant="danger" :disabled="!isAnswersValid || loading">Submit</b-button>
        </div>
        <p>
          If you know your password, please
          <nuxt-link to="/signin">sign in</nuxt-link>.
        </p>
      </b-form>

      <!-- User Selected Question Form -->
      <b-form v-if="loading !== true && this.step === 'user'" @submit="onSubmitUserAnswers">
        <h4>User Selected Questions</h4>
        <b-alert v-if="errorMessage.length > 0" show fade variant="danger">{{errorMessage}}</b-alert>
        <b-alert v-if="succssMessage.length > 0" show fade variant="success">{{successMessage}}</b-alert>
        <b-form-group>
          <label for>{{ form.userQuestion1.q }}</label>
          <b-form-input
            type="text"
            required
            placeholder="type your answer"
            v-model="form.userQuestion1.a"
          />
        </b-form-group>
        <b-form-group>
          <label for>{{ form.userQuestion2.q }}</label>
          <b-form-input
            type="text"
            required
            placeholder="type your answer"
            v-model="form.userQuestion2.a"
          />
        </b-form-group>
        <b-form-group>
          <label for>{{ form.userQuestion3.q }}</label>
          <b-form-input
            type="text"
            required
            placeholder="type your answer"
            v-model="form.userQuestion3.a"
          />
        </b-form-group>
        <b-form-group v-if="form.userQuestion4.q">
          <label for>{{ form.userQuestion4.q }}</label>
          <b-form-input
            type="text"
            required
            placeholder="type your answer"
            v-model="form.userQuestion4.a"
          />
        </b-form-group>
        <b-form-group v-if="form.userQuestion5.q">
          <label for>{{ form.userQuestion5.q }}</label>
          <b-form-input
            type="text"
            required
            placeholder="type your answer"
            v-model="form.userQuestion5.a"
          />
        </b-form-group>
        <div class="submit-button-group">
          <b-button @click="redirect(`/welcome`)" variant="outline-dark">Cancel</b-button>
          <b-button type="submit" variant="danger" :disabled="!isAnswersValid || loading">Submit</b-button>
        </div>
        <p>
          If you know your password, please
          <nuxt-link to="/signin">sign in</nuxt-link>.
        </p>
      </b-form>

      <!-- New Password Form -->
      <b-form @submit="onUpdatePassword" v-if="loading !== true && this.step === 'new-password'">
        <h4>Reset Password</h4>
        <b-form-group>
          <label for>Password</label>
          <b-form-input
            type="password"
            v-model="form.password1"
            required
            :state="validatePassword()"
          />
        </b-form-group>
        <b-form-group>
          <label for>Retype Your Password</label>
          <b-form-input
            type="password"
            v-model="form.password2"
            required
            :state="validatePassword()"
          />
          <b-form-invalid-feedback :state="validatePassword()">{{errorMessage}}</b-form-invalid-feedback>
        </b-form-group>
        <div class="submit-button-group">
          <b-button @click="redirect(`/welcome`)" variant="outline-dark">Cancel</b-button>
          <b-button type="submit" variant="danger" :disabled="!validatePassword() || loading">Reset</b-button>
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
      isSignedIn: false,
      isInfoDownloaded: false,
      Qc: null,
      Ea: null,
      De: null,
      D: null,
      E: null,
      step: null,
      Ns: null,
      form: {
        commonQuestion1: "Which year were you born ?",
        commonQuestion2: "What city were you born in ?",
        commonAnswer1: "",
        commonAnswer2: "",
        userQuestion1: {
          q: null,
          a: ""
        },
        userQuestion2: {
          q: null,
          a: ""
        },
        userQuestion3: {
          q: null,
          a: ""
        },
        userQuestion4: {
          q: null,
          a: ""
        },
        userQuestion5: {
          q: null,
          a: ""
        },
        password1: "",
        password2: ""
      },
      loading: false,
      errorMessage: "",
      succssMessage: "",
      web3: null,
      statusMessage: "",
      success: false,
      isAnswersValid: true
    };
  },
  computed: {
    ...mapGetters({ getSignIn: "getSignIn" })
  },
  created: async function() {
    this.web3 = await getWeb3();
  },
  mounted: async function() {},
  methods: {
    ...mapActions({
      addAccount: "account/addAccount",
      updateAuthStatus: "updateAuthStatus",
      updateCredentials: "updateCredentials"
    }),
    validateAnswer(answer) {
      // if (!answer) return false;
      // let normalisedAnswer = normaliseText(answer);
      // if (normalisedAnswer.length === 0) {
      //   this.errorMessage = "Provide a valid answer";
      //   return false;
      // }
      return true;
    },
    validateAllAnswer() {
      // if (this.form.answers.length === 0) return false;
      // const valid = this.form.answers.reduce((a, b) => {
      //   return a && a.length > 0 && b && b.length > 0;
      // });
      this.isAnswersValid = true;
    },
    redirect(url) {
      this.$router.push(url);
    },
    getAllCommonAnswers() {
      let answers = [];
      answers.push(normaliseText(this.form.commonAnswer1));
      answers.push(normaliseText(this.form.commonAnswer2));
      return JSON.stringify(answers);
    },
    getAllUserAnswers() {
      let answers = [];
      answers.push(normaliseText(this.form.userQuestion1.a));
      answers.push(normaliseText(this.form.userQuestion2.a));
      answers.push(normaliseText(this.form.userQuestion3.a));
      if (this.form.userQuestion4.a)
        answers.push(normaliseText(this.form.userQuestion4.a));
      if (this.form.userQuestion5.a)
        answers.push(normaliseText(this.form.userQuestion5.a));
      return JSON.stringify(answers);
    },
    getAllUserQuestions() {
      let answers = [];
      answers.push(normaliseText(this.form.userQuestion1.q));
      answers.push(normaliseText(this.form.userQuestion2.q));
      answers.push(normaliseText(this.form.userQuestion3.q));
      return JSON.stringify(answers);
    },
    async uploadToGDrive(data, filename) {
      try {
        await this.initialGoogle();
        console.log(GDrive.isInitialized());
      } catch (e) {
        console.log(e);
      }
      if (GDrive.isInitialized()) {
        try {
          let Ns = this.Ns;
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
          let res = await GDrive.files.createFileMultipart(
            JSON.stringify(data),
            "text/plain",
            {
              parents: [accountFolder],
              name: filename
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
    async onGoogleSignin(evt) {
      evt.preventDefault();
      this.loading = true;
      await this.wait(100);
      try {
        this.Ns = await cryptoUtils.keyStretchPassword(this.form.email, 10000);
        let { Qc, Ea } = await this.downloadFromGDrive("recovery-data");

        if (Qc && Ea) {
          this.Qc = Qc;
          this.Ea = Ea;
          this.isInfoDownloaded = true;
          this.loading = false;
          this.step = "common";
        }
      } catch (e) {
        console.log(e);
        this.loading = false;
        this.errorMessage = "Cannot get recovery information from Google Drive";
      }
    },
    async deleteOldFile(Ns, filename) {
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
        filename,
        [accountFolder],
        "text/plain"
      );
      await GDrive.files.delete(oldFileId);
    },
    async onSubmitCommonAnswers(evt) {
      evt.preventDefault();
      this.loading = true;
      await this.wait(100);
      try {
        let { Qc, Ea } = this;
        const C = this.getAllCommonAnswers();
        const Cs = await cryptoUtils.keyStretchPassword(C, 10000);
        const Q = sjcl.decrypt(Cs, Qc);
        if (Q) {
          this.errorMessage = "";
          this.buildUserQuestionForm(Q);
          this.step = "user";
          this.loading = false;
        } else {
          this.form.commonAnswer1 = "";
          this.form.commonAnswer2 = "";
          this.loading = false;
          this.errorMessage = "Incorrect Answers";
        }
      } catch (e) {
        console.log(e);
        console.log(`Incorrect Answer`);
        this.form.commonAnswer1 = "";
        this.form.commonAnswer2 = "";
        this.errorMessage = "Incorrect Answers";
        this.loading = false;
      }
    },
    async onSubmitUserAnswers(evt) {
      evt.preventDefault();
      this.loading = true;
      await this.wait(100);
      try {
        let { Qc, Ea } = this;
        let { De } = await this.downloadFromGDrive("current");
        this.De = De;
        const A = this.getAllUserAnswers();
        const As = await cryptoUtils.keyStretchPassword(A, 10000);
        const E = sjcl.decrypt(As, Ea);
        const D = sjcl.decrypt(E, De);
        this.E = E;
        if (D) {
          const isPrivateKeyValid = await this.validatePrivateKey(D);
          if (isPrivateKeyValid) {
            this.D = D;
            this.step = "new-password";
            this.errorMessage = "";
          }
          this.loading = false;
        }
      } catch (e) {
        console.log(e);
        this.form.password1 = "";
        this.loading = false;
        this.errorMessage = "Incorrect Answers. Please try again.";
      }
    },
    async onUpdatePassword(evt) {
      this.loading = true;
      this.statusMessage = "Updating Password";
      evt.preventDefault();
      await this.wait(100);
      const Ns = this.Ns;
      const De = this.De;
      const D = this.D;
      const E = this.E;
      const P = this.form.password1;
      const Ps = await cryptoUtils.keyStretchPassword(P, 10000);
      const Ep = sjcl.encrypt(Ps, E);
      await this.deleteOldFile(this.Ns, "current");
      this.uploadToGDrive({ Ep, De }, "current");
      localStorage.setItem(
        Ns,
        JSON.stringify({ Ep, De, Ns: this.Ns, backupStatus: false })
      );
      const account = await this.getAccountFromPrivateKey(D);
      this.addAccount(account);
      this.updateCredentials({ E, Ep, De, Ns: this.Ns });
      this.updateAuthStatus(true);
    },
    async validatePrivateKey(key) {
      try {
        const account = await this.getAccountFromPrivateKey(key);
        if (account.address.length === 42) return true;
        else return false;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    validatePassword() {
      let password1 = normaliseText(this.form.password1);
      let password2 = normaliseText(this.form.password2);
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
    buildUserQuestionForm(Q) {
      const userQuestions = JSON.parse(Q);
      console.log(Q);
      if (userQuestions[0]) this.form.userQuestion1.q = userQuestions[0];
      if (userQuestions[1]) this.form.userQuestion2.q = userQuestions[1];
      if (userQuestions[2]) this.form.userQuestion3.q = userQuestions[2];
      if (userQuestions[3]) this.form.userQuestion4.q = userQuestions[3];
      if (userQuestions[4]) this.form.userQuestion5.q = userQuestions[4];
    },
    async getAccountFromPrivateKey(key) {
      const {
        address,
        privateKey
      } = await this.web3.eth.accounts.privateKeyToAccount(key);
      const account = { address, privateKey, balance: 0 };
      return account;
    },
    comparePassword(password, hash) {
      return bcrypt.compareSync(password, hash);
    },
    async downloadFromGDrive(filename) {
      this.statusMessage = "Connectiong to Google Account";
      await this.initialGoogle();
      if (GDrive.isInitialized()) {
        this.statusMessage = "Fetching recovery information from Google Drive";
        try {
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
            filename,
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
#recovery-section {
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
#recovery-section img {
  width: 120px;
  text-align: center;
  animation: rotateLogo 14s infinite linear;
}
#recovery-section h4 {
  margin: 30px auto;
  text-align: center;
}
#recovery-section form label {
  font-weight: bolder;
  font-size: 13px;
}
#recovery-section form {
  width: 90%;
}
#recovery-section p {
  font-size: 12px;
  margin-top: 10px;
}
.submit-button-group {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.submit-button-group .btn {
  width: 48%;
}
.submit-button-group button[type="submit"] {
  font-size: 14px;
  font-weight: bold;
  height: 50px;
}
#create-account-btn {
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
