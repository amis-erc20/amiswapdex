<template>
  <div>
    <p style="display: none">{{donationCurrency}}</p>
    <Loading v-if="isLoadingWallet" message="Loading Wallet" />
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
    <b-alert
      v-if="!validateInputLiquidity"
      show
      fade
      variant="danger"
    >{{form.inputCurrency}} has no liquidity</b-alert>
    <b-alert
      v-if="!validateOutputLiquidity"
      show
      fade
      variant="danger"
    >{{form.outputCurrency}} has no liquidity</b-alert>
    <div
      id="uniswap-convert-section"
      v-show="!scanning && !isLoadingWallet && validateInputLiquidity && validateOutputLiquidity"
    >
      <div>
        <b-button-group class="buy-or-sell" v-show="swapMode === 'swap'">
          <b-button
            v-bind:class="{ selected: isBuySelected }"
            class="switch-buy"
            @click="changeSelected('buy')"
          >Buy {{ getActiveToken }}</b-button>
          <b-button
            v-bind:class="{ selected: isSellSelected }"
            class="switch-sell"
            @click="changeSelected('sell')"
          >Sell {{ getActiveToken }}</b-button>
        </b-button-group>
      </div>
      <div v-if="!shouldRender" class="no-exchange-yet">
        <p>
          <strong>{{ getActiveToken }}</strong> does not have an uniswap exchange yet. Go to exchange tab and list the token frist.
        </p>
      </div>
      <b-form @submit="onSubmit" @reset="onReset" v-if="shouldRender">
        <b-form-group v-if="isBuySelected && swapMode === 'swap'" id="exampleInputGroup1">
          <label v-if="swapMode === 'swap'">Pay With</label>
          <label v-else>Donate with</label>
          <v-select
            :options="availableInputTokens"
            label="title"
            placeholder="Please select a currency"
            @input="onSelectInputCurrency"
            :disabled="isSellSelected"
            :value="form.inputCurrency"
            :clearable="false"
          >
            <template slot="option" slot-scope="option">
              <img v-if="option.src" :src="option.src" height="20px" width="20px" />
              <img
                v-else-if="option.title==='ETH'"
                src="../assets/eth-logo.png"
                height="20px"
                width="20px"
              />
              <img v-else src="../assets/default-token.png" height="20px" width="20px" />
              {{ option.title }}
            </template>
          </v-select>
        </b-form-group>

        <b-form-group v-if="isSellSelected" id="exampleInputGroup1">
          <label>Receive In</label>
          <v-select
            :options="availableOutputTokens"
            label="title"
            placeholder="Please select a curreny"
            @input="onSelectOutputCurrency"
            :disabled="isBuySelected"
            :value="form.outputCurrency"
            :clearable="false"
          >
            <template slot="option" slot-scope="option">
              <img v-if="option.src" :src="option.src" height="20px" width="20px" />
              <img
                v-else-if="option.title==='ETH'"
                src="../assets/eth-logo.png"
                height="20px"
                width="20px"
              />
              <img v-else src="../assets/default-token.png" height="20px" width="20px" />
              {{ option.title }}
            </template>
          </v-select>
        </b-form-group>

        <b-form-group
          v-if="this.validateCurrency && swapMode==='donation_swap'"
          prepend="@"
          class="input-form-group"
        >
          <div class="amount-label-container">
            <label>USD amount to donate</label>
          </div>
          <div class="input-field-container">
            <b-form-input
              id="inputValue"
              type="text"
              v-model="form.inputValueUsd"
              required
              :state="validateUsdAmount"
              @keyup="onUsdInputChange"
              @focus="onInputFocus"
            />
            <button type="button" id="erase" @click="form.inputValue = ''"></button>
          </div>
          <b-form-invalid-feedback
            v-if="form.inputValueUsd"
            :state="validateUsdAmount"
          >Minimum $5 required.</b-form-invalid-feedback>
        </b-form-group>
        <p style="display: none">{{getBalance}}</p>
        <b-form-group v-if="this.validateCurrency" prepend="@" class="input-form-group">
          <div class="amount-label-container">
            <label v-if="swapMode === 'swap'">Enter {{form.inputCurrency}} amount to sell</label>
            <label v-else>{{form.inputCurrency}} amount to donate</label>
            <div>
              <p
                class="current-balance"
              >{{getBalance[form.inputCurrency || 'ETH'] || 0.0}} {{form.inputCurrency || ETH}}</p>
              <label class="use-all-funds" @click="useAllFunds">Use All Funds</label>
            </div>
          </div>
          <div class="input-field-container">
            <b-form-input
              id="inputValue"
              type="text"
              v-model="form.inputValue"
              required
              :state="validateinputValue && validateBalance && validateSlippage"
              @keyup="onAmountChange"
              @focus="onInputFocus"
            />
            <button type="button" id="erase" @click="form.inputValue = ''"></button>
          </div>
          <b-form-invalid-feedback
            v-if="form.inputValue.length > 0"
            :state="validateinputValue && validateBalance && validateSlippage"
          >{{ inputErrorMessage }}</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          v-if="this.validateCurrency"
          v-show="swapMode === 'swap'"
          class="input-form-group"
        >
          <label for>{{form.outputCurrency}} amount to recieve</label>
          <div class="input-field-container">
            <b-form-input
              id="inputValue"
              type="text"
              v-model="form.outputValue"
              required
              :state="validateOutputAmount"
              @keyup="onAmountChange"
              @focus="onOutputFocus"
            />
            <button type="button" id="erase" @click="form.outputValue = ''"></button>
          </div>
          <b-form-invalid-feedback
            v-if="form.outputValue.length > 0"
            :state="validateOutputAmount"
          >{{ outputErrorMessage }}</b-form-invalid-feedback>
        </b-form-group>

        <div
          class="exchange-info-container"
          v-if="slippage && exchangeRate && validateinputValue && validateOutputAmount"
        >
          <b-form-group v-if="form.inputCurrency !== null">
            <label for>Exchange Rate</label>
            <p>1 {{form.inputCurrency}} = {{exchangeRate.toFixed(5)}} {{form.outputCurrency}}</p>
          </b-form-group>
          <b-form-group v-if="form.inputCurrency !== null">
            <label for>Slippage</label>
            <p>{{ slippage.toFixed(2) }} %</p>
          </b-form-group>
        </div>

        <b-form-group v-if="form.inputCurrency !== null" class="advanced-toggle-group">
          <b-form-checkbox
            switch
            v-model="showAdvanced"
            name="check-button"
            class="show-advanced-label"
          >Show Advanced Settings</b-form-checkbox>
        </b-form-group>

        <b-form-group
          class="input-form-group"
          id="exampleInputGroup1"
          v-if="form.inputCurrency !== null && showAdvanced"
        >
          <label for>Receiver Address</label>
          <div id="address-qr-btn-container">
            <div class="input-field-container address-field-container">
              <b-form-input
                type="text"
                v-model="form.targetAddress"
                placeholder="Enter receiver address"
                :state="validateTargetAddress"
                :disabled="swapMode === 'donation_swap'"
              />
              <button
                type="button"
                id="erase"
                @click="form.targetAddress = ''"
                :disabled="swapMode === 'donation_swap'"
              ></button>
            </div>
            <b-button
              variant="primary"
              id="qr-toggle-btn"
              @click="toggleScanner"
              :disabled="swapMode === 'donation_swap'"
            >
              <font-awesome-icon icon="qrcode" size="2x" color="#fff" />
            </b-button>
          </div>
          <b-form-invalid-feedback
            v-if="form.targetAddress.length > 0"
            :state="validateTargetAddress"
          >Invalid Receiver Address</b-form-invalid-feedback>
        </b-form-group>
        <p id="bad-token-message" v-if="isBadToken">
          Warning not all tokens will work with Uniswap. Read
          <a
            target="_blank"
            href="https://www.reddit.com/r/UniSwap/comments/c0k63p/contract_not_working/"
          >this</a> and make sure that your token contract is compatible with Uniswap.
        </p>
        <b-form-group v-if="form.inputCurrency !== null && showAdvanced">
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
        <b-form-group v-if="form.inputCurrency !== null && showAdvanced">
          <div class="amount-label-container" v-if="form.inputCurrency !== null && showAdvanced">
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
        <!-- <p>{{this.form}}</p> -->
        <div class="submit-button-group">
          <b-button type="reset" variant="outline-dark">Reset</b-button>
          <b-button
            type="submit"
            v-if="swapMode === 'donation_swap'"
            variant="primary"
            :disabled="shouldDisableSwapButton"
          >Donate</b-button>
          <b-button
            type="submit"
            v-else-if="isBuySelected"
            variant="primary"
            :disabled="shouldDisableSwapButton"
          >Buy</b-button>
          <b-button
            type="submit"
            v-else-if="isSellSelected"
            variant="primary"
            :disabled="shouldDisableSwapButton"
          >Sell</b-button>
        </div>
      </b-form>
      <!-- Success Modal -->
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
      <!-- Fail Modal -->
      <b-modal
        ref="failed_model_ref"
        id="success_modal"
        title="Transaction Failed"
        :hide-footer="true"
      >
        <p>Error occour while trying to submit transaction</p>
      </b-modal>
      <!-- Unlock Request -->
      <b-modal
        ref="unlock_request_modal_ref"
        id="unlock_request_modal"
        title="Unlock Your Token"
        :hide-footer="true"
      >
        <b-form @submit="onUnlock" v-if="approvedStatus === false">
          <b-form-group id="exampleInputGroup1">
            <label>Amount to Unlock</label>
            <b-form-input type="text" v-model="form.approvedAmount" />
          </b-form-group>
          <b-button type="submit" variant="outline-danger">Approve</b-button>
        </b-form>
        <p v-else-if="approvedStatus === `waiting`">Approving...pls wait a few moments</p>
        <p v-else-if="approvedStatus === `waiting` && unlockTxHash">
          See your approval tx on
          <a
            id="txUrl"
            target="_blank"
            rel="noopener noreferrer"
            :href="`https://etherscan.io/tx/${unlockTxHash}`"
          >etherscan.io</a>
        </p>
        <p
          v-else-if="approvedStatus === true"
        >Your approval is confirmed on Ethereum Network!. You can submit the transaction now.</p>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import { exchangeABI, tokenABI, ERC20_ABI } from "../assets/js/abi";
