<template>
  <div class="receive-section">
    <label>My address</label>
    <p class="account-address" v-if="getAccount !== null">{{getAccount.address.toLowerCase()}}</p>
    <!-- <p
      class="account-address"
      v-if="getAccount !== null"
    >{{getAccount.address.substr(0, getAccount.address.length / 2).toLowerCase()}}</p>
    <p
      class="account-address"
      v-if="getAccount !== null"
    >{{getAccount.address.substr(getAccount.address.length / 2, getAccount.address.length / 2).toLowerCase()}}</p>-->
    <b-button
      id="copy-button"
      type="reset"
      @click="onCopy"
      variant="outline-danger"
      size="sm"
    >Copy address</b-button>
    <qriously v-if="getAccount !== null" :value="getAccount.address" :size="200" class="qr-code"/>
    <p>
      Please send only
      <strong>Ether</strong> and
      <strong>ERC-20 Tokens</strong> to this address.
    </p>
    <b-modal ref="copied-modal" id="copied-modal" title="Address Copied" :hide-footer="true">
      <p class="my-4">Address is copied to clipboard !</p>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount"
    })
  },
  methods: {
    copyToClipboard(str) {
      const el = document.createElement("textarea");
      el.value = str;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      const selected =
        document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false;
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      if (selected) {
        // If a selection existed before copying
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }
    },
    onCopy() {
      console.log("copying..now");
      // if (this.iOSSafari()) {
      //   this.iosCopyClipboard()
      //   this.$refs["copied-modal"].show();
      //   return
      // }
      // this.copyToClipboard(this.getAccount.address.toLowerCase());
      this.iosCopyClipboard(this.getAccount.address.toLowerCase());
      this.$refs["copied-modal"].show();
    },
    isIosSafari() {
      var ua = window.navigator.userAgent;
      var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
      var webkit = !!ua.match(/WebKit/i);
      var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
      return iOSSafari;
    },
    iosCopyClipboard(str) {
      const el = document.createElement("textarea");
      el.value = str;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";

      el.contentEditable = true;
      el.readOnly = false;

      document.body.appendChild(el);
      const selected =
        document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false;
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      if (selected) {
        // If a selection existed before copying
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }
    }
  }
};
</script>

<style>
.receive-section {
  text-align: center;
  width: 90%;
  max-width: 500px;
  margin: 0 auto;
  padding-top: 55px;
  height: calc(100vh - 64px);
}
.account-address {
  margin-bottom: 0px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  padding-bottom: 5px;
}
.receive-section .qr-code {
  margin-top: 20px;
}
.receive-section label {
  color: #aaa;
  font-size: 11px;
}
.warn-message {
  margin-top: 30px;
  font-size: 13px;
}
#copy-button {
  margin: 10px auto;
}
.nav-pills .nav-link.active,
.nav-pills .show > .nav-link {
  color: #333 !important;
  background-color: #fff !important;
}

#copied-modal {
  color: #333;
  position: fixed;
  top: 150px;
}
</style>
