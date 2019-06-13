<template>
  <b-container class="transaction" style="border-width: 0px 0px 1px 0px;">
    <b-row>
      <b-col cols="1" class="arrow-column">
        <font-awesome-icon :icon="icon" :color="iconColor" size="lg"/>
      </b-col>
      <b-col cols="11" class="from-to-column">
        <b-row class="date-and-label-container">
          <b-col>
            <p class="transaction-type">{{txType}} {{txType === 'received' ? 'from' : 'to'}}</p>
          </b-col>
          <b-col>
            <p class="transaction-date">{{ txTimeStamp }}</p>
          </b-col>
        </b-row>

        <!-- <b-row class="hash-and-amount-container" @click="showTxDetail(transaction.hash)"> -->
        <a :href="`https://etherscan.io/tx/${transaction.hash}`" target="_blank" class="tx-link">
          <b-row class="hash-and-amount-container">
            <p class="transaction-info" v-if="txType === `converted`">
              <strong>{{transaction.from}} to {{transaction.to}}</strong>
            </p>
            <p class="transaction-info" v-else-if="txType === `received`">
              <strong>{{transaction.from}}</strong>
            </p>
            <p class="transaction-info" v-else-if="txType === `sent`">
              <strong>{{transaction.to}}</strong>
            </p>
            <p class="transaction-info" v-else>
              <strong>{{txType}}</strong>
            </p>
            <p :style="`color: ${iconColor}`">{{txSign}} {{txAmount}} {{txCurrency}}</p>
          </b-row>
        </a>
      </b-col>
      <b-modal
        :ref="transaction.hash"
        :id="transaction.hash"
        class="tx-detail-modal"
        title="Transaction Detail"
        :hide-footer="true"
      >
        <b-row>
          <b-col style="text-align: left">{{txTimeStamp}}</b-col>
          <b-col style="text-align: right">{{transaction.confirmations}} confirmations</b-col>
        </b-row>
        <b-row>
          <b-col style="text-align: left">Status:</b-col>
          <b-col style="text-align: right">{{txStatus}}</b-col>
        </b-row>

        <b-row>
          <b-col style="text-align: left">From:</b-col>
          <b-col>{{transaction.from}}</b-col>
        </b-row>
        <b-row>
          <b-col style="text-align: left">To:</b-col>
          <b-col>{{transaction.to}}</b-col>
        </b-row>
        <h3>{{txSign}} {{txAmount}} {{txCurrency}}</h3>
        <div class="transaction-hash-container">
          <a
            id="txUrl"
            target="_blank"
            rel="noopener noreferrer"
            :href="`https://etherscan.io/tx/${transaction.hash}`"
          >View tx on etherscan.io</a>
        </div>
      </b-modal>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  props: {
    transaction: {
      type: Object
    }
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getActiveToken: "getActiveToken",
      getAvailableTokenList: "account/getAvailableTokenList"
    }),
    icon: function() {
      if (this.txType === "converted") return "exchange-alt";
      else if (this.txType === "received") return "long-arrow-alt-right";
      return "long-arrow-alt-left";
    },
    iconColor: function() {
      if (this.txType === "converted") return "blue";
      else if (this.txType === "received") return "green";
      return "orange";
    },
    txType: function() {
      if (
        this.transaction.to.toLowerCase() ===
        this.getAccount.address.toLowerCase()
      )
        return "received";
      else if (
        this.transaction.from.toLowerCase() ===
        this.getAccount.address.toLowerCase()
      )
        return "sent";
      else return "unknown";
    },
    txAmount: function() {
      return (
        parseInt(this.transaction.value) /
        Math.pow(10, this.getDecimal(this.getActiveToken))
      ).toFixed(4);
    },
    txSign: function() {
      return this.txType === "received" ? "+" : "-";
    },
    txCurrency: function() {
      if (!this.transaction.tokenSymbol) return "ETH";
      else if (this.transaction.tokenSymbol)
        return this.transaction.tokenSymbol;
      else return "Token";
    },
    txTimeStamp: function() {
      return moment(this.transaction.timeStamp * 1000).calendar();
    },
    txStatus: function() {
      if (this.transaction.txreceipt_status === "0") return "Failed";
      else return "Success";
    }
  },
  methods: {
    showTxDetail(ref) {
      console.log("clicked");
      this.$refs[this.transaction.hash].show();
    },
    getDecimal(symbol) {
      let token = this.getAvailableTokenList.find(t => t.symbol === symbol);
      if (token) return token.decimal;
      else return 18;
    }
  }
};
</script>

<style>
.transaction {
  border: none;
}
.transaction .date-column {
  text-align: left;
}
.transaction .amount-column {
  text-align: right;
}
.transaction .transaction-date {
  text-align: right;
  color: #888;
  font-size: 12px;
}
.transaction .transaction-info {
  max-width: 80%;
}
.transaction .from-to-column .date-and-label-container {
  display: flex;
  justify-content: space-between;
}
.transaction .from-to-column .hash-and-amount-container {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}
.transaction .from-to-column > p {
  text-align: left;
  margin-bottom: 0.5rem;
}
.transaction .from-to-column .transaction-type {
  font-size: 0.9rem;
  color: #888;
  text-align: left;
}
.transaction .from-to-column .transaction-info {
  color: #ccc;
  color: #555;
  font-weight: 300;
}
.transaction .transaction-hash-container {
  text-align: center;
}
.transaction {
  font-size: 14px;
}
.transaction .row {
  margin: 0px 0px;
  display: flex;
  justify-content: space-between;
}
.transaction h3 {
  text-align: center;
  margin: 20px 0px;
}
.transaction .row div {
  padding: 0px;
  padding-top: 3px;
}
.transaction .modal-body {
  padding: 20px !important;
}
.transaction .modal {
  color: #333;
  position: fixed;
  top: 150px;
  font-size: 12px;
}
.transaction .modal .modal-header {
  background: #773894;
  text-align: center;
}
.transaction .modal .modal-title {
  flex-grow: 2;
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
.transaction-info {
  font-size: 13px;
  text-align: left;
}
.tx-detail-modal {
  height: 50px;
}
.tx-link:hover {
  text-decoration: none;
}
.arrow-column {
  padding: 5px;
}
</style>
