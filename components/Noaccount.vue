<template>
  <div class="no-account-container">
    <b-alert v-if="!getConnection" show variant="danger">No Internet Connection</b-alert>
    <b-alert v-if="!getServerStatus" show variant="danger">Connection Issue to Server !</b-alert>
    <div v-if="getConnection && getServerStatus">
      <div>
        <p>
          Please sign in or create a new
          <strong>uniswapDEX</strong> wallet.
        </p>
        <nuxt-link to="/signup">
          <b-button type="button" variant="outline-primary" id="backup-btn">Create Wallet</b-button>
        </nuxt-link>
        <nuxt-link to="/signin">
          <b-button type="button" variant="primary" id="backup-btn">Sign In</b-button>
        </nuxt-link>
      </div>
      <div>
        <p>
          Use
          <strong>Metamask</strong> Extension to access your wallet.
        </p>
        <nuxt-link to="/metamask">
          <b-button type="button" variant="outline-primary" id="metamask-btn">Metamask</b-button>
        </nuxt-link>
      </div>
      <div>
        <p>
          Use
          <strong>private key</strong> to access your wallet
        </p>
        <nuxt-link to="/privatekeysignin">
          <b-button type="button" variant="outline-primary" id="metamask-btn">Private Key</b-button>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      getConnection: "getConnection",
      getServerStatus: "getServerStatus"
    })
  }
};
</script>


<style>
.no-account-container {
  position: relative;
  top: 5vh;
  padding-top: 20px;
}
.no-account-container div {
  text-align: center;
  margin: 20px auto;
}
.no-account-container button {
  min-width: 110px;
  height: 40px;
  font-size: 0.8rem;
}
.no-account-container > div {
  border: 1px solid #dadada;
  padding: 25px 15px;
  width: 90%;
  max-width: 550px;
  box-shadow: none;
  border-radius: 10px;
  margin: 20px auto;
  transition: 0.5s;
}
.no-account-container > div:hover {
  box-shadow: 0px 4px 4px #dcdbdb;
}
</style>

