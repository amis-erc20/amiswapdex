<template>
  <div>
    <div class="qr-scanner-container" v-if="scanning">
      <p class="camera-error-message">{{this.cameraErrorMessage}}</p>
      <qrcode-stream
        v-if="!cameraErrorMessage"
        @decode="onDecode"
        @init="onInit"
        :paused="!scanning"
        :camera="camera"
      />
      <b-button variant="primary" @click="hideScanner" class="cancel-scanner-btn">Cancel</b-button>
    </div>
    <div class="send-section" v-else>
      <div v-if="form.currency"></div>
      <p v-else>Please select ETH or token to send</p>
      <b-form @submit="onSubmit" @reset="onReset">
        <b-form-group id="exampleInputGroup1" v-if="form.currency !== null">
          <label for>Receiver Address</label>
          <div id="address-qr-btn-container">
            <b-form-input
              type="text"
              v-model="form.targetAddress"
              required
              placeholder="Enter receiver address"
              :state="validateTargetAddress"
            />
            <b-button variant="primary" id="qr-toggle-btn" @click="toggleScanner">
              <font-awesome-icon icon="qrcode" size="lg" color="#fff"/>
            </b-button>
          </div>
          <b-form-invalid-feedback :state="validateTargetAddress">Invalid Receiver Address</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group v-if="form.currency !== null && validateTargetAddress === true">
          <label for>Amount</label>
          <label class="use-all-funds" @click="useAllFunds">Use All Funds</label>
          <b-form-input
            id="amount-input"
            type="text"
            v-model="form.amount"
            required
            :placeholder="`Enter amount in ${form.currency}`"
            :state="validateAmount"
            v-on:change="updateGasLimitAndTxFee"
          />
          <b-form-invalid-feedback :state="validateAmount">{{ inputErrorMessage }}</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group v-if="form.currency !== null && validateTargetAddress">
          <b-form-checkbox switch v-model="showAdvanced" name="check-button">Show Advanced Settings</b-form-checkbox>
        </b-form-group>
        <b-form-group v-if="form.currency !== null && validateTargetAddress && showAdvanced">
          <label for="range-1">Gas Price: {{ gasPrice }} GWEI</label>
          <b-form-input
            type="range"
            id="range-1"
            v-model="gasPrice"
            min="2"
            max="30"
            @change="updateGasLimitAndTxFee"
          />
          <p>Estimated Tx Fee: {{txFee}} ETH</p>
        </b-form-group>
        <b-form-group v-if="form.currency !== null && validateTargetAddress && showAdvanced">
          <label for="range-1">Gas Limit: {{ gasLimit }} gas</label>
          <b-form-input type="text" required v-model="gasLimit"/>
        </b-form-group>
        <div class="submit-button-group">
          <b-button type="reset" variant="outline-dark">Reset</b-button>
          <b-button
            type="submit"
            variant="primary"
            :disabled="loading || !validateTargetAddress || !validateAmount"
          >Submit</b-button>
        </div>
      </b-form>
      <b-modal
        ref="success_modal_ref"
        id="success_modal"
        title="Transaction Submitted"
        :hide-footer="true"
        @hide="redirect"
      >
        <p>Your transaction is successfully submitted to Ethereum Network. Click link below to view your transaction on etherscan.io</p>
        <a
          id="txUrl"
          target="_blank"
          rel="noopener noreferrer"
          :href="`https://etherscan.io/tx/${txHash}`"
        >View tx on etherscan.io</a>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  getWeb3,
  estimateGas,
  estimateGasPrice,
  sendToken,
  signAndSendETH,
  metamaskSendEth,
  metamaskSendToken,
  isValidAddress
} from "../assets/js/utils";
import Vue from "vue";
import VueQrcodeReader from "vue-qrcode-reader";
import BigNumber from "bignumber.js";
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
  data() {
    return {
      form: {
        targetAddress: "",
        amount: "",
        currency: null
      },
      availableTokens: [
        { value: null, text: "Please select currency to send" },
        { value: "ETH", text: "ETH" },
        { value: "ULT", text: "ULT" },
        { value: "DAI", text: "DAI" }
      ],
      loading: false,
      showAdvanced: false,
      gasPrice: 0,
      gasLimit: 21000,
      txFee: 0,
      txHash: "",
      web3: null,
      inputErrorMessage: "Please input a valid amount",
      exchangeRate: null,
      scanning: false,
      camera: null,
      cameraErrorMessage: ""
    };
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getActiveToken: "getActiveToken",
      getBalance: "account/getBalance",
      getConnection: "getConnection",
      getServerStatus: "getServerStatus"
    }),
    validateTargetAddress() {
      return isValidAddress(this.form.targetAddress);
    },
    validateAmount() {
      let amount = parseFloat(this.form.amount);
      const isNaN = Number.isNaN(amount);
      if (isNaN || amount <= 0) return false;
      let txFee = this.txFee;
      let ethBalance = parseFloat(this.getBalance["ETH"]);
      if (this.form.currency === "ETH") {
        if (amount + txFee > ethBalance) {
          this.inputErrorMessage = "Not enough ETH balance or transaction fee";
          return false;
        }
      } else if (this.form.currency !== "ETH") {
        let tokenBalance = parseFloat(this.getBalance[this.form.currency]);
        console.log(`Token Balance: ${tokenBalance}`);
        if (amount > tokenBalance || txFee > ethBalance) {
          this.inputErrorMessage =
            "Not enough token balance or transaction fee";
          return false;
        }
      }
      return true;
    }
  },
  mounted: async function() {
    this.form.currency = this.getActiveToken;
    this.web3 = await getWeb3();
    let estimatedGasPriceFromNetwork = await estimateGasPrice(this.web3);
    this.gasPrice =
      parseInt(estimatedGasPriceFromNetwork / Math.pow(10, 9)) + 3;
  },
  methods: {
    ...mapActions({
      updateActiveToken: "updateActiveToken"
    }),
    showScanner() {
      this.scanning = true;
      this.camera = defaultCamera;
    },
    hideScanner() {
      this.scanning = false;
      this.camera = null;
    },
    toggleScanner() {
      if (this.scanning) this.hideScanner();
      else this.showScanner();
    },
    redirect() {
      this.$router.push("/tokendetail");
    },
    async getEstimatedGas() {
      let estimatedGas = await estimateGas(
        {
          from: this.getAccount.address,
          to: this.form.targetAddress,
          amount: parseFloat(this.form.amount || 1) * Math.pow(10, 18)
        },
        this.web3
      );
      return estimatedGas;
    },
    async updateGasLimitAndTxFee() {
      let estimatedGas = await this.getEstimatedGas();
      console.log(`Estimated Gas is: ${estimatedGas}`);
      if (estimatedGas * 2 > this.gasLimit) this.gasLimit = estimatedGas * 2;
      console.log(`Gas Limit is: ${this.gasLimit}`);
      this.txFee =
        (1.6 * this.gasLimit * parseInt(this.gasPrice) * 1000000000) /
        Math.pow(10, 18);
    },
    async onSubmit(evt) {
      evt.preventDefault();
      if (!this.getConnection) {
        alert("No Internet Connection Detected !");
        return;
      }
      if (!this.getServerStatus) {
        alert("Connection Issue to Server !");
        return;
      }
      this.loading = true;
      let web3 = this.web3;
      let txHash;
      // If user sign in with metamask
      this.form.targetAddress = this.form.targetAddress.trim().toLowerCase();
      if (this.getAccount.type === "metamask") {
        try {
          if (this.form.currency === "ETH") {
            this.txHash = await metamaskSendEth({
              from: this.getAccount.address,
              to: this.form.targetAddress,
              value: parseInt(this.form.amount * Math.pow(10, 18)),
              gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
              gasLimit: this.gasLimit
            });
          } else {
            this.txHash = await metamaskSendToken({
              from: this.getAccount.address,
              to: this.form.targetAddress,
              value: parseInt(this.form.amount * Math.pow(10, 18)),
              gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
              gasLimit: this.gasLimit,
              currency: this.form.currency
            });
          }
          if (this.txHash) {
            this.updateActiveToken(this.form.currency);
            this.onReset();
            this.loading = false;
            this.showModal("success_modal_ref");
          } else {
            this.onReset();
            this.loading = false;
            alert("Fail to submit transaction");
          }
        } catch (e) {
          this.onReset();
          this.loading = false;
          alert("Fail to submit transaction");
        }
        // If user sign in with credentials or private key
      } else {
        try {
          if (this.form.currency === "ETH")
            txHash = await signAndSendETH(
              {
                from: this.getAccount.address,
                to: this.form.targetAddress,
                amount: parseInt(this.form.amount * Math.pow(10, 18)),
                gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
                gasLimit: this.gasLimit
              },
              this.getAccount.privateKey,
              web3
            );
          else
            txHash = await sendToken(
              {
                from: this.getAccount.address,
                to: this.form.targetAddress,
                amount: parseInt(this.form.amount) * Math.pow(10, 18),
                gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
                gasLimit: this.gasLimit > 42000 ? this.gasLimit : 42000
              },
              this.form.currency,
              this.getAccount.privateKey,
              web3
            );
          this.loading = false;
          this.txHash = txHash;

          this.updateActiveToken(this.form.currency);
          this.onReset();
          this.showModal("success_modal_ref");
        } catch (e) {
          this.loading = false;
          alert(`Transaction is not submitted.`);
        }
      }
    },
    onReset(evt) {
      if (evt) evt.preventDefault();
      this.form = {
        targetAddress: "",
        amount: "",
        currency: this.getActiveToken
      };
    },
    showModal(ref) {
      this.$refs[ref].show();
    },
    hideModal(ref) {
      this.$refs[ref].hide();
    },
    async useAllFunds() {
      try {
        let estimatedGas = await estimateGas(
          {
            from: this.getAccount.address,
            to: this.form.targetAddress,
            amount: this.getBalance["ETH"]
          },
          this.web3
        );
        if (estimatedGas * 2 > this.gasLimit) this.gasLimit = estimatedGas * 2;
        this.txFee =
          (1.6 * estimatedGas * this.gasPrice * 1000000000) / Math.pow(10, 18);
        if (this.form.currency === "ETH") {
          this.form.amount = parseFloat(this.getBalance["ETH"]) - this.txFee;
        } else if (this.form.currency === "ULT") {
          this.form.amount = parseFloat(this.getBalance["ULT"]);
        } else if (this.form.currency === "DAI") {
          this.form.amount = parseFloat(this.getBalance["DAI"]);
        }
      } catch (e) {
        console.log(e);
      }
    },
    onDecode(decodedString) {
      this.form.targetAddress = decodedString;
      this.hideScanner();
    },
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        console.log(error);
        if (error.name === "NotAllowedError") {
          this.cameraErrorMessage =
            "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.cameraErrorMessage = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.cameraErrorMessage =
            "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.cameraErrorMessage = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.cameraErrorMessage = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.cameraErrorMessage =
            "ERROR: Stream API is not supported in this browser";
        }
      }
    }
  }
};
</script>

<style>
.send-section {
  color: #333;
  width: 90%;
  max-width: 650px;
  margin: 30px auto;
  text-align: center;
  padding-top: 65px;
}
.send-section img {
  width: 120px;
  margin: 20px auto;
}
.form-group {
  text-align: left;
}
.send-section form button {
  flex-grow: 1;
  margin: 20px 5px;
}
.send-section form {
  margin-bottom: 60px;
}
#success_modal {
  color: #333;
  position: fixed;
  top: 150px;
}
.use-all-funds {
  float: right;
  color: #3571ad;
  cursor: pointer;
}
.use-all-funds:hover {
  color: #17508a;
}
#address-qr-btn-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.qr-scanner-container {
  display: flex;
  justify-content: center;
}
.qr-scanner-container,
.qrcode-stream {
  height: calc(100vh - 64px);
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
  height: calc(100vh);
}
.cancel-scanner-btn {
  bottom: 100px;
  width: 110px;
  height: 50px;
  position: fixed;
}
.camera-error-message {
  position: fixed;
  top: 160px;
  z-index: 1000;
  color: #e61209;
  font-weight: bolder;
}
</style>
