import Web3 from 'web3'
import axios from 'axios'
import { exchangeABI, tokenABI, ERC20_ABI, factoryABI } from './abi'
import { factoryAddress } from './token'
import BigNumber from 'bignumber.js'
import CONFIG from '../../config.js'

let exchangeAddresses = {}
let tokenAddresses = {}
let tokenSymbols

let exchangeContracts = {}
let tokenContracts = {}
let factoryContract

export const initContracts = async function (web3, availableTokens) {
  tokenSymbols = availableTokens.map(token => token.symbol)
  factoryContract = new web3.eth.Contract(factoryABI, factoryAddress)

  availableTokens.forEach(token => {
    tokenAddresses[token.symbol] = token.tokenAddress
    exchangeAddresses[token.symbol] = token.exchangeAddress
  })
  for (let i = 0; i < tokenSymbols.length; i += 1) {
    exchangeContracts[tokenSymbols[i]] = new web3.eth.Contract(
      exchangeABI,
      exchangeAddresses[tokenSymbols[i]]
    )
  }
  for (let i = 0; i < tokenSymbols.length; i += 1) {
    const contract = exchangeContracts[tokenSymbols[i]]
    tokenContracts[tokenSymbols[i]] = new web3.eth.Contract(
      tokenABI,
      tokenAddresses[tokenSymbols[i]]
    )
  }
}
export const getWeb3 = function () {
  return new Promise(function (resolve, reject) {
    try {
      let web3 = new Web3(
        'wss://mainnet.infura.io/ws/v3/6f70582e339948738835c25da4b9b8a5'
        // 'wss://mainnet.infura.io/ws'
      )
      resolve(web3)
    } catch (e) {
      console.log(e)
      reject('Cannot get web3 instance')
    }
  })
}
export const getWeb3Metamask = function () {
  return new Promise(function (resolve, reject) {
    try {
      // let web3 = new Web3(Web3.givenProvider || "wss://mainnet.infura.io/ws");
      let web3 = new Web3(Web3.givenProvider);
      resolve(web3)
    } catch (e) {
      console.log(e)
      console.log('Cannot get web3 instance for metamask')
      reject('Cannot get web3 instance for metamask')
    }
  })
}

export const getExchangeAddress = async function (tokenAddress) {
  try {
    let exchangeAddress = await factoryContract.methods
      .getExchange(tokenAddress)
      .call()
    console.log(exchangeAddress)
    // 0x0000000000000000000000000000000000000000
    if (exchangeAddress) return exchangeAddress
    else return false
  } catch (e) {
    console.log(`ERROR: cannot get exchange for token address: ${tokenAddress}`)
    console.log(e)
    return false
  }
}

export const getULTToUSDPrice = async () => {
  try {
    let response = await axios.get(`${CONFIG.chartServerUrl}/histohour?limit=1`)
    if (response.data.transactions && response.data.transactions.length > 0) {
      return response.data.transactions[0].close
    } else return 0
  } catch (e) {
    console.log(`ERROR - getULToUSDPrice`)
    console.log(e)
  }
}

export const getETHToUSDPrice = async () => {
  try {
    let response = await axios.get(`${CONFIG.chartServerUrl}/histohour?limit=1`)
    if (response.data.transactions && response.data.transactions.length > 0) {
      let ethUsdPrice = response.data.transactions[0].price_eth_usd
      return ethUsdPrice
    }
  } catch (e) {
    console.log(`ERROR - getETHToUSDPrice`)
    console.log(e)
    return 0
  }
}

export const getEthAndUltPrice = async () => {
  let response = await axios.get(`${CONFIG.chartServerUrl}/histohour?limit=1`)
  if (response.data.transactions && response.data.transactions.length > 0) {
    let ethUsdPrice = response.data.transactions[0].price_eth_usd
    let ultUsdPrice = response.data.transactions[0].close
    return { ethUsdPrice, ultUsdPrice }
  }
}
export const getTokenToUSDPrice = async (symbol) => {
  try {
    let response = await axios.get(
      `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD,JPY,EUR`
    )
    return response.data.USD
  } catch (e) {
    console.log(`ERROR - getTokenToUSDPrice`)
    console.log(e)
  }
}

