<template>
  <div>
    <div id="uniswap-liquidity-section">
      <div v-if="!shouldRender" class="no-exchange-yet">
        <p>
          <strong>{{ activeToken }}</strong> does not have an uniswap exchange yet. Go to exchange tab and list the token frist.
        </p>
      </div>
      <div v-if="shouldRender">
        <b-button-group class="buy-or-sell">
          <b-button
            v-bind:class="{ selected: (liquidity === 'add') }"
            class="switch-buy"
            @click="changeSelected('add_liquidity')"
          >Add Liquidity</b-button>
          <b-button
            v-bind:class="{ selected: (liquidity === 'remove') }"
            class="switch-sell"
            @click="changeSelected('remove_liquidity')"
          >Remove Liquidity</b-button>
        </b-button-group>
        <Holder />
      </div>
      <b-form
        class="liquidity-form"
        @submit="onAddLiquidity"
        @reset="onReset"
        v-if="liquidity === `add` && shouldRender"
      >
        <div class="amount-label-container">
          <label for>Deposit ETH</label>
          <div>
            <p class="current-balance">{{getBalance["ETH"]}} ETH</p>
            <label class="use-all-funds" @click="useAllFunds('ETH')">Use All Funds</label>
          </div>
        </div>
        <b-form-group id="exampleInputGroup1" class="input-form-group">
          <div class="input-field-container">
            <b-form-input
              id="eth-input-text-field"
              type="text"
              v-model="form.inputValue"
              required
              :state="validateinputValue && validateETHBalance"
              @keyup="onAmountChange"
              @focus="onInputFocus"
            />
            <button type="button" id="erase" @click="form.inputValue = ''"></button>
          </div>
          <b-form-invalid-feedback
            v-if="form.inputValue.length > 0"
            :state="validateinputValue && validateETHBalance"
          >{{ inputErrorMessage }}</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group id="exampleInputGroup1" class="input-form-group">
          <div class="amount-label-container">
            <label>Deposit {{activeToken}}</label>
            <div>
              <p class="current-balance">{{getBalance[activeToken]}} {{activeToken}}</p>
              <label class="use-all-funds" @click="useAllFunds(activeToken)">Use All Funds</label>
            </div>
          </div>
          <div class="input-field-container">
            <b-form-input
              id="inputValue"
              type="text"
              v-model="form.outputValue"
              required
              :state="validateOutputAmount && validateTokenBalance"
              @keyup="onAmountChange"
              @focus="onOutputFocus"
            />
            <button type="button" id="erase" @click="form.outputValue = ''"></button>
          </div>
          <b-form-invalid-feedback
            v-if="form.outputValue.length > 0"
            :state="validateOutputAmount && validateTokenBalance"
          >{{ inputErrorMessage }}</b-form-invalid-feedback>
        </b-form-group>

        <div
          class="exchange-info-container"
          v-if="slippage && exchangeRate && validateinputValue && validateOutputAmount"
        >
          <b-form-group v-if="form.inputCurrency !== null">
            <label for>Exchange Rate</label>
            <p>1 {{form.inputCurrency}} = {{exchangeRate.toFixed(5)}} {{form.outputCurrency}}</p>
          </b-form-group>
        </div>

        <b-form-group v-if="form.inputCurrency !== null">
          <b-form-checkbox
            switch
            v-model="showAdvanced"
            name="check-button"
            class="show-advanced-label"
          >Show Advanced Settings</b-form-checkbox>
        </b-form-group>
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
        <p id="bad-token-message" v-if="isBadToken">
          Warning not all tokens will work with Uniswap. Read
          <a
            target="_blank"
            href="https://www.reddit.com/r/UniSwap/comments/c0k63p/contract_not_working/"
          >this</a> and make sure that your token contract is compatible with Uniswap.
        </p>
        <div class="submit-button-group">
          <b-button type="reset" variant="outline-dark">Reset</b-button>
          <b-button type="submit" variant="primary" :disabled="shouldDisableAddButton">Add Liquidity</b-button>
        </div>
      </b-form>

      <!-- REMOVE LIQUIDITY FORM -->
      <b-form
        class="liquidity-form"
        @submit="onRemoveLiquidity"
        @reset="onReset"
        v-if="liquidity === `remove`"
      >
        <b-form-group id="exampleInputGroup1" class="input-form-group">
          <div class="amount-label-container">
            <label>Amount of Pool Token</label>
            <div>
              <p class="current-balance">
                Pool Token Balance:
                <span id="liquidity-balance"></span>
              </p>
              <label class="use-all-funds" @click="useAllFunds('LIQUIDITY')">Use All Funds</label>
            </div>
          </div>
          <div class="input-field-container">
            <b-form-input
              id="inputValue"
              type="text"
              v-model="form.inputValue"
              required
              :state="validateLiquidityInput"
              @keyup="onRemoveAmountChange"
              @focus="onInputFocus"
            />
            <button type="button" id="erase" @click="form.inputValue = ''"></button>
          </div>
          <b-form-invalid-feedback
            v-if="form.inputValue.length > 0"
            :state="validateLiquidityInput"
          >{{ inputErrorMessage }}</b-form-invalid-feedback>
        </b-form-group>

        <!-- <b-button variant="primary" id="pool-swap-button">
          <font-awesome-icon icon="arrow-down" size="2x" color="#fff"/>
        </b-button>-->

        <b-form-group id="exampleInputGroup1">
          <label>Withdrawn Amount</label>
          <p>
            <span id="withdrawn-eth">0.00</span> ETH +
            <span id="withdrawn-token">0.00</span>
            {{activeToken}}
          </p>
        </b-form-group>

        <div
          class="exchange-info-container"
          v-if="slippage && exchangeRate && validateinputValue && validateOutputAmount"
        >
          <b-form-group v-if="form.inputCurrency !== null">
            <label for>Exchange Rate</label>
            <p>1 {{form.inputCurrency}} = {{exchangeRate.toFixed(5)}} {{form.outputCurrency}}</p>
          </b-form-group>
        </div>

        <b-form-group v-if="form.inputCurrency !== null">
          <b-form-checkbox
            switch
            v-model="showAdvanced"
            name="check-button"
            class="show-advanced-label"
          >Show Advanced Settings</b-form-checkbox>
        </b-form-group>
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
        <p id="bad-token-message" v-if="isBadToken">
          Warning not all tokens will work with Uniswap. Read
          <a
            target="_blank"
            href="https://www.reddit.com/r/UniSwap/comments/c0k63p/contract_not_working/"
          >this</a> and make sure that your token contract is compatible with Uniswap.
        </p>
        <div class="submit-button-group">
          <b-button type="reset" variant="outline-dark">Reset</b-button>
          <b-button
            type="submit"
            variant="primary"
            :disabled="shouldDisableRemoveButton"
          >Remove Liquidity</b-button>
        </div>
      </b-form>

      <!-- Success Modal -->
      <b-modal
        ref="success_modal_ref"
        id="unlock_request_modal"
        title="Transaction Submitted"
        :hide-footer="true"
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
        id="unlock_request_modal"
        title="Transaction Failed"
        :hide-footer="true"
      >
        <p>
          <span v-html="failedErrorMessage"></span>
        </p>
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
            <p>Please unlock your token to allow Wallet to spend. Recommended allowance is {{ getActiveToken }} amount to swap + extra 10% . If you intend to spend more {{ getActiveToken }} in the future, please fill in higer allowance so that you can avoid extra gas fees caused by future approval transactions</p>
            <label>{{ getActiveToken }} Amount to Unlock</label>
            <b-form-input type="text" v-model="form.approvedAmount" />
          </b-form-group>
          <b-button type="submit" variant="outline-primary">Approve</b-button>
        </b-form>
        <p v-else-if="approvedStatus === `waiting`">
          <span>
            <scale-loader :color="`#a41de4`" :height="`15px`" :width="`5px`"></scale-loader>
          </span>
          Waiting for the approval transaction to be confirmed on Ethereum, before submitting swap transaction. It may take 1 to 3 minutes depending on network traffic and your transaction fee.
          <span
            v-if="approvedStatus === `waiting` && unlockTxHash"
          >
            See status of your approval tx on
            <a
              id="txUrl"
              target="_blank"
              rel="noopener noreferrer"
              :href="`https://etherscan.io/tx/${unlockTxHash}`"
            >etherscan.io</a>
          </span>
        </p>
        <p
          v-else-if="approvedStatus === true"
        >Your approval is confirmed on Ethereum Network!. You can now submit your original transaction to spend {{ form.outputValue }} {{ getActiveToken }} token.</p>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import { exchangeABI, tokenABI, ERC20_ABI } from "../assets/js/abi";
