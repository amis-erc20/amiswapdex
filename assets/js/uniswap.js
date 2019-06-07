import { getWeb3 } from './utils'
import axios from 'axios'

let Uniswap = {}
let UniswapConvertWidget = async function (config) {
  let web3 = await getWeb3()
  let exchangeAddresses
  let tokenSymbols
  let tokenAddressess = {}
  let exchangeContracts = {}
  let tokenContracts = {}
  const ALLOWED_SLIPPAGE = 0.025
  let mainToken = config.mainToken
  let tokenDB

  async function getTokenList (url) {
    const response = await axios.get(url)
    return response.data
  }

  Uniswap.init = async function () {
    drawUI(config)

    $('#convert-btn').on('click', async function (e) {
      let isUserLoggedIn = await isLoggedIn()
      if (!isUserLoggedIn) {
        $('#swapModal').modal('hide')
        $('#noAccountModal').modal('show')
      } else {
        const accounts = await web3.eth.getAccounts()
        let inputCurrency = $('#inputCurrency').val()
        let inputValue = $('#inputValue').val()
        let balance = await getAccountBalance(inputCurrency, accounts[0])
        if (parseFloat(inputValue) > parseFloat(balance)) {
          alert(
            `Your wallet does not have enough ${inputCurrency} to create this transaction`
          )
          return
        }
        let data = {}
        $('#uniswap-form')
          .serializeArray()
          .forEach(input => {
            data[input.name] = input.value
          })
        $('.alert').hide()
        $('.alert-check').show()
        $(this).attr('disabled', true)
        try {
          swap(data)
        } catch (e) {
          alert('Network Error. Please try again')
          $('#convert-btn').attr('disabled', false)
          $('.alert').hide()
        }
      }
    })

    $('#unlock-token-btn').on('click', async e => {
      e.preventDefault()
      $('#swapModal').modal('hide')
      $('#approvalModal').modal('show')
      const inputCurrency = $('#inputCurrency').val()
      const inputValue = $('#inputValue').val()
      const minimumAmount =
				parseFloat(inputValue) + parseFloat(inputValue * 0.1)
      $('#approvalModal label span').text(`${minimumAmount} ${inputCurrency}`)
      $('#approvalModal label span').attr('minimumAmount', minimumAmount)
      $('#approvalModal input[type=text]').val(minimumAmount)
    })

    async function estimateGasPrice (
      from,
      value,
      inputCurrency,
      outputCurrency
    ) {
      console.log(inputCurrency, outputCurrency)
      let gas
      let amount = new BigNumber(value * Math.pow(10, 18))

      if (
        (inputCurrency === 'ETH' && outputCurrency === 'ULT') ||
				(inputCurrency === 'ULT' && outputCurrency === 'ETH')
      ) {
        console.log(`ETH to ULT or ULT to ETH`)
        let exchange = exchangeAddresses['ULT']
        gas = await web3.eth.estimateGas({
          from: from,
          to: exchange,
          value: amount
        })
      } else {
        console.log(`TOKEN to ULT or ULT to TOKEN`)
        let exchange1 = exchangeAddresses[inputCurrency]
        let exchange2 = exchangeAddresses[outputCurrency]
        let gas1 = await web3.eth.estimateGas({
          from: from,
          to: exchange1,
          value: amount
        })
        let gas2 = await web3.eth.estimateGas({
          from: from,
          to: exchange2,
          value: amount
        })
        gas = gas1 + gas2
      }
      let gas_price_network = await web3.eth.getGasPrice()
      gas_price_network = parseInt(gas_price_network) / Math.pow(10, 9)
      let cost = (1.6 * gas * gas_price_network * 1000000000) / Math.pow(10, 18)
      console.log(`Estimated Gas is ${gas} WEI`)
      console.log(`gas price from network: ${gas_price_network} GWEI`)
      console.log(`Tx Cost is ${cost} ETH`)
      return cost
    }

    $('#max-btn').on('click', async e => {
      e.preventDefault()
      const accounts = await web3.eth.getAccounts()
      let inputCurrency = $('#inputCurrency').val()
      let outputCurrency = $('#outputCurrency').val()
      let balance = await getAccountBalance(inputCurrency, accounts[0])

      // estimate gas and substrat from input amount
      let estimatedGas = await estimateGasPrice(
        accounts[0],
        balance,
        inputCurrency,
        outputCurrency
      )
      let availableAmount
      if (inputCurrency === 'ETH') availableAmount = balance - estimatedGas
      // in ETH unit
      else availableAmount = balance

      let inputValue = $('#inputValue').val(availableAmount)
      updateInputOutput('input')
    })

    $('#approve-btn').on('click', async e => {
      e.preventDefault()
      const accounts = await web3.eth.getAccounts()
      const inputCurrency = $('#inputCurrency').val()
      const approvedAmount = $('#approvalModal input[type=text]').val()
      const minimumAmount = $('#approvalModal label span').attr('minimumAmount')
      if (approvedAmount < minimumAmount) {
        alert('Approve amount cannot be less than minimum amount')
        $('#approvalModal input[type=text]').val(minimumAmount)
        return
      }
      $('#approvalModal').modal('hide')
      renderSwapModal('buy')
      await unlockToken(inputCurrency, accounts[0], approvedAmount)
    })

    $('#sell-btn, #buy-btn').on('click', async e => {
      e.stopPropagation()
      let isUserLoggedIn = await isLoggedIn()
      if (!isUserLoggedIn) {
        $('#noAccountModal').modal('show')
      } else {
        let action = $(e.target).attr('data-action')
        console.log(action)
        renderSwapModal(action)
      }
    })

    $('.pay-group .dropdown-menu .dropdown-item').on('click', async function (
      e
    ) {
      e.preventDefault()
      const selectedToken = this.getAttribute('token-name')
      $('#inputCurrency').val(selectedToken)
      $('#input-select-btn').text(selectedToken)
      updateInputOutput('input')
    })

    $('.receive-group .dropdown-menu .dropdown-item').on('click', function (e) {
      e.preventDefault()
      const selectedToken = this.getAttribute('token-name')
      $('#outputCurrency').val(selectedToken)
      $('#output-select-btn').text(selectedToken)
      updateInputOutput('input')
    })

    $('#inputValue').on('change keydown paste input', () => {
      updateInputOutput('input')
    })

    $('#outputValue').on('change keydown paste input', () => {
      updateInputOutput('output')
    })
  }

  async function isLoggedIn () {
    let accounts
    try {
      accounts = await web3.eth.getAccounts()
    } catch (e) {
      console.log(e)
      console.log('Cannot get wallet account. Please log in')
      return false
    }
    if (accounts && accounts.length > 0) return true
    else return false
  }

  function renderSwapModal (action = 'buy') {
    $('#swapModal').modal('show')
    let modal = $('#swapModal')
    if (action === 'buy') { modal.find('.modal-title').text('Buy ULT using ETH or ERC20 Tokens') } else if (action === 'sell') { modal.find('.modal-title').text('Sell ULT to receive ETH or ERC20 Tokens') }
    modal.find('.modal-body input').val('')
    if (action === 'buy') {
      $('.pay-group .dropdown-toggle').attr('disabled', false)
      $('.receive-group .dropdown-toggle').attr('disabled', true)
      $('#inputCurrency').val('ETH')
      $('#outputCurrency').val(mainToken.symbol)
      $('#input-select-btn').text('ETH')
      $('#output-select-btn').text(mainToken.symbol)
      $('#convert-btn').text('BUY')
    } else if (action === 'sell') {
      $('.pay-group .dropdown-toggle').attr('disabled', true)
      $('.receive-group .dropdown-toggle').attr('disabled', false)
      $('#inputCurrency').val(mainToken.symbol)
      $('#outputCurrency').val('ETH')
      $('#input-select-btn').text(mainToken.symbol)
      $('#output-select-btn').text('ETH')
      $('#convert-btn').text('SELL')
    }
    $('.alert').hide()
  }

  // function list
  function getSwapType (inputCurrency, outputCurrency) {
    if (inputCurrency !== 'ETH' && outputCurrency === 'ETH') { return 'TOKEN_TO_ETH' } else if (inputCurrency === 'ETH' && outputCurrency !== 'ETH') { return 'ETH_TO_TOKEN' } else if (inputCurrency !== 'ETH' && outputCurrency !== 'ETH') { return 'TOKEN_TO_TOKEN' }
  }

  async function swap (data) {
    let { inputValue, inputCurrency, outputValue, outputCurrency } = data
    let type = getSwapType(inputCurrency, outputCurrency)

    const blockNumber = await web3.eth.getBlockNumber()
    const block = await web3.eth.getBlock(blockNumber)
    const deadline = block.timestamp + 300
    const accounts = await web3.eth.getAccounts()
    let exchangeContract
    if (type === 'ETH_TO_TOKEN') {
      exchangeContract = exchangeContracts[outputCurrency]
      const max_tokens = new BigNumber(100000).toFixed(0)
      const amount = new BigNumber(inputValue).multipliedBy(10 ** 18).toFixed(0)

      exchangeContract.methods
        .ethToTokenSwapInput(max_tokens, deadline)
        .send({ from: accounts[0], value: amount }, (err, data) => {
          if (err) console.log(err)
          else {
            console.log(`TxId is ${JSON.stringify(data)}`)
            const txUrl = `https://etherscan.io/tx/${data}`
            $('.alert').hide()
            $('#swapModal').modal('hide')
            $('#submittedModal').modal('show')
            $('#txUrl').attr('href', txUrl)
            postTxHashToServer(data)
          }
        })
    } else if (type === 'TOKEN_TO_ETH') {
      exchangeContract = exchangeContracts[inputCurrency]
      const tokenSold = new BigNumber(inputValue)
        .multipliedBy(10 ** 18)
        .toFixed(0)
      const minEth = new BigNumber(2).toFixed(0)

      exchangeContract.methods
        .tokenToEthSwapInput(tokenSold, minEth, deadline)
        .send({ from: accounts[0] }, (err, data) => {
          if (err) {
            alert('Transaction is not submitted')
            $('#convert-btn').attr('disabled', false)
            $('.alert').hide()
          } else {
            console.log(`TxId is ${JSON.stringify(data)}`)
            const txUrl = `https://etherscan.io/tx/${data}`
            $('.alert').hide()
            $('#swapModal').modal('hide')
            $('#submittedModal').modal('show')
            $('#txUrl').attr('href', txUrl)
            postTxHashToServer(data)
          }
        })
    } else if (type === 'TOKEN_TO_TOKEN') {
      exchangeContract = exchangeContracts[inputCurrency]
      const tokenSold = new BigNumber(inputValue)
        .multipliedBy(10 ** 18)
        .toFixed(0)
      const minToken = new BigNumber(outputValue)
        .multipliedBy(10 ** 18)
        .multipliedBy(1 - ALLOWED_SLIPPAGE)
        .toFixed(0)
      const minEth = new BigNumber(1).toFixed(0)
      const outputTokenAddress = tokenAddressess[outputCurrency]

      exchangeContract.methods
        .tokenToTokenSwapInput(
          tokenSold,
          minToken,
          minEth,
          deadline,
          outputTokenAddress
        )
        .send({ from: accounts[0] }, (err, data) => {
          if (err) console.log(err)
          else {
            console.log(`TxId is ${JSON.stringify(data)}`)
            const txUrl = `https://etherscan.io/tx/${data}`
            $('.alert').hide()
            $('#swapModal').modal('hide')
            $('#submittedModal').modal('show')
            $('#txUrl').attr('href', txUrl)
            postTxHashToServer(data)
          }
        })
    }
  }

  async function postTxHashToServer (txHash) {
    console.log(`txHash is ${txHash}`)
    const receiptUrl = `${config.chartServerUrl}/uniswap/receipt`
    const response = await axios.post(receiptUrl, { txHash })
    console.log(response)
  }

  async function unlockToken (currency, account, approvedAmount) {
    $('.alert').hide()
    $('.alert-wait').show()
    const inputCurrency = currency
    const amount = new BigNumber(approvedAmount)
      .multipliedBy(10 ** 18)
      .toFixed(0)

    const tokenAddress = tokenAddressess[currency]
    const exchangeAddress = exchangeAddresses[currency]
    const contract = new web3.eth.Contract(ERC20_ABI, tokenAddress)
    try {
      await contract.methods
        .approve(exchangeAddress, amount)
        .send({ from: account })
    } catch (e) {
      alert('Approval Transaction is not submitted. Please try again.')
      $('#convert-btn').attr('disabled', false)
      $('.alert').hide()
      return
    }

    // check the allowance
    const check = setInterval(async () => {
      const allowance = await getAllowance(inputCurrency, approvedAmount)
      const input = approvedAmount * Math.pow(10, 18)
      if (allowance >= input) {
        clearInterval(check)
        hideUnlockButton()
        $('.alert').hide()
        $('.alert-wait').hide()
        $('.alert-approved').show()
        $('#swapModal').modal('hide')
        alert(
          `Your approval to spend ${approvedAmount} ${inputCurrency} is successfully confirmed ! You can submit transaction now.`
        )
      }
    }, 1000)
  }

  async function getAccountBalance (currency, address) {
    let balance
    if (currency === 'ETH') {
      balance = await web3.eth.getBalance(address)
    } else {
      balance = await tokenContracts[currency].methods.balanceOf(address).call()
    }
    return new BigNumber(balance).dividedBy(10 ** 18).toFixed(18)
  }

  function getULTToUSDPrice () {
    return new Promise((resolve, reject) => {
      $.get(`${config.chartServerUrl}/histohour?limit=1`, function (data) {
        if (data.transactions && data.transactions.length > 0) {
          resolve(data.transactions[0].close)
        }
      })
    })
  }

  function getULTToETHPrice () {
    return new Promise((resolve, reject) => {
      $.get(`${config.chartServerUrl}/histohour`, function (data) {
        if (data.transactions && data.transactions.length > 0) {
          let lastTx
          for (let i = data.transactions.length - 1; i >= 0; i--) {
            if (data.transactions[i].amount_eth > 0) {
              lastTx = data.transactions[i]
              break
            }
          }
          // console.log(lastTx)
          let { amount_eth, amount_ult } = lastTx
          let price = amount_eth / amount_ult
          resolve(price)
        }
      })
    })
  }

  async function getChartPrices (type) {
    if (type === 'ULT-USD') {
      let unitPrice = await getULTToUSDPrice()
      // console.log(`ULT - USD price is ${unitPrice}`)
      return unitPrice
    }
    if (type === 'ULT-ETH') {
      let unitPrice = await getULTToETHPrice()
      // console.log(`ULT - ETH price is ${unitPrice}`)
      return unitPrice
    }
  }

  async function calcuateInputOutput (
    inputCurrency,
    outputCurrency,
    inputType,
    value
  ) {
    const swapType = getSwapType(inputCurrency, outputCurrency)

    if (swapType === 'ETH_TO_TOKEN') {
      let tokenExchangeAddress = exchangeAddresses[outputCurrency]
      let tokenContract = tokenContracts[outputCurrency]
      if (inputType === 'EXACT_INPUT') {
        let inputAmount = new BigNumber(value).multipliedBy(10 ** 18)
        let inputReserve = await web3.eth.getBalance(tokenExchangeAddress)
        let outputReserve = await tokenContract.methods
          .balanceOf(tokenExchangeAddress)
          .call()

        inputReserve = new BigNumber(inputReserve)
        outputReserve = new BigNumber(outputReserve)
        /*
                numerator = inputAmount * outputReserve * 997
                denominator = inputReserve * 1000 + inputAmount * 997
                outputAmount = numerator / denominator
                */
        let numerator = inputAmount
          .multipliedBy(outputReserve)
          .multipliedBy(997)
        let denominator = inputReserve
          .multipliedBy(1000)
          .plus(inputAmount.multipliedBy(997))
        const outputAmount = numerator
          .dividedBy(denominator)
          .dividedBy(10 ** 18)
        return outputAmount
      } else if (inputType === 'EXACT_OUTPUT') {
        let outputAmount = new BigNumber(value).multipliedBy(10 ** 18)
        let inputReserve = await web3.eth.getBalance(tokenExchangeAddress)
        let outputReserve = await tokenContract.methods
          .balanceOf(tokenExchangeAddress)
          .call()

        inputReserve = new BigNumber(inputReserve)
        outputReserve = new BigNumber(outputReserve)
        /*
                numerator = outputAmount * inputReserve * 1000
                denominator = (outputReserve - outputAmount) * 997
                inputAmount = numerator / (denominator + 1)
                */
        let numerator = outputAmount
          .multipliedBy(inputReserve)
          .multipliedBy(1000)
        let denominator = outputReserve.minus(outputAmount).multipliedBy(997)
        let inputAmount = numerator
          .dividedBy(denominator.plus(1))
          .dividedBy(10 ** 18)
        return inputAmount
      }
    } else if (swapType === 'TOKEN_TO_ETH') {
      let tokenExchangeAddress = exchangeAddresses[inputCurrency]
      let tokenContract = tokenContracts[inputCurrency]
      if (inputType === 'EXACT_INPUT') {
        let inputAmount = new BigNumber(value).multipliedBy(10 ** 18)
        let inputReserve = await tokenContract.methods
          .balanceOf(tokenExchangeAddress)
          .call()
        let outputReserve = await web3.eth.getBalance(tokenExchangeAddress)

        inputReserve = new BigNumber(inputReserve)
        outputReserve = new BigNumber(outputReserve)
        /*
                numerator = inputAmount * outputReserve * 997
                denominator = inputReserve * 1000 + inputAmount * 997
                outputAmount = numerator / denominator
                */
        let numerator = inputAmount
          .multipliedBy(outputReserve)
          .multipliedBy(997)
        let denominator = inputReserve
          .multipliedBy(1000)
          .plus(inputAmount.multipliedBy(997))
        let outputAmount = numerator.dividedBy(denominator).dividedBy(10 ** 18)
        return outputAmount
      } else if (inputType === 'EXACT_OUTPUT') {
        let outputAmount = new BigNumber(value).multipliedBy(10 ** 18)
        let inputReserve = await tokenContract.methods
          .balanceOf(tokenExchangeAddress)
          .call()
        let outputReserve = await web3.eth.getBalance(tokenExchangeAddress)

        inputReserve = new BigNumber(inputReserve)
        outputReserve = new BigNumber(outputReserve)
        /*
                numerator = outputAmount * inputReserve * 1000
                denominator = (outputReserve - outputAmount) * 997
                inputAmount = numerator / (denominator + 1)
                */
        let numerator = outputAmount
          .multipliedBy(inputReserve)
          .multipliedBy(1000)
        let denominator = outputReserve.minus(outputAmount).multipliedBy(997)
        let inputAmount = numerator
          .dividedBy(denominator.plus(1))
          .dividedBy(10 ** 18)
        return inputAmount
      }
    } else if (swapType === 'TOKEN_TO_TOKEN') {
      console.log(inputCurrency, outputCurrency, inputType)
      let tokenContractA = tokenContracts[inputCurrency]
      let exchangeAddressA = exchangeAddresses[inputCurrency]
      let tokenContractB = tokenContracts[outputCurrency]
      let exchangeAddressB = exchangeAddresses[outputCurrency]
      if (inputType === 'EXACT_INPUT') {
        let inputAmountA = new BigNumber(value).multipliedBy(10 ** 18)
        // TokenA (ERC20) to ETH conversion
        let inputReserveA = await tokenContractA.methods
          .balanceOf(exchangeAddressA)
          .call()
        let outputReserveA = await web3.eth.getBalance(exchangeAddressA)
        inputReserveA = new BigNumber(inputReserveA)
        outputReserveA = new BigNumber(outputReserveA)

        // let numeratorA = inputAmountA * outputReserveA * 997
        // let denominatorA = inputReserveA * 1000 + inputAmountA * 997
        // let outputAmountA = numeratorA / denominatorA
        let numeratorA = inputAmountA
          .multipliedBy(outputReserveA)
          .multipliedBy(997)
        let denominatorA = inputReserveA
          .multipliedBy(1000)
          .plus(inputAmountA * 997)
        let outputAmountA = numeratorA.dividedBy(denominatorA)

        // ETH to TokenB conversion
        let inputAmountB = outputAmountA
        let inputReserveB = await web3.eth.getBalance(exchangeAddressB)
        let outputReserveB = await tokenContractB.methods
          .balanceOf(exchangeAddressB)
          .call()
        inputReserveB = new BigNumber(inputReserveB)
        outputReserveB = new BigNumber(outputReserveB)

        // let numeratorB = inputAmountB * outputReserveB * 997
        // let denominatorB = inputReserveB * 1000 + inputAmountB * 997
        // let outputAmountB = numeratorB / denominatorB
        let numeratorB = inputAmountB
          .multipliedBy(outputReserveB)
          .multipliedBy(997)
        let denominatorB = inputReserveB
          .multipliedBy(1000)
          .plus(inputAmountB.multipliedBy(997))
        let outputAmountB = numeratorB
          .dividedBy(denominatorB)
          .dividedBy(10 ** 18)
        return outputAmountB
      } else if (inputType === 'EXACT_OUTPUT') {
        // Buy TokenB with ETH
        let outputAmountB = new BigNumber(value).multipliedBy(10 ** 18)
        let inputReserveB = await web3.eth.getBalance(exchangeAddressB)
        let outputReserveB = await tokenContractB.methods
          .balanceOf(exchangeAddressB)
          .call()
        inputReserveB = new BigNumber(inputReserveB)
        outputReserveB = new BigNumber(outputReserveB)

        // let numeratorB = outputAmountB * inputReserveB * 1000
        // let denominatorB = (outputReserveB - outputAmountB) * 997
        // let inputAmountB = numeratorB / (denominatorB + 1)
        let numeratorB = outputAmountB
          .multipliedBy(inputReserveB)
          .multipliedBy(1000)
        let denominatorB = outputReserveB.minus(outputAmountB).multipliedBy(997)
        let inputAmountB = numeratorB.dividedBy(denominatorB.plus(1))
        // Buy ETH with TokenA
        let outputAmountA = inputAmountB
        let inputReserveA = await tokenContractA.methods
          .balanceOf(exchangeAddressA)
          .call()
        let outputReserveA = await web3.eth.getBalance(exchangeAddressA)
        inputReserveA = new BigNumber(inputReserveA)
        outputReserveA = new BigNumber(outputReserveA)

        // let numeratorA = outputAmountA * inputReserveA * 1000
        // let denominatorA = (outputReserveA - outputAmountA) * 997
        // let inputAmountA = numeratorA / (denominatorA + 1)
        let numeratorA = outputAmountA
          .multipliedBy(inputReserveA)
          .multipliedBy(1000)
        let denominatorA = outputReserveA.minus(outputAmountA).multipliedBy(997)
        let inputAmountA = numeratorA
          .dividedBy(denominatorA.plus(1))
          .dividedBy(10 ** 18)
        return inputAmountA
      }
    }
  }

  function drawUI (config) {
    let selectHTML = `<a class="dropdown-item" token-name="ETH" href="#">ETH</a>`
    for (let i = 0; i < tokenSymbols.length; i += 1) {
      selectHTML += `<a class="dropdown-item" token-name="${
        tokenSymbols[i]
      }" href="#">${tokenSymbols[i]}</a>`
    }
    $('#uniswap-form .dropdown-menu').html(selectHTML)
    setTimeout(() => {
      updateULTPrice(mainToken.symbol)
      setInterval(() => {
        updateULTPrice(mainToken.symbol)
      }, 60000)
    }, 3000)
  }
  async function calculateULTPrice (inputCurrency, outptCurrency, inputValue) {
    let price = await calcuateInputOutput(
      inputCurrency,
      outptCurrency,
      'EXACT_INPUT',
      inputValue
    )
    return price
  }
  async function updateULTPrice (inputCurrency) {
    let price_ult_usd = await getChartPrices('ULT-USD')
    let price_ult_eth = await getChartPrices('ULT-ETH')
    $('#ULT-price-dai').html(`<strong>${price_ult_usd.toFixed(6)}</strong> $`)
    $('#ULT-price-eth').html(`<strong>${price_ult_eth.toFixed(6)}</strong> ETH`)
    let inputValue = $('#inputValue').val()
    let outputValue = $('#outputValue').val()
    if (inputValue === '' && outputValue === '') {
      $('#exchange-info .dai-rate').html(
        `1 ULT = ${price_ult_usd.toFixed(6)} DAI`
      )
      $('#exchange-info .eth-rate').html(
        `1 ULT = ${price_ult_eth.toFixed(6)} ETH`
      )
      console.log('ULT-DAI price is updated')
    }
  }

  async function renderUnlockButton (inputCurrency, inputValue) {
    if (inputCurrency === 'ETH' || !inputValue || inputValue == 0) { hideUnlockButton() } else {
      const allowance = await getAllowance(inputCurrency, inputValue)
      const input = inputValue * Math.pow(10, 18)
      if (input > allowance) displayUnlockButton()
      else hideUnlockButton()
    }
  }

  async function getAllowance (inputCurrency, inputValue) {
    try {
      let exchangeAddress = exchangeAddresses[inputCurrency]
      let tokenAddress = tokenAddressess[inputCurrency]
      const contract = new web3.eth.Contract(ERC20_ABI, tokenAddress)
      const accounts = await web3.eth.getAccounts()
      let allowance = await contract.methods
        .allowance(accounts[0], exchangeAddress)
        .call()
      return allowance
    } catch (e) {
      console.log(e)
      console.log('Cannot get token allowance value !')
    }
  }

  function displayUnlockButton () {
    $('#convert-btn').attr('disabled', true)
    $('.alert').hide()
    $('.alert-unlock').show()
    $('#unlock-token-btn').css('display', 'inline-block')
  }

  function hideUnlockButton () {
    $('#unlock-token-btn').css('display', 'none')
    $('#convert-btn').attr('disabled', false)
    $('.alert').hide()
  }

  function checkSlippage (slippage, inputCurrency, inputValue) {
    if (slippage >= 10) {
      $('#convert-btn').attr('disabled', true)
      $('.alert').hide()
      $('.alert-high-slippage').show()
    } else {
      let isDisabled = $('#convert-btn').attr('disabled')
      $('#convert-btn').attr('disabled', false)
      $('.alert-high-slippage').hide()
      renderUnlockButton(inputCurrency, inputValue)
    }
  }

  async function updateInputOutput (lastChangedField) {
    const inputCurrency = $('#inputCurrency').val()
    const outputCurrency = $('#outputCurrency').val()
    let inputValue
    let outputValue
    if (lastChangedField === 'input') {
      inputValue = $('#inputValue').val()
      if (!$.isNumeric(inputValue) || inputValue <= 0) {
        $('#outputValue').val('')
        return
      }
      outputValue = await calcuateInputOutput(
        inputCurrency,
        outputCurrency,
        'EXACT_INPUT',
        inputValue
      )
      if (outputValue > 0) {
        $('#outputValue').val(outputValue.toFixed(7))
        updateExchangeRate(
          inputCurrency,
          outputCurrency,
          inputValue,
          outputValue
        )
      } else $('#outputValue').val('')
    } else if (lastChangedField === 'output') {
      outputValue = $('#outputValue').val()
      if (!$.isNumeric(outputValue) || outputValue <= 0) {
        $('#inputValue').val('')
        return
      }
      inputValue = await calcuateInputOutput(
        inputCurrency,
        outputCurrency,
        'EXACT_OUTPUT',
        outputValue
      )
      if (inputValue > 0) {
        $('#inputValue').val(inputValue.toFixed(7))
        updateExchangeRate(
          inputCurrency,
          outputCurrency,
          inputValue,
          outputValue
        )
      } else $('#inputValue').val('')
    }
    renderUnlockButton(inputCurrency, inputValue)
  }

  async function updateExchangeRate (
    inputCurrency,
    outputCurrency,
    inputValue,
    outputValue
  ) {
    if (inputCurrency === mainToken.symbol) {
      if (outputCurrency !== 'ETH') {
        let tokenExchangeAddressA = exchangeAddresses[inputCurrency]
        let tokenContractA = tokenContracts[inputCurrency]
        let ethReserveA = await web3.eth.getBalance(tokenExchangeAddressA)
        let tokenRserveA = await tokenContractA.methods
          .balanceOf(tokenExchangeAddressA)
          .call()
        ethReserveA = new BigNumber(ethReserveA)
        tokenRserveA = new BigNumber(tokenRserveA)
        let absPriceA = tokenRserveA.dividedBy(ethReserveA)

        let tokenExchangeAddressB = exchangeAddresses[outputCurrency]
        let tokenContractB = tokenContracts[outputCurrency]
        let ethReserveB = await web3.eth.getBalance(tokenExchangeAddressB)
        let tokenReserveB = await tokenContractB.methods
          .balanceOf(tokenExchangeAddressB)
          .call()
        ethReserveB = new BigNumber(ethReserveB)
        tokenReserveB = new BigNumber(tokenReserveB)
        let absPriceB = tokenReserveB.dividedBy(ethReserveB)

        let absPrice = absPriceB.dividedBy(absPriceA)
        absPrice = absPrice.toFixed(8)

        let exchangeRate = outputValue / inputValue
        let slippage = (100 * Math.abs(absPrice - exchangeRate)) / absPrice

        $('#exchange-info .dai-rate').html(
          `1 ULT = ${exchangeRate.toFixed(6)} ${outputCurrency}`
        )
        $('#slippage').html(`${slippage.toFixed(2)} %`)
        checkSlippage(slippage, inputCurrency, inputValue)

        calculateULTPrice(mainToken.symbol, 'ETH', inputValue).then(output => {
          let exchangeRate = output / inputValue
          $('#exchange-info .eth-rate').html(
            `1 ULT = ${exchangeRate.toFixed(6)} ETH`
          )
        })
      } else if (outputCurrency === 'ETH') {
        let tokenExchangeAddress = exchangeAddresses[inputCurrency]
        let tokenContract = tokenContracts[inputCurrency]
        let ethReserve = await web3.eth.getBalance(tokenExchangeAddress)
        let tokenRserve = await tokenContract.methods
          .balanceOf(tokenExchangeAddress)
          .call()
        ethReserve = new BigNumber(ethReserve)
        tokenRserve = new BigNumber(tokenRserve)

        let absPrice = ethReserve.dividedBy(tokenRserve)
        absPrice = absPrice.toFixed(8)

        // let absPrice = await getULTToETHPrice()
        let exchangeRate = outputValue / inputValue
        let slippage = (100 * Math.abs(absPrice - exchangeRate)) / absPrice
        $('#exchange-info .eth-rate').html(
          `1 ULT = ${exchangeRate.toFixed(6)} ${outputCurrency}`
        )
        $('#slippage').html(`${slippage.toFixed(2)} %`)
        checkSlippage(slippage, inputCurrency, inputValue)

        calculateULTPrice(mainToken.symbol, 'DAI', inputValue).then(output => {
          let exchangeRate = output / inputValue
          $('#exchange-info .dai-rate').html(
            `1 ULT = ${exchangeRate.toFixed(6)} DAI`
          )
        })
      }
    } else if (outputCurrency === mainToken.symbol) {
      if (inputCurrency !== 'ETH') {
        let tokenExchangeAddressA = exchangeAddresses[inputCurrency]
        let tokenContractA = tokenContracts[inputCurrency]
        let ethReserveA = await web3.eth.getBalance(tokenExchangeAddressA)
        let tokenRserveA = await tokenContractA.methods
          .balanceOf(tokenExchangeAddressA)
          .call()
        ethReserveA = new BigNumber(ethReserveA)
        tokenRserveA = new BigNumber(tokenRserveA)
        let absPriceA = tokenRserveA.dividedBy(ethReserveA)

        let tokenExchangeAddressB = exchangeAddresses[outputCurrency]
        let tokenContractB = tokenContracts[outputCurrency]
        let ethReserveB = await web3.eth.getBalance(tokenExchangeAddressB)
        let tokenReserveB = await tokenContractB.methods
          .balanceOf(tokenExchangeAddressB)
          .call()
        ethReserveB = new BigNumber(ethReserveB)
        tokenReserveB = new BigNumber(tokenReserveB)
        let absPriceB = tokenReserveB.dividedBy(ethReserveB)

        let absPrice = absPriceB.dividedBy(absPriceA)
        absPrice = absPrice.toFixed(8)

        let exchangeRate = outputValue / inputValue
        let slippage = (100 * Math.abs(absPrice - exchangeRate)) / absPrice

        $('#exchange-info .dai-rate').html(
          `1 ${inputCurrency} = ${exchangeRate.toFixed(6)} ${mainToken.symbol}`
        )
        $('#slippage').html(`${slippage.toFixed(2)} %`)
        checkSlippage(slippage, inputCurrency, inputValue)

        calculateULTPrice('ETH', mainToken.symbol, inputValue).then(
          ethOutput => {
            let exchangeRate = ethOutput / inputValue
            $('#exchange-info .eth-rate').html(
              `1 ETH = ${exchangeRate.toFixed(6)} ${mainToken.symbol}`
            )
          }
        )
      } else if (inputCurrency === 'ETH') {
        let tokenExchangeAddress = exchangeAddresses[outputCurrency]
        let tokenContract = tokenContracts[outputCurrency]
        let ethReserve = await web3.eth.getBalance(tokenExchangeAddress)
        let tokenRserve = await tokenContract.methods
          .balanceOf(tokenExchangeAddress)
          .call()
        ethReserve = new BigNumber(ethReserve)
        tokenRserve = new BigNumber(tokenRserve)
        let absPrice = tokenRserve.dividedBy(ethReserve)
        absPrice = absPrice.toFixed(8)

        // let absPrice = await getULTToETHPrice()
        // absPrice = 1 / absPrice
        let exchangeRate = outputValue / inputValue
        let slippage = (100 * Math.abs(absPrice - exchangeRate)) / absPrice
        $('#exchange-info .eth-rate').html(
          `1 ${inputCurrency} = ${exchangeRate.toFixed(6)} ${mainToken.symbol}`
        )
        $('#slippage').html(`${slippage.toFixed(2)} %`)
        checkSlippage(slippage, inputCurrency, inputValue)

        calculateULTPrice('DAI', mainToken.symbol, inputValue).then(
          daiOutput => {
            let exchangeRate = daiOutput / inputValue
            $('#exchange-info .dai-rate').html(
              `1 DAI = ${exchangeRate.toFixed(6)} ${mainToken.symbol}`
            )
          }
        )
      }
    }
  }
}