export const getHistory = async function (address) {
  if (!address) return
  try {
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=asc&apikey=YourApiKeyToken`
    let response = await axios.get(url)
    return response.data.result
  } catch (e) {
    console.log(`ERROR - getHistory`)
    console.log(e)
    return
  }
}
export const getTokenHistory = async function (address) {
  if (!address) return
  try {
    const url = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&tag=latest`
    let response = await axios.get(url)
    return response.data.result
  } catch (e) {
    console.log(`ERROR - getTokenHistory`)
    console.log(e)
    return
  }
}
export const getBalance = async function (address, web3) {
  if (!address) return
  try {
    let balance = await web3.eth.getBalance(address)
    return parseInt(balance)
  } catch (e) {
    console.log(`ERROR - getBalance`)
    console.log(e)
    return
  }
}
export const getTokenBalance = async function (address, currency, web3) {
  if (!address) return
  if (!tokenContracts[currency]) {
    console.log(`Cannot find token contrat for ${currency}. Creating now...`)
    await initContracts(web3)
  }
  try {
    let tokenBalance = await tokenContracts[currency].methods
      .balanceOf(address)
      .call()
    return parseInt(tokenBalance)

    // GET TOKEN BALANCE FROM ETHERSCAN API INSTEAD OF USING WEB3
    // let tokenAddress = tokenAddresses[currency]
    // const url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${tokenAddress}&address=${address}&tag=latest&apikey=Y1C96ES3CDKANT866DQMTJTMF2G52FBBN9`
    // let response = await axios.get(url)
    // if (response.data.status === "1") {
    //   return parseInt(response.data.result)
    // }
  } catch (e) {
    console.log(`ERROR - getTokenBalance`)
    console.log(e)
    return 0
  }
}
export const getAbsPrice = async function (inputCurrency, outputCurrency, web3) {
  if (!inputCurrency || !outputCurrency) return
  if (!tokenContracts[outputCurrency]) {
    console.log(`Cannot find token contrat for ${currency}. Creating now...`)
    await initContracts(web3)
  }
  try {
    let tokenExchangeAddress = exchangeAddresses[outputCurrency]
    let tokenContract = tokenContracts[outputCurrency]
    let ethReserve = await web3.eth.getBalance(tokenExchangeAddress)
    let tokenRserve = await tokenContract.methods
      .balanceOf(tokenExchangeAddress)
      .call()
    ethReserve = new BigNumber(ethReserve)
    tokenRserve = new BigNumber(tokenRserve)
    let absPrice = tokenRserve.dividedBy(ethReserve)
    return absPrice
  } catch (e) {
    console.log(`ERROR - getAbsPrice`)
    console.log(e)
    return 0
  }
}

export const estimateGas = async function (transaction, web3) {
  try {
    let gas = await web3.eth.estimateGas({
      from: transaction.from,
      to: transaction.to,
      value: transaction.value,
      data: transaction.data
    }).call()
    return gas
  } catch (e) {
    console.log(e)
    return 0
  }
}
export const estimateGasPrice = async function (web3) {
  let gasPrice = await web3.eth.getGasPrice()
  return gasPrice
}
export const signAndSendETH = async function (transaction, privateKey, web3) {
  console.log(transaction)
  let signedTx = await web3.eth.accounts.signTransaction(
    {
      from: transaction.from,
      gasPrice: transaction.gasPrice,
      gasLimit: transaction.gasLimit,
      to: transaction.to,
      value: transaction.amount
    },
    privateKey
  )
  return new Promise(resolve => {
    web3.eth
      .sendSignedTransaction(signedTx.rawTransaction)
      .on('transactionHash', function (hash) {
        console.log('Tx hash: ', hash)
        resolve(hash)
      })
  })
}

export const createNewExchange = async function (
  tx,
  tokenAddress,
  privateKey
) {

  console.log(tx)
  let web3 = await getWeb3()
  let myAddress = tx.from
  let count = await web3.eth.getTransactionCount(myAddress)
  let gasPrice = await estimateGasPrice(web3)
  let transactionParameters = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPrice),
    to: factoryAddress,
    value: '0x0',
    data: factoryContract.methods.createExchange(tokenAddress).encodeABI(),
    nonce: web3.utils.toHex(count)
  }

  let estimatedGas = await estimateGas(transactionParameters)

  if (!estimatedGas || estimatedGas <= 0) {
    transactionParameters.gasLimit = web3.utils.toHex(500590)
  } else {
    transactionParameters.gasLimit = web3.utils.toHex(estimatedGas)
  }

  console.log(`Estimate gas: ${estimatedGas}`);
  console.log(`Estimate gas price: ${gasPrice}`);
  console.log(transactionParameters)

  let transaction = await web3.eth.accounts.signTransaction(
    transactionParameters,
    privateKey
  )
  return new Promise(resolve => {
    web3.eth
      .sendSignedTransaction(transaction.rawTransaction)
      .on('transactionHash', function (hash) {
        console.log('Tx hash: ', hash)
        resolve(hash)
      })
  })
}
export const metamaskCreateNewExchange = async function (
  tx,
  tokenAddress
) {
  let web3 = await getWeb3Metamask()
  let myAddress = tx.from
  try {
    let count = await web3.eth.getTransactionCount(myAddress)
    let factoryContract = new web3.eth.Contract(factoryABI, factoryAddress)
    let txId = await factoryContract.methods.createExchange(tokenAddress).send({ from: myAddress })
    return txId
  } catch (e) {
    console.log('Error while submitting createExchange using Metamask')
    console.log(e)
  }
}

