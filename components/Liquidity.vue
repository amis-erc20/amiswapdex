<template>
  <div>
    <div id="uniswap-convert-section">
      <div v-if="!shouldRender" class="no-exchange-yet">
        <p>
          <strong>{{ getActiveToken }}</strong> does not have an uniswap exchange yet. Go to exchange tab and list the token frist.
        </p>
      </div>
      <b-form-group v-if="shouldRender" id="exampleInputGroup1">
        <label>Add Liquidity / Remove Liquidity / Create Exchange</label>
        <b-form-select
          v-model="liquidity"
          :options="[{text: `Select an option to start`, value: ''}, {text: `Add Liquidity`, value: `add`}, {text: `Remove Liquidity`, value: `remove`}]"
          @change="onSelectLiquidityType"
        />
      </b-form-group>
      <b-form @submit="onAddLiquidity" @reset="onReset" v-if="liquidity === `add`">
        <label>Deposit ETH</label>
        <label class="use-all-funds" @click="useAllFunds">Use All Funds</label>
        <b-form-group id="exampleInputGroup1">
          <b-form-input
            id="inputValue"
            type="text"
            v-model="form.inputValue"
            required
            :state="validateinputValue && validateETHBalance"
            @keyup="onAmountChange"
            @focus="onInputFocus"
          />
          <b-form-invalid-feedback
            :state="validateinputValue && validateETHBalance"
          >{{ inputErrorMessage }}</b-form-invalid-feedback>
        </b-form-group>

        <b-button variant="primary" id="currency-swap-button">
          <font-awesome-icon icon="plus" size="lg" color="#fff"/>
        </b-button>

        <b-form-group id="exampleInputGroup1">
          <label>Deposit {{getActiveToken}}</label>
          <b-form-input
            id="inputValue"
            type="text"
            v-model="form.outputValue"
            required
            :state="validateOutputAmount && validateTokenBalance"
            @keyup="onAmountChange"
            @focus="onOutputFocus"
          />
          <b-form-invalid-feedback
            :state="validateOutputAmount && validateTokenBalance"
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
        </div>

        <b-form-group v-if="form.inputCurrency !== null">
          <b-form-checkbox switch v-model="showAdvanced" name="check-button">Show Advanced Settings</b-form-checkbox>
        </b-form-group>
        <b-form-group v-if="form.inputCurrency !== null && showAdvanced">
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
        <b-form-group v-if="form.inputCurrency !== null && showAdvanced">
          <label for="range-1">Gas Limit: {{ gasLimit }} gas</label>
          <b-form-input type="text" required v-model="gasLimit"/>
        </b-form-group>
        <div class="submit-button-group">
          <b-button type="reset" variant="outline-dark">Reset</b-button>
          <b-button type="submit" variant="primary" :disabled="shouldDisableAddButton">Add Liquidity</b-button>
        </div>
      </b-form>

      <!-- REMOVE LIQUIDITY FORM -->
      <b-form @submit="onRemoveLiquidity" @reset="onReset" v-if="liquidity === `remove`">
        <b-form-group id="exampleInputGroup1">
          <label>Amount of Pool Token</label>
          <label class="use-all-funds">
            Liquidity Balance:
            <span id="liquidity-balance"></span>
          </label>
          <b-form-input
            id="inputValue"
            type="text"
            v-model="form.inputValue"
            required
            :state="validateLiquidityInput"
            @keyup="onRemoveAmountChange"
            @focus="onInputFocus"
          />
          <b-form-invalid-feedback :state="validateLiquidityInput">{{ inputErrorMessage }}</b-form-invalid-feedback>
        </b-form-group>

        <b-button variant="primary" id="currency-swap-button">
          <font-awesome-icon icon="arrow-down" size="lg" color="#fff"/>
        </b-button>

        <b-form-group id="exampleInputGroup1">
          <label>Withdrawn Amount</label>
          <p>
            <span id="withdrawn-eth">0.00</span> ETH +
            <span id="withdrawn-token">0.00</span>
            {{getActiveToken}}
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
          <b-form-checkbox switch v-model="showAdvanced" name="check-button">Show Advanced Settings</b-form-checkbox>
        </b-form-group>
        <b-form-group v-if="form.inputCurrency !== null && showAdvanced">
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
        <b-form-group v-if="form.inputCurrency !== null && showAdvanced">
          <label for="range-1">Gas Limit: {{ gasLimit }} gas</label>
          <b-form-input type="text" required v-model="gasLimit"/>
        </b-form-group>
        <div class="submit-button-group">
          <b-button type="reset" variant="outline-dark">Reset</b-button>
          <b-button
            type="submit"
            variant="primary"
            :disabled="shouldDisableRemoveButton"
          >Remove Liquidity</b-button>
        </div>
      </b-form>

      <!-- ADD EXCHANGE FORM -->
      <b-form @submit="onCreateExchange" @reset="onReset" v-if="liquidity === `create`">
        <label>Token Address</label>
        <b-form-group id="exampleInputGroup1">
          <b-form-input
            id="inputValue"
            type="text"
            v-model="form.tokenAddress"
            required
            @focus="onInputFocus"
          />
        </b-form-group>

        <b-form-group v-if="form.inputCurrency !== null">
          <b-form-checkbox switch v-model="showAdvanced" name="check-button">Show Advanced Settings</b-form-checkbox>
        </b-form-group>
        <b-form-group v-if="form.inputCurrency !== null && showAdvanced">
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
        <b-form-group v-if="form.inputCurrency !== null && showAdvanced">
          <label for="range-1">Gas Limit: {{ gasLimit }} gas</label>
          <b-form-input type="text" required v-model="gasLimit"/>
        </b-form-group>

        <div class="submit-button-group">
          <b-button type="reset" variant="outline-dark">Reset</b-button>
          <b-button
            type="submit"
            variant="primary"
            :disabled="shouldDisableCreateExchangeButton"
          >Create Exchange</b-button>
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
            <b-form-input type="text" v-model="form.approvedAmount"/>
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
  tokenAddresses,
  exchangeAddresses,
  factoryAddress
} from "../assets/js/token";
import {
  getWeb3,
  estimateGas,
  estimateGasPrice,
  sendToken,
  signAndSendETH,
  swapTokenToEth,
  unlockToken,
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
  hasTokenUniswap
} from "../assets/js/utils";
import BigNumber from "bignumber.js";

let tokenSymbols = Object.keys(exchangeAddresses);
let exchangeContracts = {};
let tokenAddressess = {};
let tokenContracts = {};
let defaultGasLimit = 51000 * 2;

export default {
  data() {
    return {
      config: {
        mainToken: {
          symbol: "ULT",
          exchangeAddress: "0x28d9353611C5A0d5a026A648c05E5d6523e41CBf"
        },
        tokenListUrl: "https://beta.shardus.com/assets/js/tokenDB.json",
        chartServerUrl: "https://bounty.shardus.com:8889",
        colorScheme: {
          mainColor: "red",
          secondaryColor: "black"
        },
        logoUrl: "https://beta.shardus.com/assets/img/logo.svg",
        widgetTitle: ""
      },
      web3: null,
      ALLOWED_SLIPPAGE: 0.025,
      mainToken: "ULT",
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
      gasPrice: 0,
      gasLimit: defaultGasLimit,
      txFee: 0,
      txHash: "",
      approvedStatus: "",
      lastEditedField: "",
      unlockTxHash: "",
      inputErrorMessage: "Please input a valid amount",
      outputErrorMessage: "Please input a valid amount",
      slippage: null,
      liquidity: "",
      liquidityBalance: 0.0
    };
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getActiveToken: "getActiveToken",
      getBalance: "account/getBalance"
    }),
    shouldRender: function() {
      if (hasTokenUniswap(this.getActiveToken)) return true;
      else return false;
    },
    availableTokens: function() {
      let options = tokenSymbols.map(symbol => {
        return {
          value: symbol,
          text: symbol
        };
      });
      options.unshift({ value: "ETH", text: "ETH" });
      options.unshift({ value: null, text: "Please select currency" });
      return options;
    },
    availableInputTokens() {
      let outputCurrency = this.form.outputCurrency;
      if (this.form.outputCurrency === null) return this.availableTokens;
      else
        return this.availableTokens.filter(
          token => token.value !== outputCurrency
        );
    },
    availableOutputTokens() {
      let inputCurrency = this.form.inputCurrency;
      if (this.form.inputCurrency === null) return this.availableTokens;
      else
        return this.availableTokens.filter(
          token => token.value !== inputCurrency
        );
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
      let ethBalance = parseFloat(this.getBalance["ETH"] / Math.pow(10, 18));

      if (this.form.inputCurrency === "ETH") {
        if (amount + txFee > ethBalance) {
          this.inputErrorMessage = "Not enough ETH balance or transaction fee";
          return false;
        }
      } else {
        let tokenBalance = parseFloat(
          this.getBalance[this.form.inputCurrency] / Math.pow(10, 18)
        );
        if (amount > tokenBalance || txFee > ethBalance) {
          this.inputErrorMessage =
            "Not enough token balance or transaction fee";
          return false;
        }
      }
      return true;
    },
    validateTokenBalance() {
      if (!this.validateOutputAmount) return false;
      let tokenAmount = parseFloat(this.form.outputValue * 1);
      let tokenBalance = parseFloat(
        this.getBalance[this.form.outputCurrency] / Math.pow(10, 18)
      );
      if (tokenAmount > tokenBalance) {
        this.outputErrorMessage = "Not enough token balance";
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
    shouldDisableAddButton() {
      return (
        this.loading ||
        !this.validateCurrency ||
        !this.validateinputValue ||
        !this.validateOutputAmount ||
        !this.validateETHBalance ||
        !this.validateSlippage
      );
    },
    shouldDisableRemoveButton() {
      return (
        this.loading ||
        !this.validateinputValue ||
        this.form.inputValue > this.liquidityBalance
      );
    },
    shouldDisableCreateExchangeButton() {
      return this.loading || this.form.tokenAddress.length !== 42;
    }
  },
  mounted: async function() {
    this.form.inputCurrency = "ETH";
    this.form.outputCurrency = this.getActiveToken;
    if (this.getAccount.type === "metamask") {
      this.web3 = await getWeb3Metamask();
    } else {
      this.web3 = await getWeb3();
    }
    this.account = this.getAccount;
    for (let i = 0; i < tokenSymbols.length; i += 1) {
      exchangeContracts[tokenSymbols[i]] = new this.web3.eth.Contract(
        exchangeABI,
        exchangeAddresses[tokenSymbols[i]]
      );
    }
    tokenSymbols.forEach(async token => {
      const contract = exchangeContracts[token];
      tokenAddressess[token] = await contract.methods.tokenAddress().call();
      tokenContracts[token] = new this.web3.eth.Contract(
        tokenABI,
        tokenAddressess[token]
      );
    });
    let estimatedGasPriceFromNetwork = await estimateGasPrice(this.web3);
    this.gasPrice =
      parseInt(estimatedGasPriceFromNetwork / Math.pow(10, 9)) + 3;
    await this.updateGasLimitAndTxFee();
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
    async useAllFunds() {
      const contractAddress = exchangeAddresses[this.form.inputCurrency];
      let estimatedGas = await this.getEstimatedGas(contractAddress);
      if (estimatedGas * 2 > this.gasLimit) this.gasLimit = estimatedGas * 2;
      this.txFee =
        (1.6 * estimatedGas * this.gasPrice * 1000000000) / Math.pow(10, 18);
      if (this.form.inputCurrency === "ETH") {
        console.log(this.getBalance["ETH"] / Math.pow(10, 18), this.txFee);
        this.form.inputValue =
          parseFloat(this.getBalance["ETH"] / Math.pow(10, 18)) - this.txFee;
      } else {
        this.form.inputValue = parseFloat(
          this.getBalance[this.form.inputCurrency] / Math.pow(10, 18)
        );
      }
      this.lastEditedField = "input";
      this.onAmountChange();
    },
    async getEstimatedGas(toAddress) {
      let value = this.form.inputValue || 1;
      let estimatedGas = await estimateGas(
        {
          from: this.getAccount.address,
          to: toAddress,
          amount: new BigNumber(value * Math.pow(10, 18))
        },
        this.web3
      );
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

      const contractAddress = exchangeAddresses[this.form.inputCurrency];
      let estimatedGas = await this.getEstimatedGas(contractAddress);
      if (estimatedGas * 1.6 > this.gasLimit)
        this.gasLimit = estimatedGas * 1.6;
      if (
        this.swapType === "TOKEN_TO_TOKEN" &&
        this.gasLimit < estimatedGas * 2.5
      )
        this.gasLimit = estimatedGas * 2.5;
      console.log(estimatedGas, this.gasPrice, this.gasLimit);
    },
    async onAmountChange() {
      if (!this.form.inputCurrency || !this.form.outputCurrency) return;
      if (this.lastEditedField === "input") {
        if (!this.validateinputValue) {
          this.form.outputValue = "";
          return;
        }
        const absPrice = await getAbsPrice(
          this.form.inputCurrency,
          this.form.outputCurrency,
          this.web3
        );
        this.form.outputValue = absPrice
          .multipliedBy(this.form.inputValue)
          .toFixed(8);
      } else if (this.lastEditedField === "output") {
        if (!this.validateOutputAmount) {
          this.form.inputValue = "";
          return;
        }
        const absPrice = await getAbsPrice(
          this.form.inputCurrency,
          this.form.outputCurrency,
          this.web3
        );
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

      const blockNumber = await web3.eth.getBlockNumber();
      const block = await web3.eth.getBlock(blockNumber);
      const deadline = block.timestamp + 300;
      const accounts = await web3.eth.getAccounts();
      let exchangeContract = exchangeContracts[outputCurrency];
      const contractAddress = exchangeAddresses[outputCurrency];
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
      ).innerHTML = tokenWithdrawn.dividedBy(10 ** 18).toFixed(6);
    },
    async onUnlock(evt) {
      evt.preventDefault();
      this.approvedStatus = "waiting";
      let currencyToCheck = this.form.approvedCurrency
        ? this.form.approvedCurrency
        : this.form.inputCurrency;
      this.unlockTxHash = await unlockToken(
        {
          from: this.getAccount.address,
          approvedAmount: this.form.approvedAmount * Math.pow(10, 18),
          gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
          gasLimit: parseInt(this.gasLimit)
        },
        currencyToCheck,
        {
          web3: this.web3,
          exchangeAddress: exchangeAddresses[currencyToCheck],
          privateKey: this.getAccount.privateKey
        }
      );

      // checking allowance
      let self = this;

      const check = setInterval(async () => {
        console.log(`Checking allowance for ${currencyToCheck} token`);
        const allowance = await self.getAllowance(currencyToCheck);
        if (
          allowance == parseInt(self.form.approvedAmount * Math.pow(10, 18))
        ) {
          clearInterval(check);
          self.approvedStatus = true;
          self.form.approvedCurrency = "";
        }
      }, 1000);
    },
    async getAllowance(inputCurrency) {
      try {
        let exchangeAddress = exchangeAddresses[inputCurrency];
        let tokenAddress = tokenAddressess[inputCurrency];
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
      this.form.inputCurrency = null;
      this.form.outputCurrency = null;
      this.form.inputValue = "";
      this.form.outputValue = "";
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
        let tokenExchangeAddress = exchangeAddresses[outputCurrency];
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
      evt.preventDefault();
      this.loading = true;
      let web3 = this.web3;
      let inputValue = this.form.inputValue;
      let inputCurrency = this.form.inputCurrency;
      let outputValue = this.form.outputValue;
      let outputCurrency = this.form.outputCurrency;
      let ALLOWED_SLIPPAGE = this.ALLOWED_SLIPPAGE;
      let type = this.swapType;

      const allowance = await this.getAllowance(this.form.outputCurrency);
      const input = this.form.outputValue * Math.pow(10, 18);
      console.log(`Current token allowance is: ${allowance}`);
      if (input > allowance) {
        this.loading = false;
        this.approvedStatus = false;
        this.form.approvedAmount = this.form.outputValue * 1.5;
        this.form.approvedCurrency = this.form.outputCurrency;
        this.showModal("unlock_request_modal_ref");
        return;
      }

      const blockNumber = await web3.eth.getBlockNumber();
      const block = await web3.eth.getBlock(blockNumber);
      const deadline = block.timestamp + 300;
      const accounts = await web3.eth.getAccounts();
      let exchangeContract = exchangeContracts[outputCurrency];
      const contractAddress = exchangeAddresses[outputCurrency];

      let ethAmount = new BigNumber(inputValue * Math.pow(10, 18));
      let tokenAmount = new BigNumber(outputValue).multipliedBy(10 ** 18);
      let ethReserve = await web3.eth.getBalance(contractAddress);

      const totalLiquidity = await exchangeContract.methods
        .totalSupply()
        .call();
      const liquidityMinted = new BigNumber(totalLiquidity).multipliedBy(
        ethAmount.dividedBy(ethReserve)
      );

      console.log(`total liquidity: ${totalLiquidity}`);
      console.log(`minted liquidity: ${liquidityMinted}`);

      const MAX_LIQUIDITY_SLIPPAGE = 0.025;
      const minLiquidity = liquidityMinted.multipliedBy(
        1 - MAX_LIQUIDITY_SLIPPAGE
      );
      const maxTokens = tokenAmount.multipliedBy(1 + MAX_LIQUIDITY_SLIPPAGE);
      // await this.updateGasLimitAndTxFee();
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
        this.showModal("failed_model_ref");
        return;
      }
      this.updateActiveToken(this.form.outputCurrency);
      this.onReset();
      this.loading = false;
      this.showModal("success_modal_ref");
    },
    async onRemoveLiquidity(evt) {
      evt.preventDefault();
      this.loading = true;
      let web3 = this.web3;
      let inputValue = this.form.inputValue;
      let inputCurrency = this.form.inputCurrency;
      let outputValue = this.form.outputValue;
      let outputCurrency = this.form.outputCurrency;
      let ALLOWED_SLIPPAGE = this.ALLOWED_SLIPPAGE;
      let type = this.swapType;

      const blockNumber = await web3.eth.getBlockNumber();
      const block = await web3.eth.getBlock(blockNumber);
      const deadline = block.timestamp + 300;

      let exchangeContract = exchangeContracts[outputCurrency];
      const contractAddress = exchangeAddresses[outputCurrency];
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

      console.log(`eth balance: ${ethBalance.dividedBy(10 ** 18).toFixed(6)}`);
      console.log(
        `liquidityBalance: ${liquidityBalance.dividedBy(10 ** 18).toFixed(6)}`
      );
      console.log(
        `eth withdrawn: ${ethWithdrawn.dividedBy(10 ** 18).toFixed(6)}`
      );
      console.log(
        `token withdrawn: ${tokenWithdrawn.dividedBy(10 ** 18).toFixed(6)}`
      );

      document.querySelector(
        "#withdrawn-eth"
      ).innerHTML = ethWithdrawn.dividedBy(10 ** 18).toFixed(6);
      document.querySelector(
        "#withdrawn-token"
      ).innerHTML = tokenWithdrawn.dividedBy(10 ** 18).toFixed(6);

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
      if (this.txHash) console.log(this.txHash);
      if (!this.txHash) {
        this.loading = false;
        this.showModal("failed_model_ref");
        return;
      }
      this.updateActiveToken(this.form.outputCurrency);
      this.onReset();
      this.loading = false;
      this.showModal("success_modal_ref");
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
    async onCreateExchange(e) {
      e.preventDefault();
      this.loading = true;
      let tokenAddress = this.form.tokenAddress;
      let exchangeAddress = await getExchangeAddress(tokenAddress);
      if (
        exchangeAddress &&
        exchangeAddress !== "0x0000000000000000000000000000000000000000"
      ) {
        alert("Exchange address already existed for selected token");
        console.log(exchangeAddress);
      } else if (
        !exchangeAddress ||
        exchangeAddress === "0x0000000000000000000000000000000000000000"
      ) {
        let estimatedGas = await estimateGas(
          {
            from: this.getAccount.address,
            to: factoryAddress,
            amount: 1
          },
          this.web3
        );
        console.log(`Estimate gas: ${estimatedGas}`);
        this.gasLimit = 51000 * 2;
        // TODO: implement create new exchange
        // this.txHash = await createNewExchange(
        //   {
        //     from: this.getAccount.address,
        //     gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
        //     gasLimit: parseInt(this.gasLimit)
        //   },
        //   tokenAddress,
        //   this.getAccount.privateKey,
        //   this.web3
        // );
      } else {
        alert("Invalid token address");
      }
      if (this.txHash) console.log(this.txHash);
      if (!this.txHash) {
        this.loading = false;
        this.showModal("failed_model_ref");
        return;
      }
      this.onReset();
      this.loading = false;
      this.showModal("success_modal_ref");
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
  padding-top: 100px;
  width: 90%;
  max-width: 650px;
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
label {
  font-weight: bolder;
  font-size: 13px;
}
#uniswap-convert-section form {
  margin-bottom: 60px;
}
#uniswap-convert-section img {
  width: 120px;
  margin: 20px auto;
}
#unlock_request_modal button[type="submit"] {
  width: 100%;
}
#currency-swap-button svg {
  transform: rotateZ(0deg);
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
</style>