<template>
  <div style="width: 100%">
    <div class="header-section">
      <div class="balance-summary">
        <p class="token-amount-usd" v-if="priceInUSD && currentRoute !== `/`">{{ priceInUSD }} USD</p>
        <h2 v-if="currentRoute !== `/` && getActiveToken === 'ETH'">
          {{ calculateBalance(getBalance["ETH"]) }}
          <span>ETH</span>
        </h2>
        <h2 v-if="currentRoute !== `/` && getActiveToken === 'ULT'">
          {{ calculateBalance(getBalance["ULT"]) }}
          <span>ULT</span>
        </h2>
        <h2
          v-if="currentRoute !== `/` && getActiveToken !== 'ETH' && getActiveToken !== 'ULT'"
        >{{ calculateBalance(getBalance[getActiveToken]) }}</h2>
        <div v-if="currentRoute === `/`" id="total-summary">
          <h5>Total Value</h5>
          <h2>$ {{ getTotalValue.toFixed(3) }}</h2>
        </div>
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
      priceInUSD: 0
    };
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getBalance: "account/getBalance",
      getPrice: "account/getPrice",
      getActiveToken: "getActiveToken",
      getTokenList: "account/getTokenList",
      getTotalValue: "account/getTotalValue"
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
      let formattedBalance = parseFloat(balance / Math.pow(10, 18)).toFixed(6);
      if (Number.isNaN(formattedBalance)) return "--";
      return parseFloat(balance / Math.pow(10, 18)).toFixed(6);
    },
    refreshUSDPrices: async function() {
      let self = this;
      let unitPriceInUSD;
      let shouldRefreshPrices = false;

      this.getTokenList.forEach(symbol => {
        if (!self.getPrice[symbol]) {
          shouldRefreshPrices = true;
        }
      });

      if (shouldRefreshPrices) {
        console.log(`Getting USD prices from server...`);
        let ultPrice = await getULTToUSDPrice();
        let ethPrice = await getETHToUSDPrice();

        this.updatePrice({
          symbol: "ULT",
          price: ultPrice
        });
        this.updatePrice({
          symbol: "ETH",
          price: ethPrice
        });

        this.getTokenList
          .filter(symbol => symbol !== "ETH" && symbol !== "ULT")
          .forEach(async symbol => {
            let tokenPrice = await getTokenToUSDPrice(symbol);
            self.updatePrice({
              symbol: symbol,
              price: tokenPrice
            });
          });
      }
      await this.wait(500);

      unitPriceInUSD = this.getPrice[this.getActiveToken];
      this.priceInUSD = parseFloat(
        this.calculateBalance(this.getBalance[this.getActiveToken]) *
          unitPriceInUSD
      ).toFixed(3);
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
    // let self = this;
    // let unitPriceInUSD;
    // if (!this.getPrice["ETH"]) {
    //   console.log(`Getting prices from remote server...`);
    //   let ultPrice = await getULTToUSDPrice();
    //   let ethPrice = await getETHToUSDPrice();
    //   this.updatePrice({
    //     symbol: "ULT",
    //     price: ultPrice
    //   });
    //   this.updatePrice({
    //     symbol: "ETH",
    //     price: ethPrice
    //   });
    //   this.getTokenList
    //     .filter(symbol => symbol !== "ETH" && symbol !== "ULT")
    //     .forEach(async symbol => {
    //       let tokenPrice = await getTokenToUSDPrice(symbol);
    //       self.updatePrice({
    //         symbol: symbol,
    //         price: tokenPrice
    //       });
    //     });
    // }
    // unitPriceInUSD = this.getPrice[this.getActiveToken];
    // this.priceInUSD = parseFloat(
    //   this.calculateBalance(this.getBalance[this.getActiveToken]) *
    //     unitPriceInUSD
    // ).toFixed(3);
    // setInterval(this.refreshUSDPrices, 1000 * 60 * 3);
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
  border: 2px solid #2851e4;
  color: #2851e4;
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
  font-size: 32px;
  position: relative;
  left: 0px;
  margin: 10px auto;
  font-weight: bold;
}
#total-summary h5 {
  font-size: 16px;
}
</style>