export const sendToken = async function (tx, currency, privateKey, web3) {
  console.log(tx)
  let myAddress = tx.from
  let toAddress = tx.to
  let amount = web3.utils.toHex(tx.amount)
  let count = await web3.eth.getTransactionCount(myAddress)
  let contractAddress = tokenAddresses[currency]
  let contract = new web3.eth.Contract(tokenABI, contractAddress, {
    from: myAddress
  })
  let transaction = await web3.eth.accounts.signTransaction(
    {
      from: myAddress,
      gasPrice: web3.utils.toHex(tx.gasPrice),
      gasLimit: web3.utils.toHex(tx.gasLimit),
      to: contractAddress,
      value: '0x0',
      data: contract.methods.transfer(toAddress, amount).encodeABI(),
      nonce: web3.utils.toHex(count)
    },
    privateKey
  )
  return new Promise(resolve => {
    web3.eth
      .sendSignedTransaction(transaction.rawTransaction)
      .on('transactionHash', function (hash) {
        console.log('Tx hash: ', hash)
        resolve(hash)
      })
  })
}

export const unlockToken = async (tx, tokenSymbol, data) => {
  const web3 = data.web3
  const count = await web3.eth.getTransactionCount(tx.from)
  const amount = new BigNumber(tx.approvedAmount)
  const tokenAddress = tokenAddresses[tokenSymbol]
  const contract = new web3.eth.Contract(ERC20_ABI, tokenAddress)
  let transaction = await web3.eth.accounts.signTransaction(
    {
      from: tx.from,
      gasPrice: web3.utils.toHex(tx.gasPrice),
      gasLimit: web3.utils.toHex(tx.gasLimit),
      to: tokenAddress,
      value: '0x0',
      data: contract.methods.approve(data.exchangeAddress, amount).encodeABI(),
      nonce: web3.utils.toHex(count)
    },
    data.privateKey
  )
  return new Promise(resolve => {
    web3.eth
      .sendSignedTransaction(transaction.rawTransaction)
      .on('transactionHash', function (hash) {
        console.log('Tx hash: ', hash)
        resolve(hash)
      })
  })
}

export const swapTokenToEth = async function (
  tx,
  exchangeContract,
  contractAddress,
  privateKey,
  web3
) {
  console.log(tx)
  let myAddress = tx.from
  let count = await web3.eth.getTransactionCount(myAddress)
  let transaction = await web3.eth.accounts.signTransaction(
    {
      from: myAddress,
      gasPrice: web3.utils.toHex(tx.gasPrice),
      gasLimit: web3.utils.toHex(tx.gasLimit),
      to: contractAddress,
      value: '0x0',
      data: exchangeContract.methods
        .tokenToEthSwapInput(tx.tokenSold, tx.minEth, tx.deadline)
        .encodeABI(),
      nonce: web3.utils.toHex(count)
    },
    privateKey
  )
  return new Promise(resolve => {
    web3.eth
      .sendSignedTransaction(transaction.rawTransaction)
      .on('transactionHash', function (hash) {
        console.log('Tx hash: ', hash)
        resolve(hash)
      })
  })
}

