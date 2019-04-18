<template>
  <div id="welcome-section">
    <no-connection/>
    <img src="../assets/logo.svg" alt>
    <h2 class="welcome-title">Shardus</h2>
    <div>
      <b-button type="submit" variant="outline-danger" @click="redirect('/signup')">Register</b-button>
      <b-button type="submit" variant="danger" @click="redirect('/signin')">Sign In</b-button>
    </div>
    <!-- Install Modal -->
    <b-modal
      ref="install_modal"
      id="install_modal"
      title="Install Shardus"
      :hide-footer="true"
      @hide="onHideInstallModal"
    >
      Install this web app on your iPhone: tap
      <strong>share</strong> button and then
      <strong>Add to Homescreen</strong>
    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import {
  getWeb3,
  getBalance,
  getTokenBalance,
  initContracts,
  getHistory,
  getTokenHistory,
  isIos,
  isInStandaloneMode
} from "../assets/js/utils";

import BootstrapVue from "bootstrap-vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faLongArrowAltRight,
  faLongArrowAltLeft,
  faExchangeAlt,
  faInfo,
  faShare,
  faHandHoldingUsd,
  fachevronLeft,
  faChevronLeft,
  faBars,
  faCheck,
  faQrcode,
  faPlus,
  faUpload,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import VueQriously from "vue-qriously";
import NoConnection from "~/components/NoConnection.vue";

Vue.use(VueQriously);
Vue.use(BootstrapVue);

library.add(faLongArrowAltRight);
library.add(faLongArrowAltLeft);
library.add(faExchangeAlt);
library.add(faInfo);
library.add(faShare);
library.add(faHandHoldingUsd);
library.add(faChevronLeft);
library.add(faBars);
library.add(faCheck);
library.add(faQrcode);
library.add(faPlus);
library.add(faUpload);
library.add(faChartLine);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("no-connection", NoConnection);

import { setTimeout } from "timers";
export default {
  computed: {
    ...mapGetters({
      getConnection: "getConnection",
      getAccount: "account/getAccount",
      getBalance: "account/getBalance",
      getBalanceULT: "account/getBalanceULT",
      getWeb3: "getWeb3",
      getTransactionList: "transaction/getTransactionList",
      getTokenTransactionList: "transaction/getTokenTransactionList"
    })
  },
  created: async function() {
    let web3 = await getWeb3();
    await initContracts(web3);
  },
  mounted: function() {
    let self = this;
    setTimeout(() => {
      if (isIos() && !isInStandaloneMode()) {
        let isShown = localStorage.getItem("isInstallMessageShown");
        if (isShown !== "true") {
          this.showModal("install_modal");
        }
      }
    }, 3000);
  },
  methods: {
    ...mapActions({
      updateConnection: "updateConnection",
      addAccount: "account/addAccount",
      updateBalance: "account/updateBalance",
      updateBalanceULT: "account/updateBalanceULT",
      updateBalanceDAI: "account/updateBalanceDAI",
      updateTransactionList: "transaction/updateTransactionList",
      updateTokenTransactionList: "transaction/updateTokenTransactionList"
    }),
    onHideInstallModal() {
      localStorage.setItem("isInstallMessageShown", "true");
    },
    redirect(url) {
      this.$router.push(url);
    },
    showModal(ref) {
      if (this.$refs[ref]) this.$refs[ref].show();
    },
    hideModal(ref) {
      if (this.$refs[ref]) this.$refs[ref].hide();
    }
  }
};
</script>


<style>
#welcome-section {
  width: 100%;
  min-height: 100vh;
  /* overflow: hidden; */
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#welcome-section .btn {
  width: 100px;
  height: 40px;
  font-size: 14px;
  border-radius: 200px;
  margin: 10px;
}
#welcome-section .welcome-title {
  margin-bottom: 40px;
  margin-top: 10px;
  font-size: 26px;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: bolder;
  color: #383635;
}
#welcome-section img {
  width: 120px;
  animation: rotateLogo 14s infinite linear;
}
#pop-over-target {
  position: absolute;
  bottom: 10px;
  margin: 0;
  padding: 0px;
  font-size: 1px;
  color: rgba(255, 255, 255, 0.2);
}
.popover {
  font-size: 11px;
  border-radius: 10px;
}
.popover-header {
  text-align: center;
  border-radius: 10px 10px 0px 0px;
}
#install_modal {
  font-size: 11px;
  position: fixed;
  bottom: 100vh;
  top: calc(100vh - 170px);
}
#install_modal .modal-header {
  height: 30px;
  padding: 4px 20px;
  text-align: center;
  background: #e8e8e8;
  display: flex;
  justify-content: space-between;
}
#install_modal .modal-header h5 {
  font-size: 13px;
  color: #333;
  text-align: center;
  font-weight: bolder;
  flex-grow: 2;
}
#install_modal .modal-body {
  padding: 0.5rem;
}
#install_modal .modal-header .close {
  margin-left: 10px;
}
#install_modal .modal-backdrop {
  background-color: #dadada22;
}
#install_modal .modal-backdrop.show {
  opacity: 0.2;
}
#install_modal .modal.show .modal-dialog {
  width: 85%;
  max-width: 320px;
  margin: 0 auto;
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
