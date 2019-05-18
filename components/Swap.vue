<template>
  <div>
    <div id="uniswap-convert-section">
      <p style="text-align: center">
        Buy or Sell
        <strong>{{getActiveToken}}</strong>
      </p>
      <div v-if="!shouldRender" class="no-exchange-yet">
        <p>
          <strong>{{ getActiveToken }}</strong> does not have an uniswap exchange yet. Go to exchange tab and list the token frist.
        </p>
      </div>
      <b-form @submit="onSubmit" @reset="onReset" v-if="shouldRender">
        <label>Pay With</label>
        <b-form-group id="exampleInputGroup1">
          <b-form-select
            v-model="form.inputCurrency"
            :options="availableInputTokens"
            @change="onCurrencyChange"
            :disabled="form.inputCurrency === getActiveToken"
          />
        </b-form-group>

        <b-button variant="primary" @click="onCurrencySwap" id="currency-swap-button">
          <font-awesome-icon icon="exchange-alt" size="lg" color="#fff"/>
        </b-button>

        <b-form-group id="exampleInputGroup1">
          <label>Receive In</label>
          <b-form-select
            v-model="form.outputCurrency"
            :options="availableOutputTokens"
            @change="onCurrencyChange"
            :disabled="form.outputCurrency === getActiveToken"
          />
        </b-form-group>

        <b-form-group v-if="this.validateCurrency" prepend="@">
          <label for>Enter {{form.inputCurrency}} amount to sell</label>
          <label class="use-all-funds" @click="useAllFunds">Use All Funds</label>
          <b-form-input
            id="inputValue"
            type="text"
            v-model="form.inputValue"
            required
            :state="validateinputValue && validateBalance && validateSlippage"
            @keyup="onAmountChange"
            @focus="onInputFocus"
          />
          <b-form-invalid-feedback
            :state="validateinputValue && validateBalance && validateSlippage"
          >{{ inputErrorMessage }}</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group v-if="this.validateCurrency">
          <label for>{{form.outputCurrency}} amount to recieve</label>
          <b-form-input
            id="inputValue"
            type="text"
            v-model="form.outputValue"
            required
            :state="validateOutputAmount"
            @keyup="onAmountChange"
            @focus="onOutputFocus"
          />
          <b-form-invalid-feedback :state="validateOutputAmount">{{ outputErrorMessage }}</b-form-invalid-feedback>
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
          <b-button type="submit" variant="primary" :disabled="shouldDisableSwapButton">Swap</b-button>
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
import { tokenAddresses, exchangeAddresses } from "../assets/js/token";
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
  metamaskSwap,
  hasTokenUniswap
} from "../assets/js/utils";
import BigNumber from "bignumber.js";

