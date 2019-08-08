<template>
  <div id="qr-scanner-view">
    <Nav/>
    <div class="qr-scanner-container">
      <qrcode-stream @decode="onDecode" @init="onInit" :paused="pauseQrReader" :camera="camera"/>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Vue from "vue";
import VueQrcodeReader from "vue-qrcode-reader";
import Nav from "../components/Nav.vue";
const defaultCamera = {
  audio: false, // don't request microphone access
  video: {
    facingMode: { ideal: "environment" }, // use rear camera if available
    width: { min: 360, ideal: 680, max: 1920 }, // constrain video width resolution
    height: { min: 240, ideal: 480, max: 1080 } // constrain video height resolution
  }
};

Vue.use(VueQrcodeReader);
export default {
  components: {
    Nav
  },
  data() {
    return {
      loading: false,
      address: "",
      displayQrReader: true,
      pauseQrReader: false,
      camera: defaultCamera,
      styleObject: {
        display: "none"
      },
      openDialog: false,
      dialogTitle: "",
      dialogContent: "",
      error: ""
    };
  },
  methods: {
    isValidHex(hex) {
      if (hex.length !== 42) return false;
      if (hex === "0".repeat(42)) return false;
      return true;
    },
    onDecode(decodedString) {
      this.address = decodedString;
      alert(this.dataRead);
    },
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        console.log(error);
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        }
        alert("QR Code Reader Error", this.error);
      }
    }
  }
};
</script>

<style scoped>
#qr-scanner-view {
  height: 100vh;
  overflow: hidden;
}
.qr-scanner-container,
.qrcode-stream {
  height: 100vh;
  width: 100%;
}
.qrcode-stream__inner-wrapper {
  height: 100vh;
  width: 100%;
  margin: 0 auto;
}
.qrcode-stream__camera,
.qrcode-stream__pause-frame {
  width: 100%;
  height: 100vh;
}
</style>
