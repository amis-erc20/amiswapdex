<template>
  <div style="width: 100%">
    <div class="header-section">
      <div class="balance-summary">
        <p class="token-amount-usd" v-if="priceInUSD && currentRoute !== `/`">{{ priceInUSD }} USD</p>
        <h2 v-if="currentRoute !== `/` && getActiveToken === 'ETH'">
          {{ calculateBalance(getBalance) }}
          <span>ETH</span>
        </h2>
        <h2 v-if="currentRoute !== `/` && getActiveToken === 'ULT'">
          {{ calculateBalance(getBalanceULT) }}
          <span>ULT</span>
        </h2>
        <h2 v-if="currentRoute !== `/` && getActiveToken === 'DAI'">
          {{ calculateBalance(getBalanceDAI) }}
          <span>DAI</span>
        </h2>
        <img v-if="currentRoute === `/`" src="../assets/logo.svg" alt width="150px" height="200px">
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  getULTToUSDPrice,
  getETHToUSDPrice,
  getDAIToUSDPrice
} from "../assets/js/utils";
export default {
  data: function() {
    return {
      priceInUSD: 0
    };
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getBalance: "account/getBalance",
      getBalanceULT: "account/getBalanceULT",
      getBalanceDAI: "account/getBalanceDAI",
      getETHPrice: "account/getETHPrice",
      getULTPrice: "account/getULTPrice",
      getDAIPrice: "account/getDAIPrice",
      getActiveToken: "getActiveToken"
    }),
    currentRoute() {
      return this.$route.path;
    }
  },
  methods: {
    ...mapActions({
      updateETHPrice: "account/updateETHPrice",
      updateULTPrice: "account/updateULTPrice",
      updateDAIPrice: "account/updateDAIPrice"
    }),
    calculateBalance: function(balance) {
      let formattedBalance = parseFloat(balance / Math.pow(10, 18)).toFixed(6);
      if (Number.isNaN(formattedBalance)) return "--";
      return parseFloat(balance / Math.pow(10, 18)).toFixed(6);
    },
    refreshUSDPrices: async function() {
      let unitPriceInUSD;

      if (!this.getETHPrice || !this.getULTPrice || !this.getDAIPrice) {
        console.log(`Getting prices from server...`);
        let ultPrice = await getULTToUSDPrice();
        this.updateULTPrice(ultPrice);
        let ethPrice = await getETHToUSDPrice();
        this.updateETHPrice(ethPrice);
        let daiPrice = await getDAIToUSDPrice();
        this.updateDAIPrice(daiPrice);
      }

      await this.wait(500);

      if (this.getActiveToken === "ULT") {
        unitPriceInUSD = this.getULTPrice;
        this.priceInUSD = parseFloat(
          this.calculateBalance(this.getBalanceULT) * unitPriceInUSD
        ).toFixed(3);
      } else if (this.getActiveToken === "ETH") {
        unitPriceInUSD = this.getETHPrice;
        this.priceInUSD = parseFloat(
          this.calculateBalance(this.getBalance) * unitPriceInUSD
        ).toFixed(3);
      }
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
    let unitPriceInUSD;
    if (!this.getETHPrice || !this.getULTPrice || !this.getDAIPrice) {
      console.log(`Getting prices from server...`);
      let ultPrice = await getULTToUSDPrice();
      this.updateULTPrice(ultPrice);
      let ethPrice = await getETHToUSDPrice();
      this.updateETHPrice(ethPrice);
      let daiPrice = await getDAIToUSDPrice();
      this.updateDAIPrice(daiPrice);
    }
    if (this.getActiveToken === "ULT") {
      unitPriceInUSD = this.getULTPrice;
      this.priceInUSD = parseFloat(
        this.calculateBalance(this.getBalanceULT) * unitPriceInUSD
      ).toFixed(3);
    } else if (this.getActiveToken === "ETH") {
      unitPriceInUSD = this.getETHPrice;
      this.priceInUSD = parseFloat(
        this.calculateBalance(this.getBalance) * unitPriceInUSD
      ).toFixed(3);
    } else {
      unitPriceInUSD = this.getDAIPrice;
      this.priceInUSD = parseFloat(
        this.calculateBalance(this.getBalanceDAI) * unitPriceInUSD
      ).toFixed(3);
    }
    setInterval(this.refreshUSDPrices, 1000 * 60 * 3);
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
  padding-top: 70px;
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
  margin: 30px 20px;
  font-size: 32px;
  position: relative;
  left: -20px;
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
  border: 2px solid #e91a1c;
  color: #e91a1c;
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
</style>