export const swapEthToToken = async function (
  tx,
  exchangeContract,
  contractAddress,
  privateKey,
  web3
) {
  console.log(tx)
  let myAddress = tx.from
  let count = await web3.eth.getTransactionCount(myAddress)

  return new Promise(async resolve => {
    try {
      let transaction = await web3.eth.accounts.signTransaction(
        {
          from: myAddress,
          gasPrice: web3.utils.toHex(tx.gasPrice),
          gasLimit: web3.utils.toHex(tx.gasLimit),
          to: contractAddress,
          value: web3.utils.toHex(tx.ethSold),
          data: exchangeContract.methods
            .ethToTokenSwapInput(tx.minimumTokenBought, tx.deadline)
            .encodeABI(),
          nonce: web3.utils.toHex(count)
        },
        privateKey
      )
      web3.eth
        .sendSignedTransaction(transaction.rawTransaction)
        .on('error', function (error) {
          console.log(error)
          resolve(false)
        })
        .on('transactionHash', function (hash) {
          console.log('Tx hash: ', hash)
          resolve(hash)
        })
    } catch (e) {
      console.log('Error...')
    }
  })
}

export const swapTokenToToken = async function (
  tx,
  exchangeContract,
  contractAddress,
  privateKey,
  web3
) {
  let myAddress = tx.from
  let count = await web3.eth.getTransactionCount(myAddress)
  let transaction = await web3.eth.accounts.signTransaction(
    {
      from: myAddress,
      gasPrice: web3.utils.toHex(tx.gasPrice),
      gasLimit: web3.utils.toHex(tx.gasLimit),
      to: contractAddress,
      value: '0x0',
      data: exchangeContract.methods
        .tokenToTokenSwapInput(
          tx.tokenASold,
          tx.minEth,
          tx.minTokenBBought,
          tx.deadline,
          tx.outputTokenAddress
        )
        .encodeABI(),
      nonce: web3.utils.toHex(count)
    },
    privateKey
  )
  return new Promise(resolve => {
    web3.eth
      .sendSignedTransaction(transaction.rawTransaction)
      .on('transactionHash', function (hash) {
        console.log('Tx hash: ', hash)
        resolve(hash)
      })
  })
}
export const addLiquidity = async function (
  tx,
  exchangeContract,
  contractAddress,
  privateKey,
  web3
) {
  console.log({
    from: tx.from,
    gasPrice: tx.gasPrice,
    gasLimit: tx.gasLimit,
    value: tx.ethAmount.toFixed(0),
    minLiquidity: tx.minLiquidity.toFixed(0),
    maxTokens: tx.maxTokens.toFixed(0),
    deadline: tx.deadline
  })
  let myAddress = tx.from
  let count = await web3.eth.getTransactionCount(myAddress)
  let transaction = await web3.eth.accounts.signTransaction(
    {
      from: tx.from,
      gasPrice: web3.utils.toHex(tx.gasPrice),
      gasLimit: web3.utils.toHex(tx.gasLimit),
      to: contractAddress,
      value: web3.utils.toHex(tx.ethAmount.toFixed(0)),
      data: exchangeContract.methods
        .addLiquidity(
          tx.minLiquidity.toFixed(0),
          tx.maxTokens.toFixed(0),
          tx.deadline
        )
        .encodeABI(),
      nonce: web3.utils.toHex(count)
    },
    privateKey
  )
  return new Promise(resolve => {
    web3.eth
      .sendSignedTransaction(transaction.rawTransaction)
      .on('transactionHash', function (hash) {
        console.log('Tx hash: ', hash)
        resolve(hash)
      })
  })
}
export const metamaskAddLiquidity = async function (
  tx,
  exchangeContract,
  contractAddress,
  privateKey,
  web3
) {
  console.log({
    from: tx.from,
    gasPrice: tx.gasPrice,
    gasLimit: tx.gasLimit,
    value: tx.ethAmount.toFixed(0),
    minLiquidity: tx.minLiquidity.toFixed(0),
    maxTokens: tx.maxTokens.toFixed(0),
    deadline: tx.deadline
  })
  let myAddress = tx.from
  return new Promise((resolve, reject) => {
    exchangeContract.methods.addLiquidity(
      tx.minLiquidity.toFixed(0),
      tx.maxTokens.toFixed(0),
      tx.deadline)
      .send({
        from: myAddress,
        value: tx.ethAmount.toFixed(0)
      }, (err, data) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(data)
        }
      });
  })
}
export const removeLiquidity = async function (
  tx,
  exchangeContract,
  contractAddress,
  privateKey,
  web3
) {
  const ALLOWED_SLIPPAGE = 0.02
  console.log({
    from: tx.from,
    gasPrice: tx.gasPrice,
    gasLimit: tx.gasLimit,
    value: '0x0',
    amount: tx.amount.toFixed(0),
    ethWithdrawn: tx.ethWithdrawn.multipliedBy(1 - ALLOWED_SLIPPAGE).toFixed(0),
    tokenWithdrawn: tx.tokenWithdrawn.multipliedBy(1 - ALLOWED_SLIPPAGE).toFixed(0)
  })
  let myAddress = tx.from
  let count = await web3.eth.getTransactionCount(myAddress)
  let transaction = await web3.eth.accounts.signTransaction(
    {
      from: tx.from,
      gasPrice: web3.utils.toHex(tx.gasPrice),
      gasLimit: web3.utils.toHex(tx.gasLimit),
      to: contractAddress,
      value: '0x0',
      data: exchangeContract.methods
        .removeLiquidity(
          tx.amount.toFixed(0),
          tx.ethWithdrawn.multipliedBy(1 - ALLOWED_SLIPPAGE).toFixed(0),
          tx.tokenWithdrawn.multipliedBy(1 - ALLOWED_SLIPPAGE).toFixed(0),
          tx.deadline
        )
        .encodeABI(),
      nonce: web3.utils.toHex(count)
    },
    privateKey
  )
  return new Promise(resolve => {
    web3.eth
      .sendSignedTransaction(transaction.rawTransaction)
      .on('transactionHash', function (hash) {
        console.log('Tx hash: ', hash)
        resolve(hash)
      })
  })
}
export const metamaskRemoveLiquidity = async function (
  tx,
  exchangeContract,
  contractAddress,
  privateKey,
  web3
) {
  const ALLOWED_SLIPPAGE = 0.02
  console.log({
    from: tx.from,
    gasPrice: tx.gasPrice,
    gasLimit: tx.gasLimit,
    value: '0x0',
    amount: tx.amount.toFixed(0),
    ethWithdrawn: tx.ethWithdrawn.multipliedBy(1 - ALLOWED_SLIPPAGE).toFixed(0),
    tokenWithdrawn: tx.tokenWithdrawn.multipliedBy(1 - ALLOWED_SLIPPAGE).toFixed(0)
  })
  let myAddress = tx.from
  return new Promise((resolve, reject) => {
    exchangeContract.methods.removeLiquidity(
      tx.amount.toFixed(0),
      tx.ethWithdrawn.multipliedBy(1 - ALLOWED_SLIPPAGE).toFixed(0),
      tx.tokenWithdrawn.multipliedBy(1 - ALLOWED_SLIPPAGE).toFixed(0),
      tx.deadline,
    ).send({ from: myAddress }, (err, data) => {
      if (err) {
        console.log(e)
        reject(err)
      } else {
        resolve(data)
      }
    });
  })
}

