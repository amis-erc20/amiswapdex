<template>
  <div>
    <!-- <p>{{form}}</p> -->
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
        <b-form-group v-if="this.sendMode === 'donation_send'" prepend="@" class="input-form-group">
          <div class="amount-label-container">
            <label>Enter USD amount to donate</label>
          </div>
          <div class="input-field-container">
            <b-form-input
              id="inputValue"
              type="text"
              v-model="form.inputValueUsd"
              required
              :state="validateUsdAmount"
              @keyup="onUsdInputChange"
            />
            <button type="button" id="erase" @click="form.inputValueUsd = ''"></button>
          </div>
          <b-form-invalid-feedback
            v-if="form.inputValueUsd"
            :state="validateUsdAmount"
          >Minimum $5 required.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
          id="exampleInputGroup1"
          v-if="form.currency !== null && sendMode !== 'donation_send'"
        >
          <label for>Receiver Address</label>
          <div id="address-qr-btn-container">
            <div class="input-field-container address-field-container">
              <b-form-input
                type="text"
                v-model="form.targetAddress"
                required
                placeholder="Enter receiver address"
                :state="validateTargetAddress"
                :disabled="sendMode === 'donation_send'"
              />
              <button
                type="button"
                id="erase"
                @click="form.targetAddress = ''"
                :disabled="sendMode === 'donation_send'"
              ></button>
            </div>
            <b-button
              variant="primary"
              id="qr-toggle-btn"
              @click="toggleScanner"
              :disabled="sendMode === 'donation_send'"
            >
              <font-awesome-icon icon="qrcode" size="2x" color="#fff" />
            </b-button>
          </div>
          <b-form-invalid-feedback
            v-if="form.targetAddress.length > 0"
            :state="validateTargetAddress"
          >Invalid Receiver Address</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group v-if="form.currency !== null">
          <div class="amount-label-container">
            <label v-if="sendMode === 'donation_send'">Enter {{form.currency}} amount to donate</label>
            <label v-else>Amount to send</label>
            <div>
              <p
                v-if="sendMode === 'donation_send'"
                class="current-balance"
              >{{getBalance['ULT']}} ULT</p>
              <p v-else class="current-balance">{{getBalance[getActiveToken]}} {{getActiveToken}}</p>
              <label class="use-all-funds" @click="useAllFunds">Use All Funds</label>
            </div>
          </div>
          <div class="input-field-container">
            <b-form-input
              id="amount-input"
              type="text"
              v-model="form.amount"
              required
              :placeholder="`Enter amount in ${form.currency}`"
              :state="validateAmount"
              @keyup="updateGasLimitAndTxFee"
            />
            <button type="button" id="erase" @click="form.amount = ''"></button>
          </div>

          <b-form-invalid-feedback
            v-if="form.amount.length > 0"
            :state="validateAmount"
          >{{ inputErrorMessage }}</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          v-if="form.currency !== null && validateTargetAddress"
          class="advanced-toggle-group"
        >
          <b-form-checkbox
            switch
            v-model="showAdvanced"
            name="check-button"
            class="show-advanced-label"
          >Show Advanced Settings</b-form-checkbox>
        </b-form-group>
        <b-form-group v-if="form.currency !== null && validateTargetAddress && showAdvanced">
          <div class="amount-label-container">
            <label for="range-1">Gas Price: {{ gasPrice }} GWEI</label>
            <div>
              <label class="reset-gas-price" @click="resetGasPrice">Reset Gas Price</label>
            </div>
          </div>
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
          <div class="amount-label-container" v-if="form.currency !== null && showAdvanced">
            <label for="range-1">Gas Limit: {{ gasLimit }} gas</label>
            <div>
              <label class="reset-gas-price" @click="resetGasLimit">Reset Gas Limit</label>
            </div>
          </div>
          <div class="input-field-container">
            <b-form-input type="text" v-model="gasLimit" required :state="validateGasLimit" />
            <button type="button" id="erase" @click="gasLimit = ''"></button>
          </div>
        </b-form-group>

        <div class="submit-button-group">
          <b-button type="reset" @click="onReset" variant="outline-dark">Reset</b-button>
          <b-button
            type="submit"
            v-if="sendMode === 'donation_send'"
            variant="primary"
            :disabled="loading || !validateTargetAddress || !validateAmount || !validateGasLimit || !validateUsdAmount"
          >Donate</b-button>
          <b-button
            type="submit"
            v-else
            variant="primary"
            :disabled="loading || !validateTargetAddress || !validateAmount || !validateGasLimit || !validateUsdAmount"
          >Send</b-button>
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
  getWeb3Metamask,
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
import { exchangeABI, tokenABI, ERC20_ABI, factoryABI } from "../assets/js/abi";
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
  props: {
    sendMode: {
      default: "swap",
      type: String
    }
  },
  data() {
    return {
      form: {
        targetAddress: "",
        amount: "",
        currency: null,
        inputValueUsd: ""
      },
      loading: false,
      showAdvanced: false,
      gasPrice: 6,
      gasLimit: 42000,
      defaultGasPrice: 6,
      defaultGasLimit: 42000,
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
      getActiveTokenAddress: "getActiveTokenAddress",
      getCurrentView: "getCurrentView",
      getBalance: "account/getBalance",
      getConnection: "getConnection",
      getServerStatus: "getServerStatus",
      getAvailableTokenList: "account/getAvailableTokenList",
      getOwnedTokenList: "account/getOwnedTokenList",
      getPrice: "account/getPrice"
    }),
    validateTargetAddress() {
      return isValidAddress(this.form.targetAddress);
    },
    validateGasLimit() {
      var reg = /^\d+$/;
      if (!reg.test(this.gasLimit)) return false;
      return !Number.isNaN(parseInt(this.gasLimit));
    },
    validateAmount() {
      var reg = /^[+-]?\d+(\.\d+)?$/;
      let check = reg.test(this.form.amount);
      if (!check) return false;
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
        if (amount > tokenBalance || txFee > ethBalance) {
          this.inputErrorMessage =
            "Not enough token balance or transaction fee";
          return false;
        }
      }
      return true;
    },
    validateUsdAmount() {
      if (this.sendMode !== "donation_send") return true;
      let amount = parseFloat(this.form.inputValueUsd * 1);
      const isNaN = Number.isNaN(amount);
      if (isNaN || amount <= 0) return false;
      if (amount < 5) return false;
      return true;
    }
  },
  errorCaptured: function(err, vm, info) {
    console.log(err);
    return false;
  },
  mounted: async function() {
    let self = this;
    if (this.sendMode !== "donation_send")
      this.form.currency = this.getActiveToken;
    if (this.sendMode === "donation_send") {
      this.prepareForDonationSend();
    }
    this.web3 = await getWeb3();
    this.updateGasPrice();
    // setInterval(() => {
    //   if (self.getCurrentView === "main") {
    //     if (self.form.amount || self.form.targetAddress) {
    //       self.onReset();
    //     }
    //   }
    // }, 1000);
  },
  updated: async function() {
    if (this.sendMode === "donation_send") this.form.currency = "ULT";
    else this.form.currency = this.getActiveToken;
  },
  methods: {
    ...mapActions({
      updateActiveToken: "updateActiveToken"
    }),
    async updateGasPrice() {
      let estimatedGasPriceFromNetwork = await estimateGasPrice(this.web3);
      console.log(
        `Estimated gas price from network: ${estimatedGasPriceFromNetwork}`
      );
      if (estimatedGasPriceFromNetwork > 0) {
        this.gasPrice =
          parseInt(estimatedGasPriceFromNetwork / Math.pow(10, 9)) + 3;
      } else {
        this.gasPrice = 6;
      }
      this.defaultGasPrice = this.gasPrice;
      this.updateGasLimitAndTxFee();
    },
    getDecimal(symbol) {
      let token = this.getAvailableTokenList.find(t => t.symbol === symbol);
      if (token) return token.decimal;
      else return 18;
    },
    async resetGasLimit() {
      this.gasLimit = this.defaultGasLimit;
      this.updateGasLimitAndTxFee();
    },
    async resetGasPrice() {
      this.gasPrice = this.defaultGasPrice;
      this.updateGasLimitAndTxFee();
    },
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
    async onUsdInputChange() {
      let usdAmount = this.form.inputValueUsd;
      if (!this.validateUsdAmount) {
        return;
      }
      let tokenToUsd = this.getPrice[this.form.currency];
      this.form.amount = parseFloat(
        parseFloat(usdAmount) / parseFloat(tokenToUsd)
      );
    },
    prepareForDonationSend() {
      this.form.currency = "ULT";
      this.form.targetAddress = "0x19caf17b4ea9f8dd9b5e8f17ab0c3c10f132691d";
    },
    async updateUsdAmount() {
      let inputAmount = this.form.amount;
      if (!this.validateAmount) {
        return;
      }

      let tokenToUsd = this.getPrice[this.form.currency];
      this.form.inputValueUsd = parseFloat(inputAmount * tokenToUsd);
    },
    async getEstimatedGas() {
      let web3 = await getWeb3Metamask();
      if (window.ethereum) {
        await window.ethereum.enable();
        web3.setProvider(window.ethereum);
      }
      let to = this.form.targetAddress || this.getAccount.address;
      let value =
        parseFloat(this.form.amount || 1) *
        Math.pow(10, this.getDecimal(this.getActiveToken));
      let gasPrice = parseInt(this.gasPrice * Math.pow(10, 9));
      let tokenAddress = this.getActiveTokenAddress;

      let selectedAddress = window.ethereum
        ? window.ethereum.selectedAddress
        : this.getAccount.address;
      let from = selectedAddress;
      let amount = web3.utils.toHex(value);
      let count = await web3.eth.getTransactionCount(selectedAddress);
      let transactionParameters;

      if (tokenAddress) {
        let contract = new web3.eth.Contract(tokenABI, tokenAddress, {
          from: from
        });

        transactionParameters = {
          from: selectedAddress,
          to: tokenAddress,
          value: "0x0",
          data: contract.methods.transfer(to, amount).encodeABI(),
          nonce: web3.utils.toHex(count),
          gasPrice: web3.utils.toHex(gasPrice)
        };
      } else {
        transactionParameters = {
          from: selectedAddress,
          to: to,
          value: amount,
          nonce: web3.utils.toHex(count),
          gasPrice: web3.utils.toHex(gasPrice)
        };
      }
      let estimatedGas = await estimateGas(transactionParameters, web3);
      return estimatedGas;
    },
    async updateGasLimitAndTxFee() {
      let estimatedGas = await this.getEstimatedGas();
      if (estimatedGas * 2 > this.gasLimit) this.gasLimit = estimatedGas * 2;
      this.txFee =
        (this.gasLimit * parseInt(this.gasPrice) * 1000000000) /
        Math.pow(10, 18);
    },
    showSuccessToast(txHash) {
      let successHTML = `<p>Your transaction is submitted to Ethereum Network.</p>`;
      this.$toasted.show(successHTML, {
        theme: "outline",
        type: "success",
        position: "top-center",
        duration: 10000,
        fullWidth: true,
        action: [
          {
            text: "View it On etherscan.io",
            onClick: (e, toastObject) => {
              toastObject.goAway(0);
              window.open(`https://etherscan.io/tx/${txHash}`, "_blank");
            }
          }
        ]
      });
    },
    async onSubmit(evt) {
      evt.preventDefault();
      let self = this;
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
              value: new BigNumber(
                this.form.amount * Math.pow(10, 18)
              ).toFixed(),
              gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
              gasLimit: this.gasLimit
            });
          } else {
            let token = this.getOwnedTokenList.find(
              t => t.symbol === self.form.currency
            );
            this.txHash = await metamaskSendToken({
              from: this.getAccount.address,
              to: this.form.targetAddress,
              value: new BigNumber(
                this.form.amount *
                  Math.pow(10, this.getDecimal(this.getActiveToken) || 18)
              ).toFixed(),
              gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
              gasLimit: this.gasLimit,
              currency: this.form.currency,
              tokenAddress: token.tokenAddress
            });
          }
          if (this.txHash) {
            this.updateActiveToken(this.form.currency);
            this.onReset();
            this.loading = false;
            this.showSuccessToast(this.txHash);
          } else {
            // this.onReset();
            // this.loading = false;
            // alert("Fail to submit transaction");
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
          else {
            let token = this.getOwnedTokenList.find(
              t => t.symbol === self.form.currency
            );
            txHash = await sendToken(
              {
                from: this.getAccount.address,
                to: this.form.targetAddress,
                amount:
                  parseInt(this.form.amount) *
                  Math.pow(10, this.getDecimal(this.getActiveToken)),
                gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
                gasLimit: this.gasLimit > 42000 ? this.gasLimit : 42000
              },
              this.form.currency,
              this.getAccount.privateKey,
              web3,
              token.tokenAddress
            );
          }

          this.loading = false;
          this.txHash = txHash;

          this.updateActiveToken(this.form.currency);
          this.onReset();
          // this.showModal("success_modal_ref");
          this.showSuccessToast(this.txHash);
        } catch (e) {
          this.loading = false;
          console.log(e);
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
      if (this.sendMode === "donation_send") this.prepareForDonationSend();
    },
    showModal(ref) {
      this.$refs[ref].show();
    },
    hideModal(ref) {
      this.$refs[ref].hide();
    },
    async useAllFunds() {
      try {
        if (this.form.currency === "ETH") {
          this.form.amount = parseFloat(this.getBalance["ETH"]) - this.txFee;
        } else if (this.form.currency !== "ETH") {
          this.form.amount = parseFloat(this.getBalance[this.getActiveToken]);
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
  max-width: 700px;
  margin: 20px auto;
  text-align: center;
  padding-top: 20px;
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
  color: #3571ad;
  cursor: pointer;
  text-align: right;
  width: 100px;
  margin-bottom: 10px;
}
.amount-label-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.amount-label-container div {
  display: flex;
  justify-content: flex-end;
  width: 80%;
}
.amount-label-container .current-balance {
  font-size: 12px;
  margin-bottom: 10px;
}
.use-all-funds:hover {
  color: #17508a;
}
#address-qr-btn-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}
.qr-scanner-container {
  display: flex;
  justify-content: center;
  background: #333;
}
#qr-toggle-btn {
  margin: 0;
  margin-left: 10px;
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
.toasted.outline.success {
  padding-top: 15px;
  color: #4caf50;
  border-color: #4caf50;
}
.send-section .form-group {
  height: 80px;
}
.clear-button {
  border: 1px solid red !important;
  width: 50px;
}
.input-field-container {
  position: relative;
  width: 100%;
}
.input-field-container.address-field-container {
  position: relative;
  width: 90%;
}
#erase {
  position: absolute;
  width: 40px !important;
  height: 35px !important;
  right: -5px;
  border: 0px solid #0cc7ae !important;
  top: -19px;
  outline: none;
  text-align: center;
  font-weight: bold;
  padding: 2px;
  background: transparent;
}
.advanced-toggle-group {
  height: auto !important;
  padding-top: 5px;
}
.show-advanced-label label {
  padding-top: 5px;
}
</style>
