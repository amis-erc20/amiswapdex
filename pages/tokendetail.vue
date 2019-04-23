<template>
  <div class="token-detail-section">
    <Nav/>
    <div v-if="!getConnection" class="no-internet-description">
      <p>No Internet Connection</p>
    </div>
    <b-card no-body v-if="getConnection">
      <b-tabs pills card>
        <b-tab title="Balance" active>
          <Header/>
          <Transactionlist/>
        </b-tab>
        <b-tab title="Receive" active>
          <Receive/>
        </b-tab>
        <b-tab title="Send">
          <b-card-text>
            <Send/>
          </b-card-text>
        </b-tab>
        <b-tab title="Swap">
          <b-card-text>
            <Swap/>
          </b-card-text>
        </b-tab>
        <b-tab title="Liquidity">
          <b-card-text>
            <Liquidity/>
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
import Send from "~/components/Send.vue";
import Swap from "~/components/Swap.vue";
import Liquidity from "~/components/Liquidity.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { Transactionlist, Header, Nav, Receive, Send, Swap, Liquidity },
  computed: {
    ...mapGetters({
      getConnection: "getConnection",
      getAccount: "account/getAccount",
      getTransactionList: "transaction/getTransactionList",
      getTokenTransactionList: "transaction/getTokenTransactionList",
      getActiveToken: "getActiveToken"
    }),
    getTxList: function() {
      if (this.getActiveToken === "ETH") return this.getTransactionList;
      else return this.getTokenTransactionList;
    }
  },
  methods: {
    ...mapActions({
      updateTransactionList: "transaction/updateTransactionList"
    })
  }
};
</script>


<style>
.token-detail-section {
  min-height: 100vh;
}
.transactionlist-section {
  box-shadow: 0px 4px 3px #eee;
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
  max-width: 500px;
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
  color: #e91a1c;
  border-bottom: 2px solid #e91a1c;
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
  min-height: calc(100vh - 64px);
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