import {
  getWeb3,
  estimateGas,
  estimateGasForSwap,
  estimateGasPrice,
  sendToken,
  signAndSendETH,
  swapTokenToEth,
  unlockToken,
  swapEthToToken,
  swapTokenToToken,
  metamaskSwap,
  hasTokenUniswap,
  isValidAddress,
  unlockTokenMetamask,
  getWeb3Metamask,
  currency,
  getCurrentReserve,
  getEthToUsdcPrice,
  getETHToUSDPrice,
  submitTxIdToServer
} from "../assets/js/utils";
import BigNumber from "bignumber.js";
import Vue from "vue";
import VueQrcodeReader from "vue-qrcode-reader";
import Loading from "~/components/Loading.vue";
const defaultCamera = {
  audio: false, // don't request microphone access
  video: {
    facingMode: { ideal: "environment" }, // use rear camera if available
    width: { min: 360, ideal: 680, max: 1920 }, // constrain video width resolution
    height: { min: 240, ideal: 480, max: 1080 } // constrain video height resolution
  }
};
Vue.use(VueQrcodeReader);
let exchangeContracts = {};
let tokenAddressess = {};
let tokenContracts = {};
export default {
  components: {
    Loading
  },
  props: {
    swapMode: {
      default: "swap",
      type: String
    },
    donationCurrency: {
      default: "ETH",
      type: String
    }
  },
  data() {
    return {
      config: {
        mainToken: {
          symbol: "ULT",
          exchangeAddress: "0x28d9353611C5A0d5a026A648c05E5d6523e41CBf"
        },
        tokenListUrl: "https://beta.shardus.com/assets/js/tokenDB.json",
        colorScheme: {
          mainColor: "red",
          secondaryColor: "black"
        },
        logoUrl: "https://beta.shardus.com/assets/img/logo.svg",
        widgetTitle: ""
      },
      web3: null,
      web3Metamask: null,
      ALLOWED_SLIPPAGE: 0,
      mainToken: "ULT",
      account: null,
      form: {
        inputCurrency: null,
        outputCurrency: null,
        inputValue: "",
        inputValueUsd: "",
        outputValue: "",
        approvedAmount: 0,
        targetAddress: ""
      },
      loading: false,
      showAdvanced: false,
      gasPrice: 6,
      gasLimit: 80000,
      defaultGasPrice: 6,
      defaultGasLimit: 80000,
      txFee: 0,
      txHash: "",
      approvedStatus: "",
      lastEditedField: "",
      unlockTxHash: "",
      inputErrorMessage: "Please input a valid amount",
      outputErrorMessage: "Please input a valid amount",
      slippage: null,
      isBuySelected: true,
      isSellSelected: false,
      scanning: false,
      camera: null,
      cameraErrorMessage: "",
      ethToUsd: null
    };
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getTokenList: "account/getTokenList",
      getPrice: "account/getPrice",
      getAvailableTokenList: "account/getAvailableTokenList",
      getBadTokenList: "account/getBadTokenList",
      getAvailableTokenAddresses: "account/getAvailableTokenAddresses",
      getAvailableExchangeAddresses: "account/getAvailableExchangeAddresses",
      getActiveToken: "getActiveToken",
      getActiveTokenAddress: "getActiveTokenAddress",
      getCurrentView: "getCurrentView",
      getBalance: "account/getBalance",
      getConnection: "getConnection",
      getServerStatus: "getServerStatus",
      getSummary: "getSummary",
      getAllTokenPrice: "getAllTokenPrice",
      getOwnedTokenList: "account/getOwnedTokenList",
      getSignIn: "getSignIn"
    }),
    shouldRender: function() {
      if (this.getActiveToken === "ETH") return true;
      if (hasTokenUniswap(this.getActiveToken)) return true;
      else return false;
    },
    isBadToken: function() {
      let self = this;
      let token = this.getAvailableTokenList.find(
        t => t.symbol === self.getActiveToken
      );
      if (!token) return true;
      let badToken = this.getBadTokenList.find(
        t => t.tokenAddress.toLowerCase() === token.tokenAddress.toLowerCase()
      );
      if (badToken) {
        console.log(`BAD TOKEN: ${badToken.tokenAddress}`);
        return badToken;
      }
      return false;
    },
    availableTokens: function() {
      let self = this;
      let options = this.getAvailableTokenList
        .map(token => token.symbol)
        .sort()
        .map(symbol => {
          return {
            value: symbol,
            text: symbol
          };
        });
      options.unshift({ value: "ETH", text: "ETH" });
      options.unshift({ value: null, text: "Please select currency" });
      return options;
    },
    tokenList: function() {
      let options = this.getAvailableTokenList.map(token => {
        return {
          title: token.symbol,
          src: token.logo
        };
      });
      options.unshift({ title: "ETH", src: null });
      return options;
    },
    availableInputTokens: function() {
      let self = this;
      let list = this.getTokenList
        .map(symbol => {
          let token = self.getAvailableTokenList.find(t => t.symbol === symbol);
          if (token)
            return {
              title: symbol,
              balance: self.getBalance[symbol],
              priceInUsd: self.getPrice[symbol],
              src: token ? token.logo : null,
              tokenAddress: token ? token.tokenAddress : null
            };
          else return null;
        })
        .filter(t => t !== null)
        .filter(t => t.balance > 0 && t.title !== self.form.outputCurrency)
        .sort((a, b) => b.priceInUsd - a.priceInUsd);
      list.unshift({ title: "ETH", src: null });
      return list;
    },
    availableOutputTokens() {
      let self = this;
      let inputCurrency = this.form.inputCurrency;
      let tokenList = this.getAvailableTokenList
        .map(token => {
          let summary = self.getSummary.find(t => t.token_id === token.id);
          return {
            ...token,
            liquidity: summary ? summary.liquidity : 0
          };
        })
        .filter(token => token.liquidity > 0)
        .sort((a, b) => b.liquidity - a.liquidity)
        .map(token => {
          return {
            title: token.symbol,
            src: token.logo
          };
        });
      tokenList.unshift({ title: "ETH", src: null });
      if (this.form.inputCurrency === null) return tokenList;
      else return tokenList.filter(token => token.title !== inputCurrency);
    },
    swapType() {
      if (
        this.form.inputCurrency !== "ETH" &&
        this.form.outputCurrency === "ETH"
      )
        return "TOKEN_TO_ETH";
      else if (
        this.form.inputCurrency === "ETH" &&
        this.form.outputCurrency !== "ETH"
      )
        return "ETH_TO_TOKEN";
      else return "TOKEN_TO_TOKEN";
    },
    validateGasLimit() {
      var reg = /^\d+$/;
      if (!reg.test(this.gasLimit)) return false;
      return !Number.isNaN(parseInt(this.gasLimit));
    },
    validateUsdAmount() {
      if (this.swapMode !== "donation_swap") return true;
      let amount = parseFloat(this.form.inputValueUsd * 1);
      const isNaN = Number.isNaN(amount);
      if (isNaN || amount <= 0) return false;
      if (amount < 5) return false;
      return true;
    },
    validateinputValue() {
      let amount = parseFloat(this.form.inputValue * 1);
      const isNaN = Number.isNaN(amount);
      if (isNaN || amount <= 0) return false;
      return true;
    },
    validateOutputAmount() {
      const amount = parseFloat(this.form.outputValue * 1);
      return Number.isNaN(amount) === false && amount > 0;
    },
    validateCurrency() {
      if (this.form.inputCurrency === null || this.form.outputCurrency === null)
        return false;
      if (this.form.inputCurrency === this.form.outputCurrency) return false;
      else return true;
    },
    validateBalance() {
      if (!this.validateinputValue) return false;
      let amount = parseFloat(this.form.inputValue * 1);
      let txFee = this.txFee;
      let ethBalance = parseFloat(this.getBalance["ETH"]);

      if (this.form.inputCurrency === "ETH") {
        if (amount + txFee > ethBalance) {
          this.inputErrorMessage = "Not enough ETH balance or transaction fee";
          return false;
        }
      } else {
        let tokenBalance = parseFloat(this.getBalance[this.form.inputCurrency]);
        if (amount > tokenBalance || txFee > ethBalance) {
          this.inputErrorMessage =
            "Not enough token balance or transaction fee";
          return false;
        }
      }
      return true;
    },
    validateSlippage() {
      if (this.slippage > 10) {
        this.inputErrorMessage =
          "Slippage is too high. Please reduce amount to convert";
        return false;
      }
      return true;
    },
    shouldDisableSwapButton() {
      return (
        this.loading ||
        !this.validateCurrency ||
        !this.validateinputValue ||
        !this.validateOutputAmount ||
        !this.validateBalance ||
        !this.validateSlippage ||
        !this.validateGasLimit ||
        !this.validateUsdAmount ||
        this.isBadToken
      );
    },
    validateTargetAddress() {
      return isValidAddress(this.form.targetAddress);
    },
    validateInputLiquidity() {
      let self = this;
      if (this.form.inputCurrency === "ETH") return true;
      if (this.form.inputCurrency === null) return true;
      let token = this.getAvailableTokenList.find(
        t =>
          t.symbol === this.form.inputCurrency &&
          t.tokenAddress.toLowerCase() ===
            self.getActiveTokenAddress.toLowerCase()
      );
      if (!token) return false;
      let summary = this.getSummary.find(s => s.token_id === token.id);
      if (!summary) return false;
      if (summary.liquidity > 0) return true;
      else return false;
    },
    validateOutputLiquidity() {
      let self = this;
      if (this.form.outputCurrency === "ETH") return true;
      if (this.form.outputCurrency === null) return true;
      let token = this.getAvailableTokenList.find(
        t =>
          t.symbol === this.form.outputCurrency &&
          t.tokenAddress.toLowerCase() ===
            self.getActiveTokenAddress.toLowerCase()
      );
      if (!token) return false;
      let summary = this.getSummary.find(s => s.token_id === token.id);
      if (!summary) return false;
      if (summary.liquidity > 0) return true;
      else return false;
    },
    isLoadingWallet: function() {
      if (this.getSignIn && this.getOwnedTokenList.length === 0) return true;
      else return false;
    }
  },
  updated: function() {
    if (this.swapMode === "swap") {
      if (
        this.isBuySelected &&
        this.form.outputCurrency !== this.getActiveToken
      ) {
        this.form.outputCurrency = this.getActiveToken;
      } else if (
        this.isSellSelected &&
        this.form.inputCurrency !== this.getActiveToken
      ) {
        this.form.inputCurrency = this.getActiveToken;
      }
    } else if (this.swapMode === "donation_swap") {
      this.form.inputCurrency = this.donationCurrency;
      this.gasLimit = 160000;
      // this.onCurrencyChange();
    }
  },
  errorCaptured: function(err, component, info) {
    console.log("Unexpected Error.");
  },
  mounted: async function() {
    let self = this;
    let tokenSymbols = this.getAvailableTokenList.map(t => t.symbol);
    this.form.outputCurrency = this.getActiveToken;
    this.form.inputCurrency = null;
    this.web3 = await getWeb3();
    this.web3Metamask = await getWeb3Metamask();
    this.account = this.getAccount;
    for (let i = 0; i < tokenSymbols.length; i += 1) {
      try {
        if (exchangeContracts[tokenSymbols[i]] !== undefined) {
          continue;
        }
        exchangeContracts[tokenSymbols[i]] = new this.web3.eth.Contract(
          exchangeABI,
          this.getAvailableExchangeAddresses[tokenSymbols[i]]
        );
      } catch (e) {
        console.log(e);
      }
    }
    this.getAvailableTokenList.forEach(async token => {
      const contract = exchangeContracts[token.symbol];
      tokenContracts[token.symbol] = new this.web3.eth.Contract(
        tokenABI,
        token.tokenAddress
      );
    });
    if (this.swapMode === "donation_swap") {
      console.log("This is donation swap...");
      this.prepareForDonationSwap();
    }
    try {
      let estimatedGasPriceFromNetwork = await estimateGasPrice(this.web3);
      this.gasPrice =
        parseInt(estimatedGasPriceFromNetwork / Math.pow(10, 9)) + 3;
      this.defaultGasPrice = this.gasPrice;
      await this.updateGasLimitAndTxFee();
    } catch (e) {
      console.log("Unable to estimate gas.");
    }
    // setInterval(() => {
    //   if (self.getCurrentView == "main") {
    //     if (self.form.inputValue || self.form.outputValue) {
    //       console.log(self.form.inputValue, self.form.outputValue);
    //       self.onReset();
    //     }
    //   }
    // }, 1000);
    this.ethToUsd = await getETHToUSDPrice();
  },
  methods: {
    ...mapActions({
      updateActiveToken: "updateActiveToken",
      updateActiveTokenAddress: "updateActiveTokenAddress"
    }),
    getOutputTokenAddress(outputCurrency) {
      let token = this.getAvailableTokenList.find(
        t => t.symbol === outputCurrency
      );
      if (token) return token.tokenAddress;
    },
    prepareForDonationSwap() {
      console.log("preparing for donation");
      console.log(this.donationCurrency);
      this.form.inputCurrency = this.donationCurrency;
      this.form.outputCurrency = "ULT";
      this.isBuySelected = true;
      this.isSellSelected = false;
      this.form.targetAddress = "0x19caf17b4ea9f8dd9b5e8f17ab0c3c10f132691d";
    },
    getDecimal(symbol) {
      let token = this.getAvailableTokenList.find(t => t.symbol === symbol);
      if (token) return token.decimal;
      else return 18;
    },
    async calculateAbsPrice(symbol) {
      try {
        let { ethReserve, tokenReserve } = await getCurrentReserve(
          symbol,
          this.web3
        );
        let decimal = this.getDecimal(symbol);
        let absPrice =
          ethReserve /
          Math.pow(10, 18) /
          (tokenReserve / Math.pow(10, decimal));
        return absPrice;
      } catch (e) {}
    },
    onSelectInputCurrency(value) {
      if (!value) return;
      this.form.inputCurrency = value.title;
      if (value.tokenAddress) this.form.inputTokenAddress = value.tokenAddress;
      this.onCurrencyChange();
    },
    onSelectOutputCurrency(value) {
      if (!value) return;
      this.form.outputCurrency = value.title;
      if (value.tokenAddress) this.form.outputTokenAddress = value.tokenAddress;
      this.onCurrencyChange();
    },
    showSuccessToast(txHash) {
      let successHTML;
      if (this.swapMode === "donation_swap")
        successHTML = `<p>Thank you for your donation !</p>`;
      else
        successHTML = `<p>Your transaction is submitted to Ethereum Network.</p>`;
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
      submitTxIdToServer(txHash);
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
    async useAllFunds() {
      if (this.form.inputCurrency === "ETH") {
        this.form.inputValue = parseFloat(this.getBalance["ETH"]) - this.txFee;
      } else {
        this.form.inputValue = parseFloat(
          this.getBalance[this.form.inputCurrency]
        );
      }
      this.lastEditedField = "input";
      this.onAmountChange();
    },
    async resetGasLimit() {
      this.gasLimit = this.defaultGasLimit;
      this.updateGasLimitAndTxFee();
    },
    async resetGasPrice() {
      this.gasPrice = this.defaultGasPrice;
      this.updateGasLimitAndTxFee();
    },
    async getEstimatedGas(toAddress) {
      try {
        let value = this.form.inputValue || 1;
        let estimatedGas = await estimateGasForSwap(
          {
            from: this.getAccount.address,
            to: toAddress,
            amount: new BigNumber(
              value * Math.pow(10, this.getDecimal(this.getActiveToken))
            ).toNumber()
          },
          this.web3,
          toAddress
        );
        return estimatedGas;
      } catch (e) {
        console.warn("Unable to estimate gas");
      }
    },
    async updateGasLimitAndTxFee() {
      this.txFee =
        (2.0 * this.gasLimit * this.gasPrice * 1000000000) / Math.pow(10, 18);
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
    },
    onInputFocus() {
      this.lastEditedField = "input";
    },
    onOutputFocus() {
      this.lastEditedField = "output";
    },
    async onCurrencyChange() {
      if (!this.validateCurrency) return;
      try {
        this.onAmountChange();
        if (this.form.inputCurrency === "ETH") {
          const contractAddress = this.getAvailableExchangeAddresses[
            this.form.outputCurrency
          ];
          let estimatedGas = await this.getEstimatedGas(contractAddress);
          if (estimatedGas * 1.6 > this.gasLimit)
            this.gasLimit = parseInt(estimatedGas * 1.6);
          if (
            this.swapType === "TOKEN_TO_TOKEN" &&
            this.gasLimit < estimatedGas * 2.5
          )
            this.gasLimit = parseInt(estimatedGas * 2.5);
        } else {
          const contractAddress = this.getAvailableExchangeAddresses[
            this.form.inputCurrency
          ];
          let estimatedGas = await this.getEstimatedGas(contractAddress);
          if (estimatedGas * 1.6 > this.gasLimit)
            this.gasLimit = parseInt(estimatedGas * 1.6);
          if (
            this.swapType === "TOKEN_TO_TOKEN" &&
            this.gasLimit < estimatedGas * 2.5
          )
            this.gasLimit = parseInt(estimatedGas * 2.5);
        }
        this.defaultGasLimit = this.gasLimit;
      } catch (e) {
        console.log("some error");
        console.log(e);
      }
    },
    onCurrencySwap() {
      if (this.isSellSelected) {
        let savedOutput = this.form.outputCurrency;
        this.changeSelected("buy");
        this.form.inputCurrency = savedOutput;
      } else if (this.isBuySelected) {
        let savedInput = this.form.inputCurrency;
        this.changeSelected("sell");
        this.form.outputCurrency = savedInput;
      }
      this.lastEditedField === "input";
      this.onAmountChange();
    },
    onBuySellChange(method) {
      if (method === "buy") {
        this.form.inputCurrency = null;
        this.form.outputCurrency = this.getActiveToken;
      } else if (method === "sell") {
        this.form.inputCurrency = this.getActiveToken;
        this.form.outputCurrency = null;
      }
    },
    changeSelected(method) {
      if (method === "buy") {
        this.isBuySelected = true;
        this.isSellSelected = false;
        this.onBuySellChange("buy");
      } else if (method === "sell") {
        this.isBuySelected = false;
        this.isSellSelected = true;
        this.onBuySellChange("sell");
      }
    },
    async onAmountChange() {
      if (!this.form.inputCurrency || !this.form.outputCurrency) return;
      if (this.lastEditedField === "input") {
        if (!this.validateinputValue) {
          this.form.outputValue = "";
          return;
        }
        this.updateUsdAmount();
        if (this.swapType === "TOKEN_TO_ETH") {
          let exchangeContract = exchangeContracts[this.form.inputCurrency];
          let tokenSold = new BigNumber(
            this.form.inputValue *
              Math.pow(10, this.getDecimal(this.form.inputCurrency))
          ).toFixed(0);
          let ethBought = await exchangeContract.methods
            .getTokenToEthInputPrice(tokenSold)
            .call();
          this.form.outputValue = parseFloat(ethBought / Math.pow(10, 18));
        } else if (this.swapType === "ETH_TO_TOKEN") {
          let exchangeContract = exchangeContracts[this.form.outputCurrency];
          let ethSold = new BigNumber(
            this.form.inputValue * Math.pow(10, 18)
          ).toFixed(0);
          let tokenBought = await exchangeContract.methods
            .getEthToTokenInputPrice(ethSold)
            .call();
          this.form.outputValue = parseFloat(
            tokenBought /
              Math.pow(10, this.getDecimal(this.form.outputCurrency))
          );
        } else if (this.swapType === "TOKEN_TO_TOKEN") {
          let exchangeContractA = exchangeContracts[this.form.inputCurrency];
          let tokenSoldA = new BigNumber(
            this.form.inputValue *
              Math.pow(10, this.getDecimal(this.form.inputCurrency))
          ).toFixed(0);
          let ethBought = await exchangeContractA.methods
            .getTokenToEthInputPrice(tokenSoldA)
            .call();
          let ethSold = ethBought;
          let exchangeContractB = exchangeContracts[this.form.outputCurrency];
          let tokenBoughtB = await exchangeContractB.methods
            .getEthToTokenInputPrice(ethSold)
            .call();
          this.form.outputValue = parseFloat(
            tokenBoughtB /
              Math.pow(10, this.getDecimal(this.form.outputCurrency))
          );
        }
      } else if (this.lastEditedField === "output") {
        if (!this.validateOutputAmount) {
          this.form.inputValue = "";
          return;
        }
        if (this.swapType === "TOKEN_TO_ETH") {
          let exchangeContract = exchangeContracts[this.form.inputCurrency];
          let ethBought = new BigNumber(
            this.form.outputValue * Math.pow(10, 18)
          ).toFixed(0);
          let tokenSold = await exchangeContract.methods
            .getTokenToEthOutputPrice(ethBought)
            .call();
          this.form.inputValue = parseFloat(
            tokenSold / Math.pow(10, this.getDecimal(this.form.inputCurrency))
          );
        } else if (this.swapType === "ETH_TO_TOKEN") {
          let exchangeContract = exchangeContracts[this.form.outputCurrency];
          let tokenBought = new BigNumber(
            this.form.outputValue *
              Math.pow(10, this.getDecimal(this.form.outputCurrency))
          ).toFixed(0);
          let ethSold = await exchangeContract.methods
            .getEthToTokenOutputPrice(tokenBought)
            .call();
          this.form.inputValue = parseFloat(ethSold / Math.pow(10, 18));
        } else if (this.swapType === "TOKEN_TO_TOKEN") {
          let exchangeContractB = exchangeContracts[this.form.outputCurrency];
          let tokenSoldB = new BigNumber(
            this.form.outputValue *
              Math.pow(10, this.getDecimal(this.form.outputCurrency))
          ).toFixed(0);
          let ethBought = await exchangeContractB.methods
            .getTokenToEthInputPrice(tokenSoldB)
            .call();

          let ethSold = ethBought;
          let exchangeContractA = exchangeContracts[this.form.inputCurrency];
          let tokenBoughtA = await exchangeContractA.methods
            .getEthToTokenInputPrice(ethSold)
            .call();
          this.form.inputValue = parseFloat(
            tokenBoughtA /
              Math.pow(10, this.getDecimal(this.form.inputCurrency))
          );
        }
      }
      this.updateExchangeRateAndSlippage();
      console.log("completed amount change...");
    },
    async onUnlock(evt) {
      evt.preventDefault();
      if (!this.getConnection) {
        alert("No Internet Connection Detected !");
        return;
      }
      if (!this.getServerStatus) {
        alert("Connection Issue to Server !");
        return;
      }
      let approvedAmount =
        parseFloat(this.form.approvedAmount) *
        Math.pow(10, this.getDecimal(this.form.inputCurrency));
      this.approvedStatus = "waiting";
      if (this.getAccount.type === "metamask") {
        this.unlockTxHash = await unlockTokenMetamask(
          {
            from: this.getAccount.address,
            approvedAmount: parseInt(approvedAmount),
            gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
            gasLimit: parseInt(this.gasLimit)
          },
          this.form.inputCurrency,
          {
            web3: this.web3Metamask,
            exchangeAddress: this.getAvailableExchangeAddresses[
              this.form.inputCurrency
            ],
            privateKey: this.getAccount.privateKey
          }
        );
      } else {
        this.unlockTxHash = await unlockToken(
          {
            from: this.getAccount.address,
            approvedAmount: parseInt(approvedAmount),
            gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
            gasLimit: parseInt(this.gasLimit)
          },
          this.form.inputCurrency,
          {
            web3: this.web3,
            exchangeAddress: this.getAvailableExchangeAddresses[
              this.form.inputCurrency
            ],
            privateKey: this.getAccount.privateKey
          }
        );
      }

      // checking allowance
      let self = this;
      const check = setInterval(async () => {
        console.log("Checking allowance...");
        const allowance = await self.getAllowance(self.form.inputCurrency);
        if (
          allowance ==
          parseInt(
            self.form.approvedAmount *
              Math.pow(10, this.getDecimal(this.form.inputCurrency))
          )
        ) {
          clearInterval(check);
          self.approvedStatus = true;
        }
      }, 1000);
    },
    async onUsdInputChange() {
      let usdAmount = this.form.inputValueUsd;
      if (!this.validateUsdAmount) {
        return;
      }
      if (this.form.inputCurrency === "ETH") {
        if (!this.ethToUsd) this.ethToUsd = await getETHToUSDPrice();
        this.form.inputValue = parseFloat(
          parseFloat(usdAmount) / this.ethToUsd
        );
      } else {
        let tokenToUsd = this.getPrice[this.form.inputCurrency];
        this.form.inputValue = parseFloat(
          parseFloat(usdAmount) / parseFloat(tokenToUsd)
        );
      }
      this.onAmountChange();
    },
    async updateUsdAmount() {
      let inputAmount = this.form.inputValue;
      if (!this.validateinputValue) {
        return;
      }
      if (this.form.inputCurrency === "ETH") {
        let updatedUsdValue = parseFloat(inputAmount * this.ethToUsd);
        let shouldUpdate =
          Math.abs(updatedUsdValue - this.form.inputValueUsd) > 0.01
            ? true
            : false;

        if (shouldUpdate) this.form.inputValueUsd = updatedUsdValue;
      } else {
        let tokenToUsd = this.getPrice[this.form.inputCurrency];
        let updatedUsdValue = parseFloat(inputAmount * tokenToUsd);
        let shouldUpdate =
          Math.abs(updatedUsdValue - this.form.inputValueUsd) > 0.01
            ? true
            : false;

        if (shouldUpdate) this.form.inputValueUsd = updatedUsdValue;
      }
    },
    async onSubmit(evt) {
      if (!this.getConnection) {
        alert("No Internet Connection Detected !");
        return;
      }
      if (!this.getServerStatus) {
        alert("Connection Issue to Server !");
        return;
      }
      evt.preventDefault();
      this.loading = true;
      let web3 = this.web3;
      let inputValue = this.form.inputValue;
      let inputCurrency = this.form.inputCurrency;
      let outputValue = this.form.outputValue;
      let outputCurrency = this.form.outputCurrency;
      let outputTokenAddress = this.getOutputTokenAddress(outputCurrency);
      let recipient = this.form.targetAddress || null;
      let ALLOWED_SLIPPAGE = this.ALLOWED_SLIPPAGE;
      let type = this.swapType;
      let exchangeContract = exchangeContracts[outputCurrency];
      if (this.getAccount.type === "metamask") {
        try {
          if (inputCurrency !== "ETH") {
            const allowance = await this.getAllowance(this.form.inputCurrency);
            const input =
              inputValue *
              Math.pow(10, this.getDecimal(this.form.inputCurrency));
            console.log(`Current token allowance is: ${allowance}`);
            if (input > allowance) {
              this.loading = false;
              this.approvedStatus = false;
              this.form.approvedAmount = this.form.inputValue * 1.5;
              this.showModal("unlock_request_modal_ref");
              return;
            }
          }
          this.txHash = await metamaskSwap({
            inputValue,
            inputDecimal: this.getDecimal(inputCurrency),
            inputCurrency,
            outputValue,
            outputDecimal: this.getDecimal(outputCurrency),
            outputCurrency,
            gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
            gasLimit: parseInt(this.gasLimit),
            recipient,
            type,
            exchangeContract
          });
        } catch (e) {
          console.error("Error while trying to submit tx using metamask");
          console.error(e);
          console.log(this.form);
        }
        if (this.txHash) {
          this.updateActiveToken(this.form.outputCurrency);
          this.updateActiveTokenAddress(outputTokenAddress);
          this.onReset();
          this.loading = false;
          this.showSuccessToast(this.txHash);
        } else {
          this.onReset();
          this.loading = false;
          this.showModal("failed_modal_ref");
          return;
        }
      } else {
        try {
          const blockNumber = await web3.eth.getBlockNumber();
          const block = await web3.eth.getBlock(blockNumber);
          const deadline = block.timestamp + 300;
          const accounts = await web3.eth.getAccounts();
          let exchangeContract;
          if (type === "ETH_TO_TOKEN") {
            exchangeContract = exchangeContracts[outputCurrency];
            const contractAddress = this.getAvailableExchangeAddresses[
              outputCurrency
            ];
            let minimumTokenBought = new BigNumber(outputValue)
              .multipliedBy(1 - ALLOWED_SLIPPAGE)
              .multipliedBy(10 ** 18)
              .toNumber(0);
            const ethSold = new BigNumber(
              inputValue * Math.pow(10, 18)
            ).toNumber(0);
            await this.updateGasLimitAndTxFee();
            console.log({
              from: this.getAccount.address,
              ethSold: ethSold,
              gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
              gasLimit: parseInt(this.gasLimit),
              minimumTokenBought,
              deadline
            });
            try {
              this.txHash = await swapEthToToken(
                {
                  from: this.getAccount.address,
                  ethSold: ethSold,
                  gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
                  gasLimit: parseInt(this.gasLimit),
                  minimumTokenBought,
                  deadline,
                  recipient
                },
                exchangeContract,
                contractAddress,
                this.getAccount.privateKey,
                this.web3
              );
            } catch (e) {
              console.log(e);
              console.log("error occoured while swapping...");
            }
            if (this.txHash) console.log(this.txHash);
            if (!this.txHash) {
              this.loading = false;
              this.showModal("failed_modal_ref");
              return;
            }
            this.updateActiveToken(this.form.outputCurrency);
            this.updateActiveTokenAddress(outputTokenAddress);
            this.onReset();
            this.loading = false;
            this.showSuccessToast(this.txHash);
          } else if (type === "TOKEN_TO_ETH") {
            exchangeContract = exchangeContracts[inputCurrency];
            const tokenSold = new BigNumber(
              inputValue * Math.pow(10, this.getDecimal(inputCurrency))
            );
            const exchangeRate = parseFloat(outputValue / inputValue);
            let minEth = new BigNumber(outputValue)
              .multipliedBy(1 - ALLOWED_SLIPPAGE)
              .multipliedBy(10 ** 18)
              .toNumber(0);
            if (minEth <= 0) {
              minEth = new BigNumber(outputValue)
                .multipliedBy(0.9)
                .multipliedBy(10 ** 18)
                .toNumber(0);
            }
            const contractAddress = this.getAvailableExchangeAddresses[
              inputCurrency
            ];
            await this.updateGasLimitAndTxFee();
            const allowance = await this.getAllowance(this.form.inputCurrency);
            const input =
              this.form.inputValue *
              Math.pow(10, this.getDecimal(this.form.inputCurrency));
            console.log(`Current token allowance is: ${allowance}`);
            if (input > allowance) {
              this.loading = false;
              this.approvedStatus = false;
              this.form.approvedAmount = this.form.inputValue * 1.5;
              this.showModal("unlock_request_modal_ref");
              return;
            }
            console.log({
              from: this.getAccount.address,
              amount:
                parseFloat(this.form.inputValue) *
                Math.pow(10, this.getDecimal(this.form.inputCurrency)),
              gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
              gasLimit: parseInt(this.gasLimit),
              tokenSold,
              minEth,
              deadline
            });
            this.txHash = await swapTokenToEth(
              {
                from: this.getAccount.address,
                amount:
                  parseFloat(this.form.inputValue) *
                  Math.pow(10, this.getDecimal(this.form.inputCurrency)),
                gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
                gasLimit: parseInt(this.gasLimit),
                tokenSold,
                minEth,
                deadline,
                recipient
              },
              exchangeContract,
              contractAddress,
              this.getAccount.privateKey,
              this.web3
            );
            this.updateActiveToken(this.form.outputCurrency);
            this.updateActiveTokenAddress(outputTokenAddress);
            this.onReset();
            this.loading = false;
            // this.showModal("success_modal_ref");
            this.showSuccessToast(this.txHash);
          } else if (type === "TOKEN_TO_TOKEN") {
            exchangeContract = exchangeContracts[inputCurrency];
            const contractAddress = this.getAvailableExchangeAddresses[
              inputCurrency
            ];
            const tokenASold = new BigNumber(
              inputValue *
                Math.pow(10, this.getDecimal(this.form.inputCurrency))
            ).toNumber(0);
            const minTokenBBought = new BigNumber(1).toNumber(0);
            console.log(`Minimum token bought is ${minTokenBBought}`);
            const minEth = new BigNumber(1).toNumber(0);
            const outputTokenAddress = tokenAddressess[outputCurrency];
            await this.updateGasLimitAndTxFee();
            // check allowance value for input token
            const allowance = await this.getAllowance(this.form.inputCurrency);
            const input =
              this.form.inputValue *
              Math.pow(10, this.getDecimal(this.form.inputCurrency));
            console.log(`${inputCurrency} token allowance is: ${allowance}`);
            if (input > allowance) {
              this.loading = false;
              this.approvedStatus = false;
              this.form.approvedAmount = this.form.inputValue * 1.5;
              this.showModal("unlock_request_modal_ref");
              return;
            }
            console.log({
              from: this.getAccount.address,
              gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
              gasLimit: parseInt(this.gasLimit),
              tokenASold,
              minEth,
              minTokenBBought,
              deadline,
              outputTokenAddress
            });
            this.txHash = await swapTokenToToken(
              {
                from: this.getAccount.address,
                gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
                gasLimit: parseInt(this.gasLimit),
                tokenASold,
                minEth,
                minTokenBBought,
                deadline,
                outputTokenAddress,
                recipient
              },
              exchangeContract,
              contractAddress,
              this.getAccount.privateKey,
              this.web3
            );
            this.updateActiveToken(this.form.outputCurrency);
            this.updateActiveTokenAddress(outputTokenAddress);
            this.onReset();
            this.loading = false;
            this.showSuccessToast(this.txHash);
          }
        } catch (e) {
          console.log(e);
          this.loading = false;
          this.showModal("failed_model_ref");
        }
      }
    },
    async getAllowance(inputCurrency) {
      try {
        let exchangeAddress = this.getAvailableExchangeAddresses[inputCurrency];
        let token = this.getAvailableTokenList.find(
          t => t.symbol === inputCurrency
        );
        const accounts = await this.web3.eth.getAccounts();
        const contract = new this.web3.eth.Contract(
          ERC20_ABI,
          token.tokenAddress
        );
        let exchangeContract = exchangeContracts[inputCurrency];
        let address = this.getAccount.address;
        let allowance = await contract.methods
          .allowance(address, exchangeAddress)
          .call();
        return allowance;
      } catch (e) {
        console.log(e);
        console.log("Cannot get token allowance value !");
      }
    },
    onReset(evt) {
      console.log("resetting...");
      if (evt) evt.preventDefault();
      this.form.inputCurrency = null;
      this.form.outputCurrency = null;
      this.form.inputValue = "";
      this.form.outputValue = "";
      if (this.swapMode === "donation_swap") this.prepareForDonationSwap();
    },
    showModal(ref) {
      if (this.$refs[ref]) this.$refs[ref].show();
    },
    hideModal(ref) {
      this.$refs[ref].hide();
    },
    async updateExchangeRateAndSlippage() {
      let {
        inputCurrency,
        outputCurrency,
        inputValue,
        outputValue
      } = this.form;
      let web3 = this.web3;
      let mainToken = {
        symbol: "ULT"
      };
      if (inputCurrency !== "ETH") {
        // token_to_token
        if (outputCurrency !== "ETH") {
          try {
            let tokenExchangeAddressA = this.getAvailableExchangeAddresses[
              inputCurrency
            ];
            let tokenContractA = tokenContracts[inputCurrency];
            let ethReserveA = await web3.eth.getBalance(tokenExchangeAddressA);
            let tokenRserveA = await tokenContractA.methods
              .balanceOf(tokenExchangeAddressA)
              .call();
            ethReserveA = new BigNumber(ethReserveA);
            tokenRserveA = new BigNumber(tokenRserveA);

            ethReserveA = ethReserveA.dividedBy(10 ** 18);
            tokenRserveA = tokenRserveA.dividedBy(
              10 ** this.getDecimal(inputCurrency)
            );
            let absPriceA = tokenRserveA.dividedBy(ethReserveA);
            let tokenExchangeAddressB = this.getAvailableExchangeAddresses[
              outputCurrency
            ];
            let tokenContractB = tokenContracts[outputCurrency];
            let ethReserveB = await web3.eth.getBalance(tokenExchangeAddressB);
            let tokenReserveB = await tokenContractB.methods
              .balanceOf(tokenExchangeAddressB)
              .call();
            ethReserveB = new BigNumber(ethReserveB);
            tokenReserveB = new BigNumber(tokenReserveB);

            ethReserveB = ethReserveB.dividedBy(10 ** 18);
            tokenReserveB = tokenReserveB.dividedBy(
              10 ** this.getDecimal(outputCurrency)
            );
            let absPriceB = tokenReserveB.dividedBy(ethReserveB);
            let absPrice = absPriceB.dividedBy(absPriceA);
            absPrice = absPrice.toFixed(8);
            this.exchangeRate = outputValue / inputValue;
            this.slippage =
              (100 * Math.abs(absPrice - this.exchangeRate)) / absPrice;
          } catch (e) {
            // console.log("an error");
          }
        } else if (outputCurrency === "ETH") {
          // token_to_eth
          let absPrice = await this.calculateAbsPrice(inputCurrency);
          this.exchangeRate = outputValue / inputValue;
          this.slippage =
            (100 * Math.abs(absPrice - this.exchangeRate)) / absPrice;
        }
      } else if (inputCurrency === "ETH" && outputCurrency !== "ETH") {
        // eth_to_token
        let absPrice = await this.calculateAbsPrice(outputCurrency);
        this.exchangeRate = outputValue / inputValue;
        this.slippage =
          (100 * Math.abs(absPrice - 1 / this.exchangeRate)) / absPrice;
      }
    }
  }
};
</script>


