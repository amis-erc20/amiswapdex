<template>
  <div class="recovery-container">
    <Nav/>
    <div v-if="!getConnection" class="no-internet-description">
      <p>No Internet Connection</p>
    </div>
    <div id="recovery-section" v-if="getConnection">
      <h4 v-if="!loading && success">Common Q & A</h4>
      <scale-loader :loading="loading && !success" :color="`red`" :height="`15px`" :width="`5px`"></scale-loader>
      <font-awesome-icon v-if="success" icon="check" size="2x" color="green"/>
      <p v-if="loading" class="status-message">{{statusMessage}}</p>
      <nuxt-link to="/" v-if="success">
        <b-button type="button" variant="primary" id="create-account-btn">Continue</b-button>
      </nuxt-link>
      <b-form @submit="onSetupRecovery" v-if="loading !== true">
        <b-alert v-if="errorMessage.length > 0" show fade variant="primary">{{errorMessage}}</b-alert>
        <!-- Common Question 1 -->
        <b-form-group>
          <label for>{{ form.commonQuestion1 }}</label>
          <b-form-input
            type="text"
            required
            v-model="form.commonAnswer1"
            @keyup="onAnswerUpdate(form.commonAnswer1)"
          />
        </b-form-group>
        <!-- Common Question 2 -->
        <b-form-group>
          <label for>{{ form.commonQuestion2 }}</label>
          <b-form-input
            type="text"
            required
            v-model="form.commonAnswer2"
            @keyup="onAnswerUpdate(form.commonAnswer2)"
          />
        </b-form-group>

        <!-- USER QUESTIONS -->
        <h4>User Selected Q & A</h4>
        <!-- QUESTION 1 -->
        <b-form-group>
          <label for>Question 1</label>
          <b-form-select
            :options="form.availableQuestions.filter(q => q.text !== form.userQuestion2.q && q.text !== form.userQuestion3.q)"
            v-model="form.userQuestion1.q"
            @change="onUserSelectQuestion(form.userQuestion1)"
          />
        </b-form-group>
        <b-form-group>
          <b-form-input
            type="text"
            required
            placeholder="type your answer"
            v-model="form.userQuestion1.a"
          />
        </b-form-group>
        <!-- QUESTION 2 -->
        <b-form-group>
          <label for>Question 2</label>
          <b-form-select
            :options="form.availableQuestions.filter(q => q.text !== form.userQuestion1.q && q.text !== form.userQuestion3.q)"
            v-model="form.userQuestion2.q"
            @change="onUserSelectQuestion(form.userQuestion2)"
          />
        </b-form-group>
        <b-form-group>
          <b-form-input
            type="text"
            required
            placeholder="type your answer"
            v-model="form.userQuestion2.a"
          />
        </b-form-group>
        <!-- QUESTION 3 -->
        <b-form-group>
          <label for>Question 3</label>
          <b-form-select
            :options="form.availableQuestions"
            v-model="form.userQuestion3.q"
            @change="onUserSelectQuestion(form.userQuestion3)"
          />
        </b-form-group>
        <b-form-group>
          <b-form-input
            type="text"
            required
            placeholder="type your answer"
            v-model="form.userQuestion3.a"
          />
        </b-form-group>
        <!-- QUESTION 4 -->
        <b-form-group v-if="form.userQuestionCount > 3">
          <label for>Question 4</label>
          <b-form-select
            :options="form.availableQuestions"
            v-model="form.userQuestion4.q"
            @change="onUserSelectQuestion(form.userQuestion4)"
          />
        </b-form-group>
        <b-form-group v-if="form.userQuestionCount > 3">
          <b-form-input
            type="text"
            required
            placeholder="type your answer"
            v-model="form.userQuestion4.a"
          />
        </b-form-group>
        <!-- QUESTION 5 -->
        <b-form-group v-if="form.userQuestionCount > 4">
          <label for>Question 5</label>
          <b-form-select
            :options="form.availableQuestions"
            v-model="form.userQuestion5.q"
            @change="onUserSelectQuestion(form.userQuestion5)"
          />
        </b-form-group>
        <b-form-group v-if="form.userQuestionCount > 4">
          <b-form-input
            type="text"
            required
            placeholder="type your answer"
            v-model="form.userQuestion5.a"
          />
        </b-form-group>
        <b-form-group>
          <b-button variant="primary" @click="increaseUserQuestionCount" id="add-button">
            <font-awesome-icon icon="plus" color="#dc3545"/>
          </b-button>
          <!-- Unlock Request -->
          <b-modal
            ref="add_question_modal"
            id="add_question_modal"
            title="Add an new question"
            :hide-footer="true"
          >
            <b-form @submit="addNewQuestion">
              <b-form-group id="exampleInputGroup1">
                <label>Your Custom Question</label>
                <b-form-input type="text" v-model="form.newQuestion"/>
              </b-form-group>
              <b-button type="submit" variant="primary">Add Custion Q & A</b-button>
            </b-form>
          </b-modal>
        </b-form-group>
        <div class="submit-button-group">
          <b-button
            type="submit"
            variant="primary"
            id="create-account-btn"
            :disabled="!isAnswersValid || loading"
          >Submit</b-button>
        </div>
      </b-form>
      <!-- NO Active Backup -->
      <b-modal
        ref="no_active_backup_modal"
        id="no_active_backup_modal"
        title="No Remote Backup"
        :hide-footer="true"
        @hide="scheduleBackupModal"
      >
        <p>Please activate remote backup before setting up your recovery information.</p>
        <b-button
          type="button"
          variant="primary"
          id="create-account-btn"
          @click="redirect(`/backup`)"
        >Go to Remote Backup</b-button>
      </b-modal>
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
  middleware: "auth",
  components: {
    ScaleLoader,
    Nav
  },
  data() {
    return {
      form: {
        commonQuestion1: "Which year were you born ?",
        commonQuestion2: "What city were you born in ?",
        commonAnswer1: "",
        commonAnswer2: "",
        userQuestionCount: 3,
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
        availableQuestions: [
          {
            value: null,
            text: "Select a question"
          },
          {
            value: "What high school did you attend?",
            text: "What high school did you attend?"
          },
          {
            value: "What was the name of your first pet?",
            text: "What was the name of your first pet?"
          },
          {
            value: "What Is your favorite book?",
            text: "What Is your favorite book?"
          },
          {
            value: "Where is your favorite place to vacation?",
            text: "Where is your favorite place to vacation?"
          },
          {
            value: "What is your favorite food?",
            text: "What is your favorite food?"
          },
          {
            value: "What is your favorite color?",
            text: "What is your favorite color?"
          },
          {
            value: "Who is your favorite actor, musician, or artist?",
            text: "Who is your favorite actor, musician, or artist?"
          },
          {
            value: "add",
            text: "+ Add your custom question"
          }
        ],
        newQuestion: "",
        newAnswer: "",
        customQuestions: [],
        customAnswers: []
      },
      loading: false,
      errorMessage: "",
      web3: null,
      statusMessage: "",
      success: false,
      isAnswersValid: true
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
  mounted: async function() {
    this.checkBackupStatus();
  },
  methods: {
    ...mapActions({
      addAccount: "account/addAccount",
      updateAuthStatus: "updateAuthStatus"
    }),
    checkBackupStatus() {
      const { Ns } = this.getCredentials;
      let credentials = JSON.parse(localStorage.getItem(Ns));
      let backupStatus = credentials.backupStatus;
      if (backupStatus == true) {
        console.log("Backup is on. Eligible to setup recovery");
      } else {
        // alert("Please backup your credentials before recovery setup");
        // this.redirect("/backup");
        this.showModal("no_active_backup_modal");
      }
    },
    validateAnswer(answer) {
      if (!answer) return false;
      let normalisedAnswer = normaliseText(answer);
      if (normalisedAnswer.length === 0) {
        this.errorMessage = "Provide a valid answer";
        return false;
      }
      return true;
    },
    validateAllAnswer() {
      if (this.form.answers.length === 0) return false;
      const valid = this.form.commonAnswer1 && this.form.commonAnswer2;
      this.isAnswersValid = true;
    },
    redirect(url) {
      this.$router.push(url);
    },
    onAnswerUpdate(answer) {},
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
      return {
        count: answers.length,
        data: JSON.stringify(answers)
      };
    },
    getAllUserQuestions() {
      let questions = [];
      if (this.form.userQuestion1.q) questions.push(this.form.userQuestion1.q);
      if (this.form.userQuestion2.q) questions.push(this.form.userQuestion2.q);
      if (this.form.userQuestion3.q) questions.push(this.form.userQuestion3.q);
      if (this.form.userQuestion4.q) questions.push(this.form.userQuestion4.q);
      if (this.form.userQuestion5.q) questions.push(this.form.userQuestion5.q);
      return {
        count: questions.length,
        data: JSON.stringify(questions)
      };
    },
    increaseUserQuestionCount() {
      if (this.form.userQuestionCount < 5) this.form.userQuestionCount += 1;
      else alert(`Maximum 5 user questions are allowed !`);
    },
    onUserSelectQuestion(question) {
      if (question.q === "add") {
        this.askNewQuestion();
        question.q = null;
      }
    },
    askNewQuestion(q) {
      this.form.newQuestion = "";
      this.form.newAnswer = "";
      this.showModal("add_question_modal");
    },
    addNewQuestion(e) {
      e.preventDefault();
      this.form.availableQuestions.splice(
        this.form.availableQuestions.length - 1,
        0,
        {
          value: this.form.newQuestion,
          text: this.form.newQuestion
        }
      );
      this.hideModal("add_question_modal");
    },
    async onSetupRecovery(evt) {
      evt.preventDefault();
      const { E, Ns } = this.getCredentials;
      const C = this.getAllCommonAnswers();
      const userQuestions = this.getAllUserQuestions();
      const userAnswers = this.getAllUserAnswers();
      if (
        userQuestions.count < 3 ||
        userQuestions.count !== userAnswers.count
      ) {
        this.errorMessage = "Invalid number of questions and answers";
        return;
      }
      // console.log(userQuestions, userAnswers);
      const Q = userQuestions.data;
      const A = userAnswers.data;
      if (!C) {
        this.errorMessage = "Please provide answers to common questions";
        return;
      } else if (!Q) {
        this.errorMessage = "Please select at least 3 user questions";
        return;
      } else if (!A) {
        this.errorMessage = "Please provide answers to user selected questions";
        return;
      }
      const Cs = await cryptoUtils.keyStretchPassword(C, 10000);
      const As = await cryptoUtils.keyStretchPassword(A, 10000);
      const Qc = sjcl.encrypt(Cs, Q);
      const Ea = sjcl.encrypt(As, E);
      this.loading = true;
      this.statusMessage = "Uploading data...";
      // await this.wait(100);
      this.uploadToGDrive({ Qc, Ea }, Ns);
    },
    async uploadToGDrive(data, Ns) {
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
        let res = await GDrive.files.createFileMultipart(
          JSON.stringify(data),
          "text/plain",
          {
            parents: [accountFolder],
            name: "recovery-data"
          }
        );
        if (res.ok) {
          this.success = true;
          this.statusMessage =
            "Your recovery information are successfully stored in your Google Drive.";
        } else {
          alert(
            "Something went wrong while trying to store your recovery info in your Google Drive"
          );
        }
      } catch (e) {
        console.log(e);
        alert(
          "Something went wrong while trying to store your recovery info in your Google Drive"
        );
      }
    },
    showModal(ref) {
      this.$refs[ref].show();
    },
    hideModal(ref) {
      this.$refs[ref].hide();
    },
    scheduleBackupModal() {
      let self = this;
      setTimeout(() => {
        self.showModal("no_active_backup_modal");
      }, 1000);
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
.recovery-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
#recovery-section {
  width: 100%;
  max-width: 650px;
  min-height: 100vh;
  overflow: hidden;
  width: 90vw;
  margin: 20px auto;
  margin-top: 64px;
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
  font-size: 20px;
}
#recovery-section form label {
  font-weight: bolder;
  font-size: 13px;
}
#recovery-section form {
  width: 90%;
  margin: 10px auto;
}
#recovery-section p {
  font-size: 12px;
  margin-top: 10px;
}
#create-account-btn {
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  height: 50px;
}

#add-button {
  border-radius: 100px !important;
  width: 40px;
  height: 40px;
  margin: 20px auto;
  align-items: center;
  display: block;
  background: transparent;
  color: #dc3545;
  border-width: 2px;
  box-shadow: 0px 2px 4px #54595f;
}
#add_question_modal,
#no_active_backup_modal {
  position: fixed;
  top: 150px;
  width: 100%;
}
#add_question_modal button[type="submit"] {
  width: 100%;
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
