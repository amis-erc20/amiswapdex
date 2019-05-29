<template>
  <div id="no-internet-section">
    <v-offline @detected-condition="handleConnectivityChange"></v-offline>
    <p v-if="showAlert" id="no-internet-alert">No Internet Connection !</p>
    <p v-if="!showAlert && !getServerStatus" id="no-internet-alert">Connection Issue to Server !</p>
  </div>
</template>

<script>
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import VOffline from "v-offline";
import { setTimeout } from "timers";
export default {
  data: function() {
    return {
      onlineSlot: "online",
      offlineSlot: "offline",
      alertInterval: 5000,
      showAlert: false
    };
  },
  components: { VOffline },
  computed: {
    ...mapGetters({
      getConnection: "getConnection",
      getServerStatus: "getServerStatus"
    })
  },
  mounted: function() {
    // if (!this.getConnection) this.showModal("no_internet_modal");
    if (!this.getConnection) this.showAlert = true;
  },
  methods: {
    ...mapActions({
      updateConnection: "updateConnection"
    }),
    handleConnectivityChange(status) {
      console.log(`Connectivity Status: ${status}`);
      this.updateConnection(status);
      if (status === false) this.showAlert = true;
      else this.showAlert = false;
    },
    onHideNoInternetModal() {
      let self = this;
      setTimeout(() => {
        this.showModal("no_internet_modal");
      }, self.alertInterval);
    },
    showModal(ref) {
      if (this.$refs[ref] && !this.getConnection) this.$refs[ref].show();
    },
    hideModal(ref) {
      if (this.$refs[ref]) this.$refs[ref].hide();
    }
  }
};
</script>


<style>
#no-internet-section {
  z-index: 999 !important;
  margin: 0 auto;
  width: 100%;
}
#no-internet-alert {
  margin: 0 auto;
  padding: 0px;
  font-size: 11px;
  font-weight: bold;
  color: #fd2828;
  text-align: center;
  position: relative;
}
</style>
