<template>
  <section class="new-token-container">
    <b-button
      variant="outline-danger"
      id="add-more-token"
      @click="showModal(`add_more_token_modal`)"
    >+ Add ERC-20 Token</b-button>
    <!-- add more token modal -->
    <b-modal
      ref="add_more_token_modal"
      id="add_more_token_modal"
      title="Add Token"
      :hide-footer="true"
    >
      <div>
        <label for>Please select a token to add</label>
        <v-select :options="tokenList" label="title" v-model="selectedToken">
          <template slot="option" slot-scope="option">
            <img :src="option.src" height="20px">
            {{ option.title }}
          </template>
        </v-select>
      </div>
      <div>
        <b-button
          variant="danger"
          id="add-token-button"
          @click="onAddToken"
          :disabled="isTokenValid"
        >Add Token</b-button>
      </div>
    </b-modal>
  </section>
</template>

<script>
import {
  getHistory,
  initContracts,
  getTokenHistory,
  getULTToUSDPrice,
  isIos,
  isInStandaloneMode,
  getTokenToUSDPrice
} from "../assets/js/utils";

import { mapActions, mapGetters } from "vuex";
import "vue-select/dist/vue-select.css";
import { tokenAddresses } from "../assets/js/token";

export default {
  data: function() {
    return {
      selectedToken: "",
      options: [
        {
          title: "Read the Docs",
          url: "https://codeclimate.com/github/sagalbot/vue-select"
        },
        {
          title: "View on GitHub",
          url: "https://codeclimate.com/github/sagalbot/vue-select"
        },
        {
          title: "View on NPM",
          url: "https://codeclimate.com/github/sagalbot/vue-select"
        },
        {
          title: "View Codepen Examples",
          src: "https://codeclimate.com/github/sagalbot/vue-select"
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      getTokenList: "account/getTokenList"
    }),
    tokenList: function() {
      let self = this;
      let symbolList = Object.keys(tokenAddresses);
      let options = symbolList
        .filter(
          symbol => symbol !== "ETH" && symbol !== "ULT" && symbol !== "DAI"
        )
        .filter(symbol => this.getTokenList.indexOf(symbol) === -1)
        .map(symbol => {
          return {
            title: symbol,
            src: `https://raw.githubusercontent.com/TrustWallet/tokens/master/tokens/${tokenAddresses[
              symbol
            ].toLowerCase()}.png`
          };
        });
      return options;
    },
    isTokenValid: function() {
      if (this.selectedToken) {
        if (this.selectedToken.title.length > 0) return false;
      }
      return true;
    }
  },
  methods: {
    ...mapActions({
      addToken: "account/addToken",
      updatePrice: "account/updatePrice"
    }),
    redirect(url) {
      this.$router.push(url);
    },
    showModal(ref) {
      if (this.$refs[ref]) this.$refs[ref].show();
    },
    hideModal(ref) {
      if (this.$refs[ref]) this.$refs[ref].hide();
    },
    onAddToken() {
      let self = this;
      if (this.getTokenList.indexOf(this.selectedToken.title) !== -1) {
        return;
      }
      this.addToken(this.selectedToken.title);
      this.hideModal("add_more_token_modal");
      this.selectedToken = "";
      this.getTokenList
        .filter(symbol => symbol !== "ETH" && symbol !== "ULT")
        .forEach(async symbol => {
          let tokenPrice = await getTokenToUSDPrice(symbol);
          self.updatePrice({
            symbol: symbol,
            price: tokenPrice
          });
        });
      localStorage.setItem("tokenList", JSON.stringify(this.getTokenList));
    }
  }
};
</script>

<style>
#add-more-token {
  margin: 10px auto;
  font-size: 12px;
  font-weight: bolder;
  margin-top: 20px;
}
#add_more_token_modal .modal-body {
  flex-direction: column;
}
#add_more_token_modal header {
  text-align: center;
}
#add-token-button {
  width: 100%;
  margin: 10px auto;
}
</style>
