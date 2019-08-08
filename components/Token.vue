<template>
  <b-row class="token row">
    <b-col class="token-name">
      <img v-if="token.name === 'ULT'" src="../assets/logo.svg" alt />
      <img v-else-if="token.name === 'ETH'" src="../assets/eth-logo.png" alt />
      <img v-else-if="token.src" :src="token.src" alt />
      <img v-else src="../assets/default-token.png" />
      <div>
        <div class="token-symbol">{{token.name}}</div>
        <div class="token-fullname" v-if="token.name === 'ETH'">Ether</div>
        <div class="token-fullname" v-else>{{token.fullname}}</div>
      </div>
    </b-col>
    <b-col class="token-price-container">
      <div v-if="token.priceInUsd">
        <p class="token-price-in-usd" v-if="token.priceInUsd < 1">${{ token.priceInUsd.toFixed(4) }}</p>
        <p
          class="token-price-in-usd"
          v-if="token.priceInUsd >= 1"
        >${{ token.priceInUsd.toFixed(2) }}</p>
      </div>
      <div v-else>
        <p class="token-price-in-usd">-</p>
      </div>
    </b-col>
    <b-col class="token-roir-container">
      <div>
        <p
          v-bind:class="{ 'token-roir': true, 'token-has-liquidity': token.isLiquidityAdded }"
          v-if="token.roir"
        >{{ token.roir.toFixed(2) }}%</p>
        <p class="token-roir" v-else>-</p>
      </div>
    </b-col>
    <b-col class="token-amount-container">
      <div v-if="token.balance !== `NaN`">
        <p class="token-amount-usd" v-if="balanceInUsd !== '-'">${{ balanceInUsd }}</p>
        <p class="token-amount-usd" v-else>-</p>
        <p class="token-amount">{{getBalance[token.name].toFixed(4)}} {{token.name}}</p>
      </div>
      <p class="token-amount" v-else>loading...</p>
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    token: {
      type: Object
    }
  },
  computed: {
    ...mapGetters({
      getPrice: "account/getPrice",
      getBalance: "account/getBalance"
    }),
    balanceInUsd: function() {
      if (this.token.balance && this.token.priceInUsd) {
        let value = this.token.balance * this.token.priceInUsd;
        if (value >= 1) return value.toFixed(2);
        else if (value < 1) return value.toFixed(4);
        else if (value === 1) return "-";
      } else return "-";
    },
    getFullName: function(tokenId) {
      let summaryInfo = this.getSummary.find(s => s.token_id === tokenId);
      return null;
    }
  },
  methods: {
    getLogoUrl: function(tokenName) {
      if (tokenName === "ETH") return `../assets/eth-logo.png`;
      if (tokenName === "ULT") return `../assets/logo.svg`;
      if (tokenName === "DAI") return `../assets/dai-logo.png`;
    },
    wait(ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, ms);
      });
    }
  },
  mounted: async function() {}
};
</script>

<style>
.tokenlist-section .token {
  display: flex;
  justify-content: space-between;
  color: #fff;
  color: #333;
}
.tokenlist-section .token .token-name {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  padding-top: 10px;
  width: 30%;
  text-align: left;
}
.tokenlist-section .token .token-amount {
  font-size: 11px;
  font-weight: normal;
  margin: 0;
  text-align: right;
}
.tokenlist-section .token .token-amount-usd {
  font-size: 13px;
  font-weight: bolder;
  color: #1980ff;
  margin: 0;
  margin-bottom: 5px;
  text-align: right;
}
.tokenlist-section .token .token-price-container {
  width: 100px;
  left: -90px;
  position: relative;
  text-align: right;
}
.tokenlist-section .token .token-roir-container {
  width: 100px;
  left: -90px;
  position: relative;
  text-align: right;
}
.tokenlist-section .token .token-price-in-usd {
  font-size: 13px;
  margin: 0;
  margin-bottom: 5px;
  text-align: right;
  padding-top: 15px;
  font-weight: normal;
}
.tokenlist-section .token .token-roir {
  font-size: 13px;
  margin: 0;
  margin-bottom: 5px;
  text-align: right;
  padding-top: 15px;
  font-weight: normal;
}
.tokenlist-section .token .token-has-liquidity {
  font-weight: bold;
  color: #1980ff;
}
.tokenlist-section .token-name img {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
.tokenlist-section .token-name {
  display: flex;
}
.tokenlist-section .token-name .token-symbol {
  font-size: 14px;
  text-align: left;
  margin-bottom: 5px;
}
.tokenlist-section .token-name .token-fullname {
  font-size: 11px;
  text-align: left;
  color: #666;
  font-weight: normal;
}
.tokenlist-section .tokenlist-section a {
  text-decoration: none !important;
}
.tokenlist-section .token-amount-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.tokenlist-section .card-body .list-group-item.list-group-item-action {
  transition: 0.5s;
}
.tokenlist-section .card-body .list-group-item.list-group-item-action:hover {
  cursor: pointer;
  box-shadow: 0px 2px 5px #bcc0c1;
  transform: scale(1.03);
}
@media screen and (max-width: 450px) {
  .tokenlist-section .token .token-price-container {
    width: 100px;
    left: 0px;
    position: relative;
    text-align: right;
  }
  .tokenlist-section .token .token-roir-container {
    width: 100px;
    left: 0px;
    position: relative;
    text-align: right;
  }
}
</style>