import { factoryAddress } from "../assets/js/token";
import {
  getWeb3,
  estimateGas,
  estimateGasPrice,
  sendToken,
  signAndSendETH,
  swapTokenToEth,
  unlockToken,
  unlockTokenMetamask,
  swapEthToToken,
  swapTokenToToken,
  addLiquidity,
  getAbsPrice,
  removeLiquidity,
  getExchangeAddress,
  createNewExchange,
  getWeb3Metamask,
  metamaskAddLiquidity,
  metamaskRemoveLiquidity,
  hasTokenUniswap,
  submitTxIdToServer,
  getLatestBlock
} from "../assets/js/utils";
import BigNumber from "bignumber.js";
import Holder from "./Holder";
import ScaleLoader from "vue-spinner/src/ScaleLoader.vue";
import config from "../config";

let exchangeContracts = {};
let tokenAddressess = {};
let tokenContracts = {};
let defaultGasLimit = 51000 * 2;

export default {
  components: {
    Holder,
    ScaleLoader
  },
  data() {
    return {
      web3: null,
      ALLOWED_SLIPPAGE: 0.025,
      account: null,
      form: {
        inputCurrency: null,
        outputCurrency: null,
        inputValue: "",
        outputValue: "",
        approvedAmount: 0,
        approvedCurrency: "",
        tokenAddress: ""
      },
      loading: false,
      showAdvanced: false,
      gasPrice: 6,
      defaultGasPrice: 6,
      gasLimit: defaultGasLimit,
      txFee: 0,
      txHash: "",
      approvedStatus: "",
      lastEditedField: "",
      unlockTxHash: "",
      inputErrorMessage: "Please input a valid amount",
      outputErrorMessage: "Please input a valid amount",
      failedErrorMessage: "Your transaction has failed.",
      slippage: null,
      liquidity: "",
      liquidityBalance: 0.0
    };
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getActiveToken: "getActiveToken",
      getActiveTokenAddress: "getActiveTokenAddress",
      getCurrentView: "getCurrentView",
      getBalance: "account/getBalance",
      getPrice: "account/getPrice",
      getEthPrice: "account/getEthPrice",
      getConnection: "getConnection",
      getServerStatus: "getServerStatus",
      getAvailableTokenList: "account/getAvailableTokenList",
      getBadTokenList: "account/getBadTokenList",
      getAvailableTokenAddresses: "account/getAvailableTokenAddresses",
      getAvailableExchangeAddresses: "account/getAvailableExchangeAddresses"
    }),
    shouldRender: function() {
      if (this.activeToken === "ETH") return false;
      if (hasTokenUniswap(this.activeToken)) return true;
      else return false;
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
    activeToken() {
      return this.getActiveToken;
    },
    validateinputValue() {
      let amount = parseFloat(this.form.inputValue * 1);
      const isNaN = Number.isNaN(amount);
      if (isNaN || amount <= 0) return false;
      return true;
    },
    validateLiquidityInput() {
      let amount = parseFloat(this.form.inputValue * 1);
      const isNaN = Number.isNaN(amount);
      if (isNaN || amount <= 0) {
        this.inputErrorMessage = "Invalid pool token amount";
        return false;
      }
      if (amount > this.liquidityBalance) {
        this.inputErrorMessage = "You do not have enough pool tokens.";
        return false;
      }
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
    validateETHBalance() {
      if (!this.validateinputValue) return false;
      let amount = parseFloat(this.form.inputValue * 1);
      let txFee = this.txFee;
      let ethBalance = parseFloat(this.getBalance["ETH"]);
      if (this.form.inputCurrency === "ETH") {
        if (amount + txFee > ethBalance) {
          this.inputErrorMessage = "Not enough balance or transaction fee";
          return false;
        }
      } else {
        let tokenBalance = parseFloat(this.getBalance[this.form.inputCurrency]);
        if (amount > tokenBalance || txFee > ethBalance) {
          this.inputErrorMessage = "Not enough balance or transaction fee";
          return false;
        }
      }
      return true;
    },
    validateTokenBalance() {
      if (!this.validateOutputAmount) return false;
      let tokenAmount = parseFloat(this.form.outputValue * 1);
      let tokenBalance = parseFloat(this.getBalance[this.activeToken]);
      if (tokenAmount > tokenBalance) {
        this.outputErrorMessage = "Not enough balance";
        return false;
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
    shouldDisableAddButton() {
      return (
        this.loading ||
        !this.validateCurrency ||
        !this.validateinputValue ||
        !this.validateOutputAmount ||
        !this.validateETHBalance ||
        !this.validateSlippage ||
        !this.validateGasLimit ||
        this.isBadToken
      );
    },
    shouldDisableRemoveButton() {
      return (
        this.loading ||
        !this.validateinputValue ||
        this.form.inputValue > this.liquidityBalance ||
        this.isBadToken
      );
    },
    shouldDisableCreateExchangeButton() {
      return this.loading || this.form.tokenAddress.length !== 42;
    }
  },
  mounted: async function() {
    let self = this;
    let tokenSymbols = [this.activeToken];
    this.form.inputCurrency = "ETH";
    this.liquidity = "add";
    this.form.outputCurrency = this.activeToken;
    if (this.getAccount.type === "metamask") {
      this.web3 = await getWeb3Metamask();
    } else {
      this.web3 = await getWeb3();
    }
    this.account = this.getAccount;
    for (let i = 0; i < tokenSymbols.length; i += 1) {
      exchangeContracts[tokenSymbols[i]] = new this.web3.eth.Contract(
        exchangeABI,
        this.getAvailableExchangeAddresses[tokenSymbols[i]]
      );
    }
    tokenSymbols.forEach(async token => {
      const contract = exchangeContracts[token];
      self.getAvailableTokenAddresses[
        token
      ] = await contract.methods.tokenAddress().call();
      tokenContracts[token] = new this.web3.eth.Contract(
        tokenABI,
        self.getAvailableTokenAddresses[token]
      );
    });
    let estimatedGasPriceFromNetwork = await estimateGasPrice(this.web3);
    if (estimatedGasPriceFromNetwork > 0) {
      this.gasPrice =
        parseInt(estimatedGasPriceFromNetwork / Math.pow(10, 9)) + 3;
    }
    this.defaultGasPrice = this.gasPrice;
    await this.updateGasLimitAndTxFee();
    setInterval(() => {
      if (self.getCurrentView === "main") {
        if (self.form.inputValue || self.form.outputValue) {
          self.onReset();
        }
      }
    }, 1000);
  },
  methods: {
    ...mapActions({
      updateActiveToken: "updateActiveToken"
    }),
    async resetGasLimit() {
      this.gasLimit = defaultGasLimit;
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
    async validateTokenAddress() {
      let tokenAddress = this.form.tokenAddress;
      let exchangeAddress = await getExchangeAddress(tokenAddress);
      if (
        exchangeAddress &&
        exchangeAddress !== "0x0000000000000000000000000000000000000000"
      ) {
        this.inputErrorMessage = "Exchange address already existed";
        return false;
      } else if (
        exchangeAddress === "0x0000000000000000000000000000000000000000"
      ) {
        return true;
      } else {
        this.inputErrorMessage = "Invalid token address";
        return false;
      }
    },
    getDecimal(symbol) {
      let token = this.getAvailableTokenList.find(t => t.symbol === symbol);
      if (token) return token.decimal;
      else return 18;
    },
    async useAllFunds(tokenName) {
      // if (estimatedGas * 2 > this.gasLimit)
      //   this.gasLimit = parseInt(estimatedGas * 2);
      // this.txFee =
      //   (1.6 * estimatedGas * this.gasPrice * 1000000000) / Math.pow(10, 18);
      if (tokenName === "ETH") {
        this.form.inputValue = parseFloat(this.getBalance["ETH"]) - this.txFee;
        this.onInputFocus();
        this.onAmountChange();
      } else if (tokenName === "LIQUIDITY") {
        this.form.inputValue = this.liquidityBalance;
        this.onInputFocus();
        this.onRemoveAmountChange();
      } else {
        this.form.outputValue = parseFloat(this.getBalance[tokenName]);
        this.onOutputFocus();
        this.onAmountChange();
      }
      // const contractAddress = this.getAvailableExchangeAddresses[
      //   this.form.inputCurrency
      // ];
      // let estimatedGas = await this.getEstimatedGas(contractAddress);
    },
    async getEstimatedGas(toAddress) {
      console.log("Estimating gas limit...");
      let web3 = this.web3;
      let inputValue = this.form.inputValue;
      let inputCurrency = this.form.inputCurrency;
      let outputValue = this.form.outputValue;
      let outputCurrency = this.activeToken;
      console.log(inputValue, outputValue, inputCurrency, outputCurrency);
      let ALLOWED_SLIPPAGE = this.ALLOWED_SLIPPAGE;
      let type = this.swapType;
      const block = await getLatestBlock(web3);
      const deadline = block.timestamp + 300;
      const accounts = await web3.eth.getAccounts();
      let exchangeContract = exchangeContracts[outputCurrency];
      const contractAddress = this.getAvailableExchangeAddresses[
        outputCurrency
      ];
      let ethAmount = new BigNumber(inputValue * Math.pow(10, 18));
      let tokenAmount = new BigNumber(outputValue).multipliedBy(
        10 ** this.getDecimal(this.getActiveToken)
      );
      let ethReserve = await web3.eth.getBalance(contractAddress);
      const totalLiquidity = await exchangeContract.methods
        .totalSupply()
        .call();
      let liquidityMinted = new BigNumber(totalLiquidity).multipliedBy(
        ethAmount.dividedBy(ethReserve)
      );
      if (Number.isNaN(liquidityMinted) || liquidityMinted == "NaN")
        liquidityMinted = new BigNumber(0);

      const MAX_LIQUIDITY_SLIPPAGE = 0.025;
      const minLiquidity = liquidityMinted.multipliedBy(
        1 - MAX_LIQUIDITY_SLIPPAGE
      );
      const maxTokens = tokenAmount.multipliedBy(1 + MAX_LIQUIDITY_SLIPPAGE);

      let transactionParameters = {
        from: this.getAccount.address,
        gasPrice: web3.utils.toHex(this.gasPrice),
        to: contractAddress,
        value: web3.utils.toHex(ethAmount.toFixed(0)),
        data: exchangeContract.methods
          .addLiquidity(minLiquidity.toFixed(0), maxTokens.toFixed(0), deadline)
          .encodeABI()
      };

      let estimatedGas = await estimateGas(transactionParameters, this.web3);
      return estimatedGas;
    },
    async updateGasLimitAndTxFee() {
      this.txFee =
        (2.0 * this.gasLimit * this.gasPrice * 1000000000) / Math.pow(10, 18);
    },
    onInputFocus() {
      this.lastEditedField = "input";
    },
    onOutputFocus() {
      this.lastEditedField = "output";
    },
    async onCurrencyChange() {
      if (!this.validateCurrency) return;
      this.onAmountChange();

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
      console.log(estimatedGas, this.gasPrice, this.gasLimit);
    },
    async onAmountChange() {
      if (!this.form.inputCurrency || !this.form.outputCurrency) return;
      if (this.lastEditedField === "input") {
        if (!this.validateinputValue) {
          // this.form.outputValue = "";
          return;
        }
        let eth_usd = this.getEthPrice;
        let token_usd = this.getPrice[this.activeToken];
        let absPrice = new BigNumber(eth_usd / token_usd);
        console.log(`Abs Price: ${absPrice.toFixed(6)}`);
        if (absPrice.toFixed(0) == "NaN") return;
        if (!Number.isNaN(absPrice.toNumber()))
          this.form.outputValue = absPrice
            .multipliedBy(this.form.inputValue)
            .toFixed(8);
      } else if (this.lastEditedField === "output") {
        if (!this.validateOutputAmount) {
          // this.form.inputValue = "";
          return;
        }
        let eth_usd = this.getEthPrice;
        let token_usd = this.getPrice[this.activeToken];
        let absPrice = new BigNumber(eth_usd / token_usd);
        console.log(`Abs Price: ${absPrice.toFixed(6)}`);
        if (absPrice.toFixed(0) == "NaN") return;
        if (!Number.isNaN(absPrice.toNumber()))
          this.form.inputValue = new BigNumber(this.form.outputValue)
            .dividedBy(absPrice)
            .toFixed(8);
      }
      this.updateExchangeRateAndSlippage();
    },
    async onRemoveAmountChange() {
      if (!this.form.inputCurrency || !this.form.outputCurrency) return;
      let web3 = this.web3;
      let inputValue = this.form.inputValue;
      let inputCurrency = this.form.inputCurrency;
      let outputValue = this.form.outputValue;
      let outputCurrency = this.form.outputCurrency;
      let ALLOWED_SLIPPAGE = this.ALLOWED_SLIPPAGE;
      let type = this.swapType;
      const block = await getLatestBlock(web3);
      const deadline = block.timestamp + 300;
      const accounts = await web3.eth.getAccounts();
      let exchangeContract = exchangeContracts[outputCurrency];
      const contractAddress = this.getAvailableExchangeAddresses[
        outputCurrency
      ];
      let tokenContract = tokenContracts[outputCurrency];

      let ethReserve = await web3.eth.getBalance(contractAddress);
      let tokenReserve = await tokenContract.methods
        .balanceOf(contractAddress)
        .call();

      const totalSupply = await exchangeContract.methods.totalSupply().call();
      const amount = new BigNumber(inputValue * Math.pow(10, 18));
      const ownership = amount.dividedBy(totalSupply);
      const ethWithdrawn = new BigNumber(ethReserve).multipliedBy(ownership);
      const tokenWithdrawn = new BigNumber(tokenReserve).multipliedBy(
        ownership
      );

      let ethBalance = await web3.eth.getBalance(this.getAccount.address);
      ethBalance = new BigNumber(ethBalance);

      const liquidityBalance = await exchangeContract.methods
        .balanceOf(this.getAccount.address)
        .call();

      document.querySelector(
        "#withdrawn-eth"
      ).innerHTML = ethWithdrawn.dividedBy(10 ** 18).toFixed(6);
      document.querySelector(
        "#withdrawn-token"
      ).innerHTML = tokenWithdrawn
        .dividedBy(10 ** this.getDecimal(this.getActiveToken))
        .toFixed(6);
    },
    async onUnlock(evt) {
      if (evt) evt.preventDefault();
      let txHash;
      if (!this.getConnection) {
        alert("No Internet Connection Detected !");
        return;
      }
      if (!this.getServerStatus) {
        alert("Connection Issue to Server !");
        return;
      }
      try {
        this.approvedStatus = "waiting";
        let currencyToCheck = this.form.approvedCurrency
          ? this.form.approvedCurrency
          : this.form.inputCurrency;

        if (this.getAccount.type === "metamask") {
          try {
            this.unlockTxHash = await unlockTokenMetamask(
              {
                from: this.getAccount.address,
                approvedAmount:
                  this.form.approvedAmount *
                  Math.pow(10, this.getDecimal(this.getActiveToken)),
                gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
                gasLimit: parseInt(this.gasLimit)
              },
              currencyToCheck,
              {
                web3: this.web3,
                exchangeAddress: this.getAvailableExchangeAddresses[
                  currencyToCheck
                ],
                privateKey: this.getAccount.privateKey
              }
            );
            console.log(`Unlock Tx Hash: ${this.unlockTxHash}`);
          } catch (e) {
            alert(
              "Your approval transaction has failed. Please try again to approve token to spend."
            );
            this.hideModal("unlock_request_modal_ref");
          }
        } else {
          this.unlockTxHash = await unlockToken(
            {
              from: this.getAccount.address,
              approvedAmount:
                this.form.approvedAmount *
                Math.pow(10, this.getDecimal(this.getActiveToken)),
              gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
              gasLimit: parseInt(this.gasLimit)
            },
            currencyToCheck,
            {
              web3: this.web3,
              exchangeAddress: this.getAvailableExchangeAddresses[
                currencyToCheck
              ],
              privateKey: this.getAccount.privateKey
            }
          );
        }

        // checking allowance
        let self = this;
        let check = setInterval(async () => {
          console.log(`Checking allowance for ${currencyToCheck} token`);
          const allowance = await self.getAllowance(currencyToCheck);
          if (
            allowance ==
            parseInt(
              self.form.approvedAmount *
                Math.pow(10, this.getDecimal(this.getActiveToken))
            )
          ) {
            clearInterval(check);
            self.approvedStatus = true;
            self.form.approvedCurrency = "";
            if (self.liquidity === "add") self.onAddLiquidity();
          }
          if (!txHash) txHash = self.unlockTxHash;
          let isFailed = await self.isTxFailed(txHash);
          console.log(`is Tx Failed: ${isFailed}`);
          if (isFailed) {
            clearInterval(check);
            self.hideModal("unlock_request_modal_ref");
            self.showFailedUnlock(txHash);
          }
        }, 2000);
      } catch (e) {
        alert("Unable to Unlock your token.");
        console.log("Unable to Unlock your token.");
        console.log(e);
      }
    },
    async getAllowance(inputCurrency) {
      try {
        let exchangeAddress = this.getAvailableExchangeAddresses[inputCurrency];
        let tokenAddress = this.getAvailableTokenAddresses[inputCurrency];
        const accounts = await this.web3.eth.getAccounts();
        const contract = new this.web3.eth.Contract(ERC20_ABI, tokenAddress);
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
      if (evt) evt.preventDefault();
      console.log("Reset");
      this.liquidity = "add";
      this.form.outputCurrency = this.getActiveToken;
      this.form.inputValue = "";
      this.form.outputValue = "";
      this.loading = false;
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
      submitTxIdToServer(txHash);
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
      if (inputCurrency === "ETH") {
        let tokenExchangeAddress = this.getAvailableExchangeAddresses[
          outputCurrency
        ];
        let tokenContract = tokenContracts[outputCurrency];
        let ethReserve = await web3.eth.getBalance(tokenExchangeAddress);
        let tokenRserve = await tokenContract.methods
          .balanceOf(tokenExchangeAddress)
          .call();
        ethReserve = new BigNumber(ethReserve);
        tokenRserve = new BigNumber(tokenRserve);
        let absPrice = tokenRserve.dividedBy(ethReserve);
        absPrice = absPrice.toFixed(8);
        this.exchangeRate = absPrice;
        this.slippage =
          (100 * Math.abs(absPrice - this.exchangeRate)) / absPrice;
      }
    },
    async onAddLiquidity(evt) {
      let self = this;
      if (evt) evt.preventDefault();
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
      let inputValue = this.form.inputValue;
      let inputCurrency = this.form.inputCurrency;
      let outputValue = this.form.outputValue;
      let outputCurrency = this.activeToken;
      let ALLOWED_SLIPPAGE = this.ALLOWED_SLIPPAGE;
      let type = this.swapType;

      const allowance = await this.getAllowance(outputCurrency);
      const input =
        this.form.outputValue *
        Math.pow(10, this.getDecimal(this.getActiveToken));
      console.log(`Current token allowance is: ${allowance} ${outputCurrency}`);
      console.log(`Required token allowance is: ${input} ${outputCurrency}`);
      if (input > allowance) {
        this.loading = false;
        this.approvedStatus = false;
        this.form.approvedAmount = this.form.outputValue * 1.5;
        this.form.approvedCurrency = outputCurrency;
        this.showModal("unlock_request_modal_ref");
        return;
      }
      const block = await getLatestBlock(web3);
      const deadline = block.timestamp + 300;
      const accounts = await web3.eth.getAccounts();
      let exchangeContract = exchangeContracts[outputCurrency];
      if (!exchangeContract) {
        exchangeContract = new this.web3.eth.Contract(
          exchangeABI,
          self.getAvailableExchangeAddresses[outputCurrency]
        );
      }
      const contractAddress = this.getAvailableExchangeAddresses[
        outputCurrency
      ];
      console.log(exchangeContract);
      let ethAmount = new BigNumber(inputValue * Math.pow(10, 18));
      let tokenAmount = new BigNumber(outputValue).multipliedBy(
        10 ** this.getDecimal(this.getActiveToken)
      );
      let ethReserve = await web3.eth.getBalance(contractAddress);

      const totalLiquidity = await exchangeContract.methods
        .totalSupply()
        .call();
      let liquidityMinted = new BigNumber(totalLiquidity).multipliedBy(
        ethAmount.dividedBy(ethReserve)
      );
      if (Number.isNaN(liquidityMinted) || liquidityMinted == "NaN")
        liquidityMinted = new BigNumber(0);

      console.log(`total liquidity: ${totalLiquidity}`);
      console.log(`eth reserve: ${ethReserve}`);
      console.log(`minted liquidity: ${liquidityMinted}`);

      const MAX_LIQUIDITY_SLIPPAGE = 0.025;
      const minLiquidity = liquidityMinted.multipliedBy(
        1 - MAX_LIQUIDITY_SLIPPAGE
      );
      const maxTokens = tokenAmount.multipliedBy(1 + MAX_LIQUIDITY_SLIPPAGE);
      try {
        if (this.getAccount.type === "metamask") {
          this.txHash = await metamaskAddLiquidity(
            {
              from: this.getAccount.address,
              ethAmount: ethAmount,
              gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
              gasLimit: parseInt(this.gasLimit),
              minLiquidity,
              maxTokens,
              deadline
            },
            exchangeContract,
            contractAddress,
            null,
            this.web3
          );
        } else {
          this.txHash = await addLiquidity(
            {
              from: this.getAccount.address,
              ethAmount: ethAmount,
              gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
              gasLimit: parseInt(this.gasLimit),
              minLiquidity,
              maxTokens,
              deadline
            },
            exchangeContract,
            contractAddress,
            this.getAccount.privateKey,
            this.web3
          );
        }
      } catch (e) {
        console.log(e);
        console.log("error occoured while adding liquidity...");
      }
      if (this.txHash) console.log(this.txHash);
      if (!this.txHash) {
        this.loading = false;
        this.hideModal("unlock_request_modal_ref");
        this.showModal("failed_model_ref");
        return;
      }
      this.updateActiveToken(outputCurrency);
      this.onReset();
      this.loading = false;
      this.hideModal("unlock_request_modal_ref");
      this.showSuccessToast(this.txHash);
    },
    async onRemoveLiquidity(evt) {
      if (evt) evt.preventDefault();
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
      let inputValue = this.form.inputValue;
      let inputCurrency = this.form.inputCurrency;
      let outputValue = this.form.outputValue;
      let outputCurrency = this.activeToken;
      let ALLOWED_SLIPPAGE = this.ALLOWED_SLIPPAGE;
      let type = this.swapType;

      const block = await getLatestBlock(web3);
      const deadline = block.timestamp + 300;

      let exchangeContract = exchangeContracts[outputCurrency];
      if (!exchangeContract) {
        exchangeContract = new this.web3.eth.Contract(
          exchangeABI,
          self.getAvailableExchangeAddresses[outputCurrency]
        );
      }
      const contractAddress = this.getAvailableExchangeAddresses[
        outputCurrency
      ];
      let tokenContract = tokenContracts[outputCurrency];

      let ethReserve = await web3.eth.getBalance(contractAddress);
      let tokenReserve = await tokenContract.methods
        .balanceOf(contractAddress)
        .call();

      const totalSupply = await exchangeContract.methods.totalSupply().call();
      const amount = new BigNumber(inputValue * Math.pow(10, 18));
      const ownership = amount.dividedBy(totalSupply);
      const ethWithdrawn = new BigNumber(ethReserve).multipliedBy(ownership);
      const tokenWithdrawn = new BigNumber(tokenReserve).multipliedBy(
        ownership
      );

      let ethBalance = await web3.eth.getBalance(this.getAccount.address);
      ethBalance = new BigNumber(ethBalance);
      const liquidityBalance = new BigNumber(totalSupply).multipliedBy(
        ethBalance.dividedBy(ethReserve)
      );

      document.querySelector(
        "#withdrawn-eth"
      ).innerHTML = ethWithdrawn.dividedBy(10 ** 18).toFixed(6);
      document.querySelector(
        "#withdrawn-token"
      ).innerHTML = tokenWithdrawn
        .dividedBy(10 ** this.getDecimal(this.getActiveToken))
        .toFixed(6);

      try {
        if (this.getAccount.type === "metamask") {
          this.txHash = await metamaskRemoveLiquidity(
            {
              from: this.getAccount.address,
              gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
              gasLimit: parseInt(this.gasLimit),
              amount,
              ethWithdrawn,
              tokenWithdrawn,
              deadline
            },
            exchangeContract,
            contractAddress,
            null,
            this.web3
          );
        } else {
          this.txHash = await removeLiquidity(
            {
              from: this.getAccount.address,
              gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
              gasLimit: parseInt(this.gasLimit),
              amount,
              ethWithdrawn,
              tokenWithdrawn,
              deadline
            },
            exchangeContract,
            contractAddress,
            this.getAccount.privateKey,
            this.web3
          );
        }
      } catch (e) {
        console.log(e);
        console.log("error occoured while adding liquidity...");
      }
      if (!this.txHash) {
        this.loading = false;
        this.showModal("failed_model_ref");
        return;
      }
      if (this.txHash) console.log(this.txHash);
      this.updateActiveToken(this.form.outputCurrency);
      this.onReset();
      this.loading = false;
      this.showSuccessToast(this.txHash);
    },
    async updateLiquidityBalance() {
      let web3 = this.web3;
      let outputCurrency = this.form.outputCurrency;
      let inputValue = this.form.inputValue;
      let exchangeContract = exchangeContracts[outputCurrency];
      let liquidityBalance = await exchangeContract.methods
        .balanceOf(this.getAccount.address)
        .call();
      liquidityBalance = new BigNumber(liquidityBalance)
        .dividedBy(10 ** 18)
        .toFixed(6);
      this.liquidityBalance = liquidityBalance;
      document.querySelector("#liquidity-balance").innerHTML = liquidityBalance;
    },
    onSelectLiquidityType() {
      if (this.liquidity === "remove") {
        this.updateLiquidityBalance();
      }
    },
    changeSelected(method) {
      if (method === "add_liquidity") {
        this.liquidity = "add";
      } else if (method === "remove_liquidity") {
        this.liquidity = "remove";
        this.updateLiquidityBalance();
      }
    },
    async isTxFailed(txHash) {
      let url = `https://api.etherscan.io/api?module=transaction&action=getstatus&txhash=${txHash}&apikey=${
        config.etherscanApiKey
      }`;
      let response = await axios.get(url);
      if (response.data.result.isError == "1") return true;
      return false;
    },
    async showFailedUnlock(txHash) {
      // cancel allowance checker after 5min
      this.failedErrorMessage = `The swap transaction was canceled since the approval transaction has failed on Ethereum network ! Please see transaction detail on <a href="https://etherscan.io/tx/${txHash}" target="_blank">etherscan.io</a>`;
      this.showModal("failed_model_ref");
    }
  }
};
</script>


<style>
.swaptoken-view {
  min-height: 100vh;
}
#uniswap-liquidity-section h4 {
  text-align: center;
  margin-bottom: 30px;
}
#uniswap-liquidity-section {
  padding-top: 20px;
  width: 90%;
  max-width: 700px;
  margin: 0 auto;
}
.submit-button-group {
  display: flex;
  justify-content: space-between;
}
#uniswap-liquidity-section form button {
  flex-grow: 1;
  margin: 20px 5px;
}
#unlock_request_modal {
  position: fixed;
  top: 150px;
}
#success_modal .modal-dialog,
#unlock_request_modal .modal-dialog {
  width: 50% !important;
  margin: 0 auto !important;
  height: auto !important;
}
#unlock_request_modal .modal-body,
#success_modal .modal-body {
  padding: 15px !important;
}
#unlock_request_modal form {
  margin-bottom: 15px !important;
}
#unlock_request_modal .modal-header {
  position: relative !important;
}
#unlock_request_modal .modal-body {
  position: relative !important;
  top: 0px !important;
}
label {
  font-weight: bolder;
  font-size: 13px;
}
#uniswap-liquidity-section form {
  margin-bottom: 60px;
  margin-top: 35px;
}
#uniswap-liquidity-section .input-form-group {
  height: 80px;
}
#uniswap-liquidity-section img {
  width: 120px;
  margin: 20px auto;
}
#unlock_request_modal button[type="submit"] {
  width: 100%;
}
#pool-swap-button svg {
  transform: rotateZ(0deg);
}
#pool-swap-button {
  border-radius: 100px !important;
  width: 50px;
  height: 50px;
  display: block;
  margin: 0px auto !important;
  margin-bottom: 15px !important;
}
.exchange-info-container {
  display: flex;
  justify-content: space-between;
}
.exchange-info-container p {
  font-size: 13px;
  color: #223b48;
}
</style>