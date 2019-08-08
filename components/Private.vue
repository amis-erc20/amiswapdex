<template>
  <div class="private-key-section">
    <label>My Private Key</label>
    <p class="private-key" v-if="getAccount !== null">{{getAccount.privateKey.toLowerCase()}}</p>
    <qriously
      v-if="getAccount !== null"
      :value="getAccount.privateKey"
      :size="200"
      class="qr-code"
    />
    <p>Use this private key to restore account on other crypto wallets</p>
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
.private-key-section {
    text-align: center;
    width: 90%;
    max-width: 700px;
    margin: 0 auto;
    padding-top: 20px;
    height: calc(100vh - 164px);
    overflow: hidden;
}
.private-key {
  margin-bottom: 0px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  padding-bottom: 5px;
  word-break: break-word;
}
.private-key-section .qr-code {
  margin-top: 20px;
  margin-bottom: 20px;
}
.private-key-section label {
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