export const metamaskSwap = async function (data) {
  const ALLOWED_SLIPPAGE = 0.02
  let web3Metamask = await getWeb3Metamask()
  let { inputValue, inputCurrency, outputValue, outputCurrency, type } = data
  const blockNumber = await web3Metamask.eth.getBlockNumber()
  const block = await web3Metamask.eth.getBlock(blockNumber)
  const deadline = block.timestamp + 300;
  const accounts = await web3Metamask.eth.getAccounts()
  let exchangeContract
  if (type === 'ETH_TO_TOKEN') {
    exchangeContract = new web3Metamask.eth.Contract(
      exchangeABI,
      exchangeAddresses[outputCurrency]
    )
    const min_token = new BigNumber(outputValue).multipliedBy(10 ** 18).multipliedBy(1 - ALLOWED_SLIPPAGE).toFixed(0)
    const amount = new BigNumber(inputValue).multipliedBy(10 ** 18).toFixed(0)

    return new Promise((resolve, reject) => {
      exchangeContract.methods.ethToTokenSwapInput(min_token, deadline)
        .send({ from: accounts[0], value: amount }, (err, data) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            resolve(data)
          }
        })
    })
  } else if (type === 'TOKEN_TO_ETH') {
    exchangeContract = new web3Metamask.eth.Contract(
      exchangeABI,
      exchangeAddresses[inputCurrency]
    )
    const tokenSold = new BigNumber(inputValue).multipliedBy(10 ** 18).toFixed(0)
    const minEth = new BigNumber(outputValue).multipliedBy(10 ** 18).multipliedBy(1 - ALLOWED_SLIPPAGE).toFixed(0)
    const exchangeRate = parseFloat(outputValue / inputValue)
    return new Promise((resolve, reject) => {
      exchangeContract.methods.tokenToEthSwapInput(tokenSold, minEth, deadline)
        .send({ from: accounts[0] }, (err, data) => {
          if (err) {
            console.log(`Transaction is not submitted`)
            console.log(err)
            reject(err)
          }
          else {
            resolve(data)
          }
        })
    })
  } else if (type === 'TOKEN_TO_TOKEN') {
    exchangeContract = new web3Metamask.eth.Contract(
      exchangeABI,
      exchangeAddresses[inputCurrency]
    )
    const tokenSold = new BigNumber(inputValue).multipliedBy(10 ** 18).toFixed(0)
    const minToken = new BigNumber(outputValue).multipliedBy(10 ** 18).multipliedBy(1 - ALLOWED_SLIPPAGE).toFixed(0)
    let exchangeRate
    const minEth = new BigNumber(1).toFixed(0)
    const outputTokenAddress = tokenAddresses[outputCurrency]
    console.log(`Minimum required token is: ${minToken / Math.pow(10, 18)} ${outputCurrency}`)
    return new Promise((resolve, reject) => {
      exchangeContract.methods.tokenToTokenSwapInput(
        tokenSold,
        minToken,
        minEth,
        deadline,
        outputTokenAddress
      ).send({ from: accounts[0] }, (err, data) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
}
export const metamaskSendEth = async function (data) {
  let { from, to, value, gasPrice, gasLimit } = data
  const ethereum = window.ethereum;
  let web3 = await getWeb3Metamask()
  let accounts = await ethereum.enable()
  web3.setProvider(ethereum);
  let selectedAddress = ethereum.selectedAddress
  const transactionParameters = {
    gasPrice: web3.utils.toHex(gasPrice),
    gasLimit: web3.utils.toHex(gasLimit),
    from: selectedAddress,
    to,
    value: web3.utils.toHex(value),
    data: ''
  }

  try {
    return new Promise((resolve, reject) => {
      web3.eth.sendTransaction(transactionParameters).on('transactionHash', function (hash) {
        console.log('Tx hash: ', hash)
        resolve(hash)
      })
    })
  } catch (e) {
    console.log('Error while trying to transfer using metamask extension')
    console.log(e)
  }
}

export const normaliseText = text => {
  let normalised
  if (!text || text.length === 0) return ''
  normalised = text.toLowerCase()
  normalised = normalised.replace(/\s/g, '')
  return normalised
}

export const metamaskSendToken = async function (data) {
  const { from, to, value, gasPrice, gasLimit, currency } = data
  const ethereum = window.ethereum;
  let web3 = await getWeb3Metamask()
  let accounts = await ethereum.enable()
  web3.setProvider(ethereum);
  let selectedAddress = ethereum.selectedAddress
  let amount = web3.utils.toHex(value)
  let count = await web3.eth.getTransactionCount(from)
  let contractAddress = tokenAddresses[currency]
  let contract = new web3.eth.Contract(tokenABI, contractAddress, {
    from: from
  })
  const transactionParameters = {
    from: selectedAddress,
    to: contractAddress,
    value: '0x0',
    data: contract.methods.transfer(to, amount).encodeABI(),
    nonce: web3.utils.toHex(count)
  }
  try {
    return new Promise((resolve, reject) => {
      web3.eth.sendTransaction(transactionParameters).on('transactionHash', function (hash) {
        console.log('Tx hash: ', hash)
        resolve(hash)
      })
    })
  } catch (e) {
    console.log('Error while trying to transfer using metamask extension')
    console.log(e)
  }
}

// Detects if device is on iOS
export const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase()
  return /iphone|ipad|ipod/.test(userAgent)
}
// Detects if device is in standalone mode
export const isInStandaloneMode = () =>
  'standalone' in window.navigator && window.navigator.standalone

export const needsToSeePWAPrompt = user => {
  if (navigator.standalone) {
    return false
  }
  let isApple = ['iPhone', 'iPad', 'iPod'].includes(navigator.platform)
  return isApple
}
export const checkImageExist = async src => {
  try {
    let response = await axios.get(src)
    if (response.status == 200) return true
  } catch (e) {
    return false
  }
}
export const getAllListedToken = async () => {
  let listedTokens = {}
  let response = await axios.get(`${CONFIG.uniswapDexServer}api/token`)
  let tokens = response.data.result
  tokens.forEach(token => {
    listedTokens[token.symbol] = {
      tokenName: token.name,
      tokenSymbol: token.symbol,
      tokenAddress: token.tokenAddress
    }
  })
  return tokens

}
function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}