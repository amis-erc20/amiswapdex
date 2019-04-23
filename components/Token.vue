<template>
  <nuxt-link to="/tokendetail">
    <div class="token">
      <div class="token-name">
        <img v-if="token.name === 'ULT'" src="../assets/logo.svg" alt>
        <img v-else-if="token.name === 'ETH'" src="../assets/eth-logo.png" alt>
        <img v-else :src="token.src" alt>
        {{token.name}}
      </div>
      <div class="token-amount-container">
        <div v-if="token.balance !== `NaN`">
          <p class="token-amount-usd" v-if="priceInUSD && priceInUSD !== `NaN`">{{ priceInUSD }} USD</p>
          <p class="token-amount-usd" v-else>--</p>
          <p class="token-amount">{{token.balance}} {{token.name}}</p>
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
        this.priceInUSD = parseFloat(
          this.token.balance * unitPriceInUSD
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
    let unitPriceInUSD = this.getPrice[this.token.name];
    await this.wait(500);
    this.priceInUSD = parseFloat(this.token.balance * unitPriceInUSD).toFixed(
      3
    );
    setInterval(this.refreshUSDPrices, 60000);
  },
  updated: async function() {
    let unitPriceInUSD = this.getPrice[this.token.name];
    await this.wait(500);
    this.priceInUSD = parseFloat(this.token.balance * unitPriceInUSD).toFixed(
      3
    );
    setInterval(this.refreshUSDPrices, 60000);
  }
};
</script>

<style>
.token {
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
  font-size: 12px;
  font-weight: bolder;
  margin: 0;
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
