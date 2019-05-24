<template>
  <nuxt-link to="/tokendetail">
    <div class="token">
      <div class="token-name">
        <img v-if="token.name === 'ULT'" src="../assets/logo.svg" alt>
        <img v-else-if="token.name === 'ETH'" src="../assets/eth-logo.png" alt>
        <img v-else-if="token.src" :src="token.src" alt>
        <img v-else src="../assets/default-token.png">
        {{token.name}}
      </div>
      <div class="token-amount-container">
        <div v-if="token.balance !== `NaN`">
          <p class="token-amount-usd" v-if="priceInUSD && priceInUSD !== `NaN`">${{ priceInUSD }}</p>
          <p class="token-amount-usd" v-else>$0.000</p>
          <p class="token-amount">{{token.balance.toFixed(4)}} {{token.name}}</p>
        </div>
        <p class="token-amount" v-else>loading...</p>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
import { getULTToUSDPrice, getETHToUSDPrice } from "../assets/js/utils";
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    token: {
      type: Object
    }
  },
  computed: {
    ...mapGetters({
      getPrice: "account/getPrice"
    })
  },
  data: function() {
    return {
      priceInUSD: null
    };
  },
  methods: {
    getLogoUrl: function(tokenName) {
      if (tokenName === "ETH") return `../assets/eth-logo.png`;
      if (tokenName === "ULT") return `../assets/logo.svg`;
      if (tokenName === "DAI") return `../assets/dai-logo.png`;
    },
    refreshUSDPrices: async function() {
      let unitPriceInUSD = this.getPrice[this.token.name];
      await this.wait(500);
      if (this.token.name !== "DAI")
        if (unitPriceInUSD < 1) {
          this.priceInUSD = parseFloat(
            this.token.balance * unitPriceInUSD
          ).toFixed(4);
        } else {
          this.priceInUSD = parseFloat(
            this.token.balance * unitPriceInUSD
          ).toFixed(2);
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
    let unitPriceInUSD = this.getPrice[this.token.name];
    await this.wait(500);

    if (unitPriceInUSD < 1) {
      this.priceInUSD = parseFloat(this.token.balance * unitPriceInUSD).toFixed(
        4
      );
    } else if (unitPriceInUSD > 1) {
      this.priceInUSD = parseFloat(this.token.balance * unitPriceInUSD).toFixed(
        2
      );
    } else {
      this.priceInUSD = 0.0;
    }
    setInterval(this.refreshUSDPrices, 60000);
  },
  updated: async function() {
    let unitPriceInUSD = this.getPrice[this.token.name];
    await this.wait(500);

    if (unitPriceInUSD < 1) {
      this.priceInUSD = parseFloat(this.token.balance * unitPriceInUSD).toFixed(
        4
      );
    } else if (unitPriceInUSD > 1) {
      this.priceInUSD = parseFloat(this.token.balance * unitPriceInUSD).toFixed(
        2
      );
    } else {
      this.priceInUSD = 0.0;
    }
  }
};
</script>

<style>
.tokenlist-section .token {
  display: flex;
  justify-content: space-between;
  color: #fff;
  color: #333;
}
.token .token-name {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  padding-top: 10px;
}
.token .token-amount {
  font-size: 11px;
  font-weight: normal;
  margin: 0;
}
.token .token-amount-usd {
  font-size: 13px;
  font-weight: bolder;
  color: #1980ff;
  margin: 0;
  margin-bottom: 5px;
  text-align: right;
}
.token-name img {
  width: 30px;
}
.tokenlist-section a {
  text-decoration: none !important;
}
.token-amount-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>
