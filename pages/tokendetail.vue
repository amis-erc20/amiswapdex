<template>
  <div class="token-detail-section">
    <Nav/>
    <!-- <div v-if="!getConnection" class="no-internet-description">
      <p>No Internet Connection</p>
    </div>-->
    <!-- <b-card no-body v-if="getConnection"> -->
    <b-card no-body>
      <b-tabs pills card>
        <b-tab
          title="Info"
          :active="activeTokenSubTab === 'info'"
          @click="onTokenTabChange('info')"
        >
          <Info/>
        </b-tab>
        <b-tab
          :active="activeTokenSubTab === 'balance'"
          title="Balance"
          @click="onTokenTabChange('balance')"
        >
          <Header v-if="getSignIn"/>
          <Transactionlist v-if="getSignIn"/>
          <Noaccount v-else/>
        </b-tab>
        <b-tab
          :active="activeTokenSubTab === 'receive'"
          title="Receive"
          @click="onTokenTabChange('receive')"
        >
          <Receive v-if="getSignIn"/>
          <Noaccount v-else/>
        </b-tab>
        <b-tab
          :active="activeTokenSubTab === 'send'"
          title="Send"
          @click="onTokenTabChange('send')"
        >
          <b-card-text>
            <Send v-if="getSignIn"/>
            <Noaccount v-else/>
          </b-card-text>
        </b-tab>
        <b-tab
          :active="activeTokenSubTab === 'swap'"
          title="Swap"
          @click="onTokenTabChange('swap')"
        >
          <b-card-text>
            <Swap v-if="getSignIn"/>
            <Noaccount v-else/>
          </b-card-text>
        </b-tab>
        <b-tab
          :active="activeTokenSubTab === 'pool'"
          title="Pool"
          v-if="getActiveToken !== 'ETH'"
          @click="onTokenTabChange('pool')"
        >
          <b-card-text>
            <Liquidity v-if="getSignIn"/>
            <Noaccount v-else/>
          </b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import Transactionlist from "~/components/Transactionlist.vue";
import Header from "~/components/Header.vue";
import Nav from "~/components/Nav.vue";
import Receive from "~/components/Receive.vue";
import Info from "~/components/Info.vue";
import Send from "~/components/Send.vue";
import Swap from "~/components/Swap.vue";
import Liquidity from "~/components/Liquidity.vue";
import Noaccount from "~/components/Noaccount.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    Transactionlist,
    Header,
    Nav,
    Info,
    Receive,
    Send,
    Swap,
    Liquidity,
    Noaccount
  },
  computed: {
    ...mapGetters({
      getConnection: "getConnection",
      getSignIn: "getSignIn",
      getAccount: "account/getAccount",
      getAuthRedirectUrl: "getAuthRedirectUrl",
      getTransactionList: "transaction/getTransactionList",
      getTokenTransactionList: "transaction/getTokenTransactionList",
      getActiveToken: "getActiveToken"
    }),
    getTxList: function() {
      if (this.getActiveToken === "ETH") return this.getTransactionList;
      else return this.getTokenTransactionList;
    },
    activeTokenSubTab: function() {
      let redirectUrl = this.getAuthRedirectUrl;
      return redirectUrl.tokenSubTab || "info";
    }
  },
  methods: {
    ...mapActions({
      updateTransactionList: "transaction/updateTransactionList",
      updateAuthRedirectUrl: "updateAuthRedirectUrl"
    }),
    onTokenTabChange(tabName) {
      this.updateAuthRedirectUrl({
        url: "/tokendetail",
        token: this.getActiveToken,
        tokenSubTab: tabName
      });
    }
  }
};
</script>


<style>
.token-detail-section {
  min-height: 100vh;
}
.transactionlist-section {
  box-shadow: 0px 4px 3px #eee;
  min-height: 100px;
}
.transactionlist-section .card-header {
  background: #efefef;
}
.transactionlist-section .card-body {
  padding: 0px;
}
.transactionlist-section h4 {
  font-size: 16px;
}
.token-detail-section {
  width: 100%;
  /* overflow-x: hidden; */
}
.token-detail-section .tabs:focus,
.token-detail-section .tabs-content:focus {
  outline: none !important;
}
.token-detail-section .tab-pane.card-body:focus {
  outline: none !important;
}

.token-detail-section .card-body {
  padding: 0;
}
.token-detail-section .card-footer {
  text-align: center;
  width: 90%;
  max-width: 650px;
  margin: 0 auto;
  padding-top: 55px;
  height: calc(100vh - 64px);
}
.token-detail-section .nav.nav-pills.card-header-pills {
  height: 100%;
  display: flex;
  justify-content: space-evenly;
}
.token-detail-section .nav.nav-pills.card-header-pills .nav-item {
  flex-grow: 1;
  font-size: 13px;
}

.token-detail-section .nav-pills .nav-link {
  height: 100%;
  color: #333;
  border-radius: 0px;
  text-align: center;
  margin: 0px;
  padding-top: 15px;
}
.nav-pills .nav-link.active,
.nav-pills .show > .nav-link {
  height: 100%;
  background: #ffffff;
  color: #2752e4;
  border-bottom: 2px solid #2752e4;
  border-radius: 0px;
  text-align: center;
  margin: 0px;
  /* padding-top: 15px; */
}

.card {
  background-color: red !important;
}
.token-detail-section .card {
  border: none;
  /* background-image: linear-gradient(to top, #dfe9f3 0%, white 100%) !important; */
  background-color: transparent !important;
  background-repeat: no-repeat;
  top: 64px;
}
.token-detail-section .tab-content,
.token-detail-section .tab-pane.card-body {
  border: none;
  background-image: linear-gradient(to top, #dfe9f3 0%, white 100%) !important;
  min-height: calc(100vh - 100px);
}
.token-detail-section .tabs .card-header {
  padding: 0px;
  height: 50px;
  position: fixed;
  width: 100%;
  z-index: 9999;
  background: #eee;
}
</style>
