<template>
  <div style="width: 100%">
    <div class="header-section">
      <div class="balance-summary">
        <p class="token-amount-usd" v-if="priceInUSD && currentRoute !== `/`">{{ priceInUSD }} USD</p>
        <h2>
          {{ calculateBalance(getBalance[getActiveToken]) }}
          <span>{{getActiveToken}}</span>
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  getULTToUSDPrice,
  getETHToUSDPrice,
  getTokenToUSDPrice
} from "../assets/js/utils";
export default {
  data: function() {
    return {
      priceInUSD: 0,
      balanceList: {}
    };
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getBalance: "account/getBalance",
      getPrice: "account/getPrice",
      getActiveToken: "getActiveToken",
      getTokenList: "account/getTokenList",
      getTotalValue: "account/getTotalValue",
      getActiveTab: "getActiveTab"
    }),
    currentRoute() {
      return this.$route.path;
    }
  },
  methods: {
    ...mapActions({
      updatePrice: "account/updatePrice"
    }),
    calculateBalance: function(balance) {
      if (!balance) return 0.0;
      return balance.toFixed(4);
    },
    wait(ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, ms);
      });
    }
  },
  mounted: async function() {
    let self = this;
    setInterval(() => {
      self.balanceList = self.getBalance;
    }, 2000);
  }
};
</script>

<style>
.header-section {
  height: auto;
  min-height: 100px;
  width: 100%;
  color: #fff;
  color: #333;
  padding-top: 30px;
}
#button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.header-section h2 {
  font-weight: 300;
}
.header-section .modal {
  color: #333;
}
.balance-summary {
  display: flex;
  justify-content: center;
}
.balance-summary .token-amount-usd {
  position: relative;
  left: 65px;
  top: 10px;
  font-size: 13px;
  font-weight: lighter;
}
.balance-summary h2 {
  margin: 25px 20px;
  margin-top: 15px;
  font-weight: normal;
  position: relative;
  left: -20px;
  color: #2a324e;
}
.balance-summary h2 > span {
  font-size: 18px;
}
#send-button,
#receive-button,
#swap-button {
  width: 100px;
  max-width: 25vw;
  height: 50px;
  border-radius: 50px !important  ;
  margin: 10px;
  font-size: 0.8rem;
  cursor: pointer;
  text-transform: uppercase;
}
#receive-button {
  border: 2px solid #68d280;
  color: #68d280;
  font-weight: bolder;
}
#send-button {
  border: 2px solid #773894;
  color: #773894;
  font-weight: bolder;
}
#swap-button {
  border: 2px solid #1e87e0;
  color: #1e87e0;
  font-weight: bolder;
}
#send-button:hover,
#receive-button:hover,
#swap-button:hover {
  color: #fff;
}
#total-summary {
  text-align: center;
}
#total-summary h2 {
  font-size: 45px;
  position: relative;
  left: 0px;
  margin: 10px auto;
  font-weight: normal;
  color: #2f3c42;
}
#total-summary h5 {
  font-size: 16px;
}
</style>