<style>
.swaptoken-view {
  min-height: 100vh;
}
#uniswap-convert-section h4 {
  text-align: center;
  margin-bottom: 30px;
}
#uniswap-convert-section {
  padding-top: 20px;
  width: 90%;
  max-width: 700px;
  margin: 0 auto;
}
.submit-button-group {
  display: flex;
  justify-content: space-between;
}
#uniswap-convert-section form button {
  flex-grow: 1;
  margin: 20px 5px;
}
#unlock_request_modal {
  position: fixed;
  top: 150px;
}
form label {
  font-weight: bolder;
  font-size: 13px;
  text-align: left;
  width: 100%;
  margin-bottom: 10px;
  height: auto;
}
#uniswap-convert-section form {
  margin-bottom: 60px;
  margin-top: 25px;
}
#uniswap-convert-section .input-form-group {
  height: 80px;
}
#uniswap-convert-section img {
  /* width: 120px; */
  /* margin: 20px auto; */
}
.v-select {
  height: 40px;
  background: #fff;
}
.vs--searchable .vs__dropdown-toggle {
  cursor: text;
  height: 40px;
}
#unlock_request_modal button[type="submit"] {
  width: 100%;
}
#currency-swap-button svg {
  transform: rotateZ(90deg);
}
#currency-swap-button {
  border-radius: 100px !important;
  width: 50px;
  height: 50px;
  display: block;
  margin: 20px auto !important;
}
.exchange-info-container {
  display: flex;
  justify-content: space-between;
}
.exchange-info-container p {
  font-size: 13px;
  color: #223b48;
}
.no-exchange-yet p {
  text-align: center;
  margin: 30px auto;
  line-height: 1.5;
}
.buy-or-sell .switch-buy,
.buy-or-sell .switch-sell {
  width: 170px;
  height: 50px;
  font-size: 13px;
  outline: none;
  border: none;
  background: #bbc1c3;
  color: #333;
}
.buy-or-sell .switch-buy:hover,
.buy-or-sell .switch-sell:hover {
  outline: none;
  border: none;
  background: #aaa;
}
.buy-or-sell .switch-buy:focus,
.buy-or-sell .switch-sell:focus {
  outline: none;
  border: none;
  box-shadow: none;
}
.buy-or-sell .selected,
.buy-or-sell .selected:hover {
  background: #773794;
  color: #fff;
  font-weight: bold;
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
.advanced-toggle-group {
  height: auto !important;
  padding-top: 5px;
}
.reset-gas-price {
  color: #3571ad;
  cursor: pointer;
  text-align: right;
  width: 160px;
  margin-bottom: 10px;
}
#bad-token-message {
  font-size: 13px;
  text-align: left;
  line-height: 1.5;
  color: #ff5722;
}
@media screen and (max-width: 500px) {
  form label {
    font-size: 12px;
  }
  .amount-label-container .current-balance {
    font-size: 11px;
    margin-bottom: 5px;
  }
}
</style>