let tokenSymbols = Object.keys(exchangeAddresses);
let exchangeContracts = {};
let tokenAddressess = {};
let tokenContracts = {};

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
        approvedAmount: 0
      },
      loading: false,
      showAdvanced: false,
      gasPrice: 0,
      gasLimit: 51000,
      txFee: 0,
      txHash: "",
      approvedStatus: "",
      lastEditedField: "",
      unlockTxHash: "",
      inputErrorMessage: "Please input a valid amount",
      outputErrorMessage: "Please input a valid amount",
      slippage: null
    };
  },
  computed: {
    ...mapGetters({
      getAccount: "account/getAccount",
      getAvailableTokenList: "account/getAvailableTokenList",
      getActiveToken: "getActiveToken",
      getBalance: "account/getBalance"
    }),
    shouldRender: function() {
      if (hasTokenUniswap(this.getActiveToken)) return true;
      else return false;
    },
    availableTokens: function() {
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
        !this.validateSlippage
      );
    }
  },
  mounted: async function() {
    this.form.inputCurrency = this.getActiveToken;
    this.web3 = await getWeb3();
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
    onCurrencySwap() {
      let input = this.form.inputCurrency;
      let output = this.form.outputCurrency;
      this.form.inputCurrency = output;
      this.form.outputCurrency = input;
      this.lastEditedField === "input";
      this.onAmountChange();
    },
    async onAmountChange() {
      if (!this.form.inputCurrency || !this.form.outputCurrency) return;
      if (this.lastEditedField === "input") {
        if (!this.validateinputValue) {
          this.form.outputValue = "";
          return;
        }
        if (this.swapType === "TOKEN_TO_ETH") {
          let exchangeContract = exchangeContracts[this.form.inputCurrency];
          let tokenSold = new BigNumber(
            this.form.inputValue * Math.pow(10, 18)
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
          this.form.outputValue = parseFloat(tokenBought / Math.pow(10, 18));
        } else if (this.swapType === "TOKEN_TO_TOKEN") {
          let exchangeContractA = exchangeContracts[this.form.inputCurrency];
          let tokenSoldA = new BigNumber(
            this.form.inputValue * Math.pow(10, 18)
          ).toFixed(0);
          let ethBought = await exchangeContractA.methods
            .getTokenToEthInputPrice(tokenSoldA)
            .call();

          let ethSold = ethBought;
          let exchangeContractB = exchangeContracts[this.form.outputCurrency];
          let tokenBoughtB = await exchangeContractB.methods
            .getEthToTokenInputPrice(ethSold)
            .call();
          this.form.outputValue = parseFloat(tokenBoughtB / Math.pow(10, 18));
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
          this.form.inputValue = parseFloat(tokenSold / Math.pow(10, 18));
        } else if (this.swapType === "ETH_TO_TOKEN") {
          let exchangeContract = exchangeContracts[this.form.outputCurrency];
          let tokenBought = new BigNumber(
            this.form.outputValue * Math.pow(10, 18)
          ).toFixed(0);
          let ethSold = await exchangeContract.methods
            .getEthToTokenOutputPrice(tokenBought)
            .call();
          this.form.inputValue = parseFloat(ethSold / Math.pow(10, 18));
        } else if (this.swapType === "TOKEN_TO_TOKEN") {
          let exchangeContractB = exchangeContracts[this.form.outputCurrency];
          let tokenSoldB = new BigNumber(
            this.form.outputValue * Math.pow(10, 18)
          ).toFixed(0);
          let ethBought = await exchangeContractB.methods
            .getTokenToEthInputPrice(tokenSoldB)
            .call();

          let ethSold = ethBought;
          let exchangeContractA = exchangeContracts[this.form.inputCurrency];
          let tokenBoughtA = await exchangeContractA.methods
            .getEthToTokenInputPrice(ethSold)
            .call();
          this.form.inputValue = parseFloat(tokenBoughtA / Math.pow(10, 18));
        }
      }
      this.updateExchangeRateAndSlippage();
    },
    async onUnlock(evt) {
      evt.preventDefault();
      this.approvedStatus = "waiting";
      this.unlockTxHash = await unlockToken(
        {
          from: this.getAccount.address,
          approvedAmount: this.form.approvedAmount * Math.pow(10, 18),
          gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
          gasLimit: parseInt(this.gasLimit)
        },
        this.form.inputCurrency,
        {
          web3: this.web3,
          exchangeAddress: exchangeAddresses[this.form.inputCurrency],
          privateKey: this.getAccount.privateKey
        }
      );

      // checking allowance
      let self = this;
      const check = setInterval(async () => {
        console.log("Checking allowance...");
        const allowance = await self.getAllowance(self.form.inputCurrency);
        if (
          allowance == parseInt(self.form.approvedAmount * Math.pow(10, 18))
        ) {
          clearInterval(check);
          self.approvedStatus = true;
        }
      }, 1000);
    },
    async onSubmit(evt) {
      evt.preventDefault();
      this.loading = true;
      let web3 = this.web3;
      let inputValue = this.form.inputValue;
      let inputCurrency = this.form.inputCurrency;
      let outputValue = this.form.outputValue;
      let outputCurrency = this.form.outputCurrency;
      let ALLOWED_SLIPPAGE = this.ALLOWED_SLIPPAGE;
      let type = this.swapType;
      let exchangeContract = exchangeContracts[outputCurrency];
      console.log(this.getAccount);
      if (this.getAccount.type === "metamask") {
        this.txHash = await metamaskSwap({
          inputValue,
          inputCurrency,
          outputValue,
          outputCurrency,
          type,
          exchangeContract
        });
        if (this.txHash) {
          this.updateActiveToken(this.form.outputCurrency);
          this.onReset();
          this.loading = false;
          this.showModal("success_modal_ref");
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
            const contractAddress = exchangeAddresses[outputCurrency];
            let minimumTokenBought = new BigNumber(outputValue - 1)
              .multipliedBy(10 ** 18)
              .toNumber(0);
            if (minimumTokenBought <= 0) {
              minimumTokenBought = new BigNumber(outputValue)
                .multipliedBy(0.9)
                .multipliedBy(10 ** 18)
                .toNumber(0);
            }
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
                  deadline
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
            this.onReset();
            this.loading = false;
            this.showModal("success_modal_ref");
          } else if (type === "TOKEN_TO_ETH") {
            exchangeContract = exchangeContracts[inputCurrency];
            const tokenSold = new BigNumber(inputValue * Math.pow(10, 18));
            const exchangeRate = parseFloat(outputValue / inputValue);
            let minEth = new BigNumber(outputValue)
              .minus(exchangeRate)
              .multipliedBy(10 ** 18)
              .toNumber(0);
            if (minEth <= 0) {
              minEth = new BigNumber(outputValue)
                .multipliedBy(0.9)
                .multipliedBy(10 ** 18)
                .toNumber(0);
            }
            const contractAddress = exchangeAddresses[inputCurrency];
            await this.updateGasLimitAndTxFee();
            const allowance = await this.getAllowance(this.form.inputCurrency);

            const input = this.form.inputValue * Math.pow(10, 18);
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
              amount: parseFloat(this.form.inputValue) * Math.pow(10, 18),
              gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
              gasLimit: parseInt(this.gasLimit),
              tokenSold,
              minEth,
              deadline
            });
            this.txHash = await swapTokenToEth(
              {
                from: this.getAccount.address,
                amount: parseFloat(this.form.inputValue) * Math.pow(10, 18),
                gasPrice: parseInt(this.gasPrice * Math.pow(10, 9)),
                gasLimit: parseInt(this.gasLimit),
                tokenSold,
                minEth,
                deadline
              },
              exchangeContract,
              contractAddress,
              this.getAccount.privateKey,
              this.web3
            );
            this.updateActiveToken(this.form.outputCurrency);
            this.onReset();
            this.loading = false;
            this.showModal("success_modal_ref");
          } else if (type === "TOKEN_TO_TOKEN") {
            exchangeContract = exchangeContracts[inputCurrency];
            const contractAddress = exchangeAddresses[inputCurrency];
            const tokenASold = new BigNumber(
              inputValue * Math.pow(10, 18)
            ).toNumber(0);
            const minTokenBBought = new BigNumber(1).toNumber(0);
            // let exchangeRate;
            // let minTokenBBought;
            // if (inputCurrency === "ULT") {
            //   exchangeRate = parseFloat(outputValue / inputValue);
            //   minTokenBBought = new BigNumber(outputValue)
            //     .minus(exchangeRate)
            //     .multipliedBy(10 ** 18)
            //     .toNumber(0);
            // } else if (outputCurrency === "ULT") {
            //   minTokenBBought = new BigNumber(outputValue)
            //     .minus(1)
            //     .multipliedBy(10 ** 18)
            //     .toNumber(0);
            // }
            // if (minTokenBBought <= 0) {
            //   minTokenBBought = new BigNumber(outputValue)
            //     .multipliedBy(0.9)
            //     .multipliedBy(10 ** 18)
            //     .toNumber(0);
            // }
            console.log(`Minimum token bought is ${minTokenBBought}`);
            const minEth = new BigNumber(1).toNumber(0);
            const outputTokenAddress = tokenAddressess[outputCurrency];
            await this.updateGasLimitAndTxFee();

            // check allowance value for input token
            const allowance = await this.getAllowance(this.form.inputCurrency);
            const input = this.form.inputValue * Math.pow(10, 18);
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
                outputTokenAddress
              },
              exchangeContract,
              contractAddress,
              this.getAccount.privateKey,
              this.web3
            );
            this.updateActiveToken(this.form.outputCurrency);
            this.onReset();
            this.loading = false;
            this.showModal("success_modal_ref");
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
      if (inputCurrency !== "ETH") {
        if (outputCurrency !== "ETH") {
          let tokenExchangeAddressA = exchangeAddresses[inputCurrency];
          let tokenContractA = tokenContracts[inputCurrency];
          let ethReserveA = await web3.eth.getBalance(tokenExchangeAddressA);
          let tokenRserveA = await tokenContractA.methods
            .balanceOf(tokenExchangeAddressA)
            .call();
          ethReserveA = new BigNumber(ethReserveA);
          tokenRserveA = new BigNumber(tokenRserveA);
          let absPriceA = tokenRserveA.dividedBy(ethReserveA);

          let tokenExchangeAddressB = exchangeAddresses[outputCurrency];
          let tokenContractB = tokenContracts[outputCurrency];
          let ethReserveB = await web3.eth.getBalance(tokenExchangeAddressB);
          let tokenReserveB = await tokenContractB.methods
            .balanceOf(tokenExchangeAddressB)
            .call();
          ethReserveB = new BigNumber(ethReserveB);
          tokenReserveB = new BigNumber(tokenReserveB);
          let absPriceB = tokenReserveB.dividedBy(ethReserveB);

          let absPrice = absPriceB.dividedBy(absPriceA);
          absPrice = absPrice.toFixed(8);
          console.log(`Abs Price is : ${absPrice}`);

          this.exchangeRate = outputValue / inputValue;
          this.slippage =
            (100 * Math.abs(absPrice - this.exchangeRate)) / absPrice;
        } else if (outputCurrency === "ETH") {
          let tokenExchangeAddress = exchangeAddresses[inputCurrency];
          let tokenContract = tokenContracts[inputCurrency];
          let ethReserve = await web3.eth.getBalance(tokenExchangeAddress);
          let tokenRserve = await tokenContract.methods
            .balanceOf(tokenExchangeAddress)
            .call();
          ethReserve = new BigNumber(ethReserve);
          tokenRserve = new BigNumber(tokenRserve);

          let absPrice = ethReserve.dividedBy(tokenRserve);
          absPrice = absPrice.toFixed(8);

          this.exchangeRate = outputValue / inputValue;
          this.slippage =
            (100 * Math.abs(absPrice - this.exchangeRate)) / absPrice;
        }
      } else if (outputCurrency !== "ETH") {
        if (inputCurrency !== "ETH") {
          let tokenExchangeAddressA = exchangeAddresses[inputCurrency];
          let tokenContractA = tokenContracts[inputCurrency];
          let ethReserveA = await web3.eth.getBalance(tokenExchangeAddressA);
          let tokenRserveA = await tokenContractA.methods
            .balanceOf(tokenExchangeAddressA)
            .call();
          ethReserveA = new BigNumber(ethReserveA);
          tokenRserveA = new BigNumber(tokenRserveA);
          let absPriceA = tokenRserveA.dividedBy(ethReserveA);

          let tokenExchangeAddressB = exchangeAddresses[outputCurrency];
          let tokenContractB = tokenContracts[outputCurrency];
          let ethReserveB = await web3.eth.getBalance(tokenExchangeAddressB);
          let tokenReserveB = await tokenContractB.methods
            .balanceOf(tokenExchangeAddressB)
            .call();
          ethReserveB = new BigNumber(ethReserveB);
          tokenReserveB = new BigNumber(tokenReserveB);
          let absPriceB = tokenReserveB.dividedBy(ethReserveB);

          let absPrice = absPriceB.dividedBy(absPriceA);
          absPrice = absPrice.toFixed(8);

          this.exchangeRate = outputValue / inputValue;
          this.slippage =
            (100 * Math.abs(absPrice - this.exchangeRate)) / absPrice;
        } else if (inputCurrency === "ETH") {
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

          // let absPrice = await getULTToETHPrice()
          // absPrice = 1 / absPrice
          this.exchangeRate = outputValue / inputValue;
          this.slippage =
            (100 * Math.abs(absPrice - this.exchangeRate)) / absPrice;
        }
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
form label {
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
</style>