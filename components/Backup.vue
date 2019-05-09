<template>
  <div id="backup-section">
    <periodic-backup :backupStatus="getBackupStatus()"/>
    <img src="../assets/drive.png" alt>
    <h5>Backup to Google Drive</h5>
    <scale-loader :loading="loading && !success" :color="`red`" :height="`15px`" :width="`5px`"></scale-loader>
    <font-awesome-icon v-if="success" icon="check" size="2x" color="green"/>
    <p v-if="loading" class="status-message">{{statusMessage}}</p>
    <p
      class="backup-description"
      v-if="!success && !loading"
    >Please activate automatic account backup to store your account credentials periodically to google drive</p>
    <nuxt-link to="/" v-if="success">
      <b-button type="button" variant="danger" id="backup-btn">Contiue</b-button>
    </nuxt-link>
    <b-form @submit="onBackup" v-if="loading !== true">
      <div class="submit-button-group">
        <b-button type="submit" variant="danger" id="backup-btn" :disabled="loading">
          <font-awesome-icon icon="upload" size="lg" color="#fff" id="upload-icon"/>Activate Automatic Backup
        </b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ScaleLoader from "vue-spinner/src/ScaleLoader.vue";
import PeriodicBackup from "~/components/PeriodicBackup.vue";
import cryptoUtils from "../assets/js/cryptoUtils.js";
import GDrive from "../assets/js/googleDrive/GDrive.js";
import CONFIG from "../config.js";
export default {
  components: { ScaleLoader, PeriodicBackup },
  data: function() {
    return {
      loading: false,
      errorMessage: "",
      web3: null,
      statusMessage: "",
      success: false
    };
  },
  computed: {
    ...mapGetters({
      getActiveToken: "getActiveToken",
      getCredentials: "getCredentials"
    })
  },
  methods: {
    ...mapActions({
      updateAuthStatus: "updateAuthStatus",
      removeAccount: "account/removeAccount"
    }),
    getBackupStatus() {
      const { Ns } = this.getCredentials;
      const credentials = JSON.parse(localStorage.getItem(Ns));
      const { backupStatus } = credentials;
      return backupStatus;
    },
    redirect(url) {
      this.$router.push(url);
    },
    async onBackup(evt) {
      this.loading = true;
      const { Ep, De, Ns } = this.getCredentials;
      await this.uploadToGDrive({ Ep, De }, Ns, "current");
    },
    stopPeriodBackup() {
      clearInterval(this.periodicBackupInterval);
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
    async uploadToGDrive(data, Ns, filename) {
      try {
        await this.initialGoogle();
        console.log(GDrive.isInitialized());
      } catch (e) {
        console.log(e);
      }
      if (GDrive.isInitialized()) {
        try {
          let credentials = JSON.parse(localStorage.getItem(Ns));
          const webWalletFolder = await GDrive.files.safeCreateFolder({
            name: "Shardus-Web-Wallet",
            parents: ["root"]
          });
          console.log(`Created Shardus-Web-Wallet folder...`);
          const accountFolder = await GDrive.files.safeCreateFolder({
            name: Ns,
            parents: [webWalletFolder]
          });
          console.log(`Createds account folder ${Ns}`);
          if (credentials.backupStatus == true) {
            await this.deleteOldFile(Ns);
          }
          let res = await GDrive.files.createFileMultipart(
            JSON.stringify(data),
            "text/plain",
            {
              parents: [accountFolder],
              name: filename
            }
          );
          if (res.ok) {
            const { Ns } = this.getCredentials;
            credentials.backupStatus = true;
            localStorage.setItem(Ns, JSON.stringify(credentials));
            this.success = true;
            this.statusMessage =
              "Your wallet credentials are successfully backed up in your Google Drive !";
            // create an archive file
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
            this.stopPeriodBackup();
            alert(
              "Something went wrong while trying to storage your wallet credentials in your Google Drive"
            );
          }
        } catch (e) {
          console.log(e);
          this.loading = false;
          this.stopPeriodBackup();
          alert(
            "Something went wrong while trying to storage your wallet credentials in your Google Drive"
          );
        }
      }
    },
    updateSignInStatus(isSignedIn) {
      if (isSignedIn) {
        const token = gapi.auth2
          .getAuthInstance()
          .currentUser.get()
          .getAuthResponse().access_token;
        GDrive.setAccessToken(token);
        this.statusMessage = "Uploading backup data to your Google Drive";
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
          this.success = false;
          this.loading = false;
          this.statusMessage = "Unable to connect to your Google account !";
          reject(e);
        }
      });
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
}
#backup-section img {
  width: 100px;
  margin: 20px auto;
}
#backup-section {
  position: fixed;
  top: 64px;
  height: calc(100vh - 64px);
  width: 90%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
}
#backup-section .backup-description {
  font-size: 12px;
}
#backup-section .submit-button-group {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  margin-bottom: 10px;
}
#backup-section svg[data-icon="check"] {
  width: 100%;
}
#backup-btn {
  width: auto;
}
#backup-btn svg {
  display: inline-block;
  margin-right: 10px;
  position: relative;
  top: -4px;
}
</style>
