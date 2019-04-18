<template>
  <div id="no-internet-section">
    <v-offline @detected-condition="handleConnectivityChange"></v-offline>
    <b-modal
      ref="no_internet_modal"
      id="no_internet_modal"
      title="Network Error"
      :hide-footer="true"
      @hide="onHideNoInternetModal"
    >
      <p>No internet connection detected! Please check your mobile data or WiFi connection</p>
    </b-modal>
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
      alertInterval: 30000
    };
  },
  components: { VOffline },
  computed: {
    ...mapGetters({
      getConnection: "getConnection"
    })
  },
  mounted: function() {
    if (!this.getConnection) this.showModal("no_internet_modal");
  },
  methods: {
    ...mapActions({
      updateConnection: "updateConnection"
    }),
    handleConnectivityChange(status) {
      console.log(`Connectivity Status: ${status}`);
      this.updateConnection(status);
      if (status === false) this.showModal("no_internet_modal");
      else this.hideModal("no_internet_modal");
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
</style>
