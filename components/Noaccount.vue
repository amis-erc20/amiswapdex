<template>
  <div class="no-account-container">
    <b-alert v-if="!getConnection" show variant="danger">No Internet Connection</b-alert>
    <b-alert
      v-if="getConnection && !getServerStatus"
      show
      variant="danger"
    >Connection Issue to Server !</b-alert>
    <div v-if="getConnection && getServerStatus">
      <div class="signin-method">
        <p>
          Please sign in or create a new
          <strong>uniswapDEX</strong> wallet.
        </p>
        <b-button
          type="button"
          variant="outline-primary"
          id="backup-btn"
          @click="onSelectSignInMethod('signup')"
        >Create Wallet</b-button>
        <b-button
          type="button"
          variant="primary"
          id="backup-btn"
          @click="onSelectSignInMethod('signin')"
        >Sign In</b-button>
      </div>
      <div class="signin-method">
        <p>
          Use
          <strong>Metamask</strong> Extension to access your wallet.
        </p>
        <b-button
          type="button"
          variant="outline-primary"
          id="metamask-btn"
          @click="onSelectSignInMethod('metamask')"
        >Metamask</b-button>
      </div>
      <div class="signin-method">
        <p>
          Use
          <strong>private key</strong> to access your wallet
        </p>
        <b-button
          type="button"
          variant="outline-primary"
          id="metamask-btn"
          @click="onSelectSignInMethod('privatekey')"
        >Private Key</b-button>
        <!-- Metamask Modal -->
        <b-modal ref="signin_modal" id="signin_modal" title="Sign In" :hide-footer="true">
          <Metamask v-if="signInMethod === 'metamask'"/>
          <Privatekey v-if="signInMethod === 'privatekey'"/>
          <Signin v-if="signInMethod === 'signin'"/>
          <Signup v-if="signInMethod === 'signup'"/>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Metamask from "~/components/Metamask.vue";
import Privatekey from "~/components/Privatekey.vue";
import Signin from "~/components/Signin.vue";
import Signup from "~/components/Signup.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  data: function() {
    return {
      signInMethod: ""
    };
  },
  components: {
    Metamask,
    Privatekey,
    Signin,
    Signup
  },
  computed: {
    ...mapGetters({
      getConnection: "getConnection",
      getServerStatus: "getServerStatus"
    })
  },
  methods: {
    onSelectSignInMethod(method) {
      if (method === "metamask") this.signInMethod = "metamask";
      else if (method === "privatekey") this.signInMethod = "privatekey";
      else if (method === "signin") this.signInMethod = "signin";
      else if (method === "signup") this.signInMethod = "signup";
      this.showModal("signin_modal");
    },
    showModal(ref) {
      if (this.$refs[ref]) this.$refs[ref].show();
    }
  }
};
</script>


<style>
.no-account-container {
  padding: 20px 0px;
}
.signin-method {
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

