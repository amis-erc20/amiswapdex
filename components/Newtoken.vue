<template>
  <section class="new-token-container">
    <b-button
      variant="outline-danger"
      id="add-more-token"
      @click="showModal(`add_more_token_modal`)"
    >+ Add Token to Wallet</b-button>
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
            <img v-if="option.src" :src="option.src" height="20px">
            <img v-else src="../assets/default-token.png" height="20px">
            {{ option.title }}
          </template>
        </v-select>
      </div>
      <div>
        <b-button
          variant="primary"
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
  getTokenToUSDPrice,
  getAllListedToken,
  checkImageExist
} from "../assets/js/utils";

import { mapActions, mapGetters } from "vuex";
import "vue-select/dist/vue-select.css";
// import { tokenAddresses } from "../assets/js/token";

export default {
  data: function() {
    return {
      selectedToken: "",
      tokenAddresses: []
    };
  },
  computed: {
    ...mapGetters({
      getTokenList: "account/getTokenList",
      getAvailableTokenList: "account/getAvailableTokenList"
    }),
    tokenList: function() {
      let self = this;
      let symbolList = Object.keys(self.tokenAddresses);
      let options = self.getAvailableTokenList.map(token => {
        return {
          title: token.symbol,
          src: token.logo
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
      let foundToken = self.getAvailableTokenList.find(
        t => t.symbol == self.selectedToken.title
      );
      console.log(foundToken);
      this.addToken({
        symbol: foundToken.symbol,
        balance: 0,
        tokenAddresses: foundToken.tokenAddress,
        priceInUsd: 0
      });
      this.hideModal("add_more_token_modal");
      this.selectedToken = "";
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
#add_more_token_modal {
  top: 200px;
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
