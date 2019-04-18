<template>
  <div class="periodic-backup-section"></div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import cryptoUtils from "../assets/js/cryptoUtils.js";
import GDrive from "../assets/js/googleDrive/GDrive.js";
import CONFIG from "../config.js";
const defaultBackupInterval = CONFIG.backupInterval;
export default {
  data: function() {
    return {
      loading: false,
      errorMessage: "",
      web3: null,
      statusMessage: "",
      success: false,
      periodicBackupInterval: null
    };
  },
  props: {
    backupStatus: {
      type: Boolean
    }
  },
  computed: {
    ...mapGetters({
      getActiveToken: "getActiveToken",
      getBackupStatus: "getBackupStatus",
      getCredentials: "getCredentials"
    })
  },
  // mounted: async function() {
  //   const credentials = JSON.parse(localStorage.getItem("credentials"));
  //   const { Ep, De, Ps } = credentials;
  //   console.log(`Backup Status from parent component: ${this.backupStatus}`);
  //   console.log(`this.getBackupStatus: ${this.getBackupStatus}`);
  //   if (this.backupStatus == true && this.getBackupStatus !== "ongoing")
  //     this.startPeriodicBackup({ Ep, De }, Ps);
  // },
  // updated: async function() {
  //   const credentials = JSON.parse(localStorage.getItem("credentials"));
  //   const { Ep, De, Ps } = credentials;
  //   console.log(`Backup Status from parent component: ${this.backupStatus}`);
  //   if (this.backupStatus == true && this.getBackupStatus !== "ongoing")
  //     this.startPeriodicBackup({ Ep, De }, Ps);
  // },
  methods: {
    ...mapActions({
      updateAuthStatus: "updateAuthStatus",
      updateCredentials: "updateCredentials",
      updateBackupStatus: "updateBackupStatus",
      removeAccount: "account/removeAccount"
    }),
    async startPeriodicBackup(data, Ps) {
      let self = this;
      this.periodicBackupInterval = setInterval(() => {
        self.uploadToGDrive(data, Ps, `current_${Date.now()}`);
      }, defaultBackupInterval);
    },
    stopPeriodBackup() {
      clearInterval(this.periodicBackupInterval);
    },
    async uploadToGDrive(data, Ps, filename) {
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
            name: Ps,
            parents: [webWalletFolder]
          });
          console.log(`Created account folder ${Ps}`);
          let res = await GDrive.files.createFileMultipart(
            JSON.stringify(data),
            "text/plain",
            {
              parents: [accountFolder],
              name: filename
            }
          );
          if (res.ok) {
            let { Ns } = this.getCredentials;
            let credentials = JSON.parse(localStorage.getItem(Ns));
            credentials.backupStatus = true;
            this.updateBackupStatus("ongoing");
            localStorage.setItem(Ns, JSON.stringify(credentials));
            console.log("Periodic backup is successful !");
          } else {
            console.log("Error while performing periodic backup");
            this.stopPeriodBackup();
          }
        } catch (e) {
          console.log(e);
          this.stopPeriodBackup();
          console.log("Error while performing periodic backup");
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
.periodic-backup-section {
  display: none;
}
</style>
