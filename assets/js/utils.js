import Web3 from 'web3'
import axios from 'axios'
import {
  exchangeABI,
  tokenABI,
  ERC20_ABI,
  factoryABI
} from './abi'
import {
  factoryAddress
} from './token'
import BigNumber from 'bignumber.js'
import CONFIG from '../../config.js'
import * as R from 'ramda'
import config from '../../config.js'

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
    try {
      exchangeContracts[tokenSymbols[i]] = new web3.eth.Contract(
        exchangeABI,
        exchangeAddresses[tokenSymbols[i]]
      )
    } catch (e) {
      console.log(`Error while creating exchange contract for ${tokenSymbols[i]}`)
      console.log(e)
    }
  }
  for (let i = 0; i < tokenSymbols.length; i += 1) {
    try {
      tokenContracts[tokenSymbols[i]] = new web3.eth.Contract(
        tokenABI,
        tokenAddresses[tokenSymbols[i]]
      )
    } catch (e) {
      console.log(`Error while creating token contract for ${tokenSymbols[i]}`)
      console.log(e)
    }
  }
}
export const createNewCotract = async function (web3, token) {
  factoryContract = new web3.eth.Contract(factoryABI, factoryAddress)
  tokenAddresses[token.symbol] = token.tokenAddress
  const tokenContract = new web3.eth.Contract(
    tokenABI,
    token.tokenAddress
  )
  tokenContracts[token.symbol] = tokenContract
  return tokenContract
}
export const hasTokenUniswap = function (symbol) {
  if (exchangeAddresses[symbol]) {
    return true
  } else return false
}
export const getWeb3 = function () {
  return new Promise(function (resolve, reject) {
    try {
      // let web3 = new Web3(
      //   'wss://mainnet.infura.io/v3/398dbd17c02c4a37ba1a0e902742cf2b'
      // )
      let web3 = new Web3(
        new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/398dbd17c02c4a37ba1a0e902742cf2b')
      )
      resolve(web3)
    } catch (e) {
      console.error(e)
      reject('Cannot get web3 instance')
    }
  })
}
export const getWeb3Metamask = function () {
  return new Promise(function (resolve, reject) {
    try {
      if (!Web3.givenProvider._metamask) {
        console.warn('Metamask web3 is overwritten by an another extension')
        console.log(Web3.givenProvider)
        resolve(null)
      }
      // web3.currentProvider.guardaWeb3
      let web3 = new Web3(Web3.givenProvider)
      web3.currentProvider.setMaxListeners(300)
      resolve(web3)
    } catch (e) {
      console.log(e)
      console.log('Cannot get web3 instance for metamask')
      resolve(null)
    }
  })
}

export const getExchangeAddress = async function (tokenAddress) {
  try {
    let exchangeAddress = await factoryContract.methods
      .getExchange(tokenAddress)
      .call()
    if (exchangeAddress) return exchangeAddress
    else return false
  } catch (e) {
    // console.log(`ERROR: unable to get exchange address for token address: ${tokenAddress}`)
    // console.error(e)
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
    // console.log(`ERROR - getULToUSDPrice`)
    // console.log(e)
  }
}

export const getCurrentReserve = async (currency, web3) => {
  let tokenContract = tokenContracts[currency]
  let exchangeAddress = exchangeAddresses[currency]
  let ethReserve = await web3.eth.getBalance(exchangeAddress)
  let tokenReserve = await tokenContract.methods
    .balanceOf(exchangeAddress)
    .call()
  return {
    ethReserve: parseInt(ethReserve),
    tokenReserve: parseInt(tokenReserve, 'hex')
  }
}

export const getETHToUSDPrice = async () => {
  try {
    let response = await axios.get(`${CONFIG.chartServerUrl}/histohour?limit=1`)
    if (response.data.transactions && response.data.transactions.length > 0) {
      let ethUsdPrice = response.data.transactions[0].price_eth_usd
      return ethUsdPrice
    } else {
      let response = await axios.get(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${CONFIG.etherscanApiKey}`)
      return response.data.result.ethusd
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
    return {
      ethUsdPrice,
      ultUsdPrice
    }
  }
}
export const getTokenToUSDPrice = async (symbol) => {
  try {
    let response = await axios.get(
      `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD,JPY,EUR`
    )
    return response.data.USD
  } catch (e) {
    // console.log(`ERROR - getTokenToUSDPrice`)
    // console.log(e)
  }
}

export const getHistory = async function (address) {
  if (!address) return
  try {
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=asc&apikey=YourApiKeyToken`
    let response = await axios.get(url)
    return response.data.result
  } catch (e) {
    // console.log(`ERROR - getHistory`)
    // console.log(e)
  }
}
export const getTokenHistory = async function (address) {
  if (!address) return
  try {
    const url = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&tag=latest`
    let response = await axios.get(url)
    return response.data.result
  } catch (e) {
    // console.log(`ERROR - getTokenHistory`)
    // console.log(e)
  }
}
export const getBalance = async function (address, web3) {
  if (!address) return
  try {
    let balance = await web3.eth.getBalance(address)
    return parseInt(balance)
  } catch (e) {
    // console.log(`ERROR - getBalance`)
    // console.log(e)
  }
}
export const getTokenBalance = async function (address, currency, web3, ownedTokenList) {
  if (!address) return
  if (!tokenContracts[currency]) {
    console.warn(`Cannot find token contract for ${currency}. Creating now...`)
    let tokenInfo = R.find(R.propEq('tokenName', currency))(ownedTokenList)
    await createNewCotract(web3, {
      symbol: tokenInfo.tokenName,
      tokenAddress: tokenInfo.tokenAddress
    })
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
    // console.log(`ERROR - getTokenBalance`)
    // console.log(e)
    return 0
  }
}
export const estimateGas = async function (transaction, web3) {
  try {
    let gas = await web3.eth.estimateGas({
      from: transaction.from,
      // to: transaction.to,
      to: transaction.from,
      value: transaction.value
    })
    return gas
  } catch (e) {
    console.error(e)
    return 0
  }
}
export const estimateGasForSwap = async function (transaction, web3, exchangeAddress) {
  try {
    let contract = new web3.eth.Contract(
      exchangeABI,
      exchangeAddress
    )
    const blockNumber = await web3.eth.getBlockNumber()
    const block = await web3.eth.getBlock(blockNumber)
    const deadline = block.timestamp + 300
    return new Promise(resolve => {
      contract.methods
        .tokenToEthSwapInput(100000, 1, deadline)
        .estimateGas({
          from: transaction.from
        })
        .then(function (gasAmount) {
          console.log(`Estimated gas for token swap: ${gasAmount}`)
          resolve(gasAmount)
        })
        .catch(function (error) {
          // console.log(error)
          resolve(0)
        })
    })
  } catch (e) {
    console.error(e)
    return 0
  }
}
export const estimateGasPrice = async function (web3) {
  let gasPrice = await web3.eth.getGasPrice()
  return gasPrice
}
export const signAndSendETH = async function (transaction, privateKey, web3) {
  console.log(transaction)
  let signedTx = await web3.eth.accounts.signTransaction({
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
    let factoryContract = new web3.eth.Contract(factoryABI, factoryAddress)
    let txId = await factoryContract.methods.createExchange(tokenAddress).send({
      from: myAddress
    })
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
  let transaction = await web3.eth.accounts.signTransaction({
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
  console.log(tx)
  const web3 = data.web3
  const count = await web3.eth.getTransactionCount(tx.from)
  const amount = new BigNumber(tx.approvedAmount)
  const tokenAddress = tokenAddresses[tokenSymbol]
  const contract = new web3.eth.Contract(ERC20_ABI, tokenAddress)
  let transaction = await web3.eth.accounts.signTransaction({
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
export const unlockTokenMetamask = async (tx, tokenSymbol, data) => {
  const web3 = data.web3
  const count = await web3.eth.getTransactionCount(tx.from)
  const amount = new BigNumber(tx.approvedAmount)
  const tokenAddress = tokenAddresses[tokenSymbol]
  const contract = new web3.eth.Contract(ERC20_ABI, tokenAddress)
  const exchangeAddress = exchangeAddresses[tokenSymbol]

  return new Promise(resolve => {
    contract.methods.approve(exchangeAddress, amount).send({
      from: tx.from
    }).on('transactionHash', function (hash) {
      console.log('Tx hash: ', hash)
      resolve(hash)
    }).on('error', function (e) {
      console.log(e)
      console.log('Error while trying to transfer using metamask extension')
      resolve(false)
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
  let transaction
  if (tx.recipient && tx.recipient.length > 0) {
    transaction = await web3.eth.accounts.signTransaction({
      from: myAddress,
      gasPrice: web3.utils.toHex(tx.gasPrice),
      gasLimit: web3.utils.toHex(tx.gasLimit),
      to: contractAddress,
      value: '0x0',
      data: exchangeContract.methods
        .tokenToEthTransferInput(tx.tokenSold, tx.minEth, tx.deadline, tx.recipient)
        .encodeABI(),
      nonce: web3.utils.toHex(count)
    },
    privateKey
    )
  } else {
    transaction = await web3.eth.accounts.signTransaction({
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
  }
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
      let transaction
      if (tx.recipient && tx.recipient.length > 0) {
        transaction = await web3.eth.accounts.signTransaction({
          from: myAddress,
          gasPrice: web3.utils.toHex(tx.gasPrice),
          gasLimit: web3.utils.toHex(tx.gasLimit),
          to: contractAddress,
          value: web3.utils.toHex(tx.ethSold),
          data: exchangeContract.methods
            .ethToTokenTransferInput(tx.minimumTokenBought, tx.deadline, tx.recipient)
            .encodeABI(),
          nonce: web3.utils.toHex(count)
        },
        privateKey
        )
      } else {
        transaction = await web3.eth.accounts.signTransaction({
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
      }
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
  let transaction
  if (tx.recipient && tx.recipient.length > 0) {
    transaction = await web3.eth.accounts.signTransaction({
      from: myAddress,
      gasPrice: web3.utils.toHex(tx.gasPrice),
      gasLimit: web3.utils.toHex(tx.gasLimit),
      to: contractAddress,
      value: '0x0',
      data: exchangeContract.methods
        .tokenToTokenTransferInput(
          tx.tokenASold,
          tx.minEth,
          tx.minTokenBBought,
          tx.deadline,
          tx.recipient,
          tx.outputTokenAddress
        )
        .encodeABI(),
      nonce: web3.utils.toHex(count)
    },
    privateKey
    )
  } else {
    transaction = await web3.eth.accounts.signTransaction({
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
  }
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
  let transaction = await web3.eth.accounts.signTransaction({
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
      })
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
  let transaction = await web3.eth.accounts.signTransaction({
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
      tx.deadline
    ).send({
      from: myAddress
    }, (err, data) => {
      if (err) {
        console.log(e)
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
export const metamaskSwap = async function (data) {
  const ALLOWED_SLIPPAGE = 0.00001
  // const ALLOWED_SLIPPAGE = 0
  let web3Metamask = await getWeb3Metamask()
  let {
    inputValue,
    inputDecimal,
    inputCurrency,
    outputValue,
    outputDecimal,
    outputCurrency,
    type,
    recipient,
    gasPrice,
    gasLimit
  } = data
  const blockNumber = await web3Metamask.eth.getBlockNumber()
  const block = await web3Metamask.eth.getBlock(blockNumber)
  const deadline = block.timestamp + 300
  const accounts = await web3Metamask.eth.getAccounts()
  let exchangeContract
  if (type === 'ETH_TO_TOKEN') {
    exchangeContract = new web3Metamask.eth.Contract(
      exchangeABI,
      exchangeAddresses[outputCurrency]
    )
    // const min_token = new BigNumber(outputValue).multipliedBy(10 ** outputDecimal).toFixed(0)
    const min_token = new BigNumber(outputValue).multipliedBy(1 - ALLOWED_SLIPPAGE).multipliedBy(10 ** outputDecimal).toFixed(0)
    console.log(`slippage: ${1 - ALLOWED_SLIPPAGE}`)
    const amount = new BigNumber(inputValue).multipliedBy(10 ** inputDecimal).toFixed(0)
    console.log(`Minimum token bought: ${min_token}`)
    return new Promise((resolve, reject) => {
      if (recipient) {
        exchangeContract.methods.ethToTokenTransferInput(min_token, deadline, recipient)
          .send({
            from: accounts[0],
            value: amount,
            gasLimit: gasLimit,
            gasPrice: gasPrice
          }, (err, data) => {
            if (err) {
              console.log(err)
              reject(err)
            } else {
              resolve(data)
            }
          })
      } else {
        console.log(gasPrice, gasLimit)
        exchangeContract.methods.ethToTokenSwapInput(min_token, deadline)
          .send({
            from: accounts[0],
            value: amount,
            gasLimit: gasLimit,
            gasPrice: gasPrice
          }, (err, data) => {
            if (err) {
              console.log(err)
              reject(err)
            } else {
              resolve(data)
            }
          })
      }
    })
  } else if (type === 'TOKEN_TO_ETH') {
    exchangeContract = new web3Metamask.eth.Contract(
      exchangeABI,
      exchangeAddresses[inputCurrency]
    )
    const tokenSold = new BigNumber(inputValue).multipliedBy(10 ** inputDecimal).toFixed(0)
    // const minEth = new BigNumber(outputValue).multipliedBy(10 ** outputDecimal).toFixed(0)
    const minEth = new BigNumber(outputValue).multipliedBy(1 - ALLOWED_SLIPPAGE).multipliedBy(10 ** outputDecimal).toFixed(0)
    console.log(`Minimum ETH bought: ${minEth}`)
    return new Promise((resolve, reject) => {
      if (recipient) {
        exchangeContract.methods.tokenToEthTransferInput(tokenSold, minEth, deadline, recipient)
          .send({
            from: accounts[0],
            gasLimit: gasLimit,
            gasPrice: gasPrice
          }, (err, data) => {
            if (err) {
              console.log(`Transaction is not submitted`)
              console.log(err)
              reject(err)
            } else {
              resolve(data)
            }
          })
      } else {
        exchangeContract.methods.tokenToEthSwapInput(tokenSold, minEth, deadline)
          .send({
            from: accounts[0],
            gasLimit: gasLimit,
            gasPrice: gasPrice
          }, (err, data) => {
            if (err) {
              console.log(`Transaction is not submitted`)
              console.log(err)
              reject(err)
            } else {
              resolve(data)
            }
          })
      }
    })
  } else if (type === 'TOKEN_TO_TOKEN') {
    exchangeContract = new web3Metamask.eth.Contract(
      exchangeABI,
      exchangeAddresses[inputCurrency]
    )
    const tokenSold = new BigNumber(inputValue).multipliedBy(10 ** inputDecimal).toFixed(0)
    const minToken = new BigNumber(outputValue).multipliedBy(10 ** outputDecimal).multipliedBy(1 - 0.02).toFixed(0)
    const minEth = new BigNumber(1).toFixed(0)
    const outputTokenAddress = tokenAddresses[outputCurrency]
    console.log(`Minimum required token is: ${minToken / Math.pow(10, outputDecimal)} ${outputCurrency}`)
    return new Promise((resolve, reject) => {
      if (recipient) {
        exchangeContract.methods.tokenToTokenTransferInput(
          tokenSold,
          minToken,
          minEth,
          deadline,
          recipient,
          outputTokenAddress
        ).send({
          from: accounts[0],
          gasLimit: gasLimit,
          gasPrice: gasPrice
        }, (err, data) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            resolve(data)
          }
        })
      } else {
        exchangeContract.methods.tokenToTokenSwapInput(
          tokenSold,
          minToken,
          minEth,
          deadline,
          outputTokenAddress
        ).send({
          from: accounts[0],
          gasLimit: gasLimit,
          gasPrice: gasPrice
        }, (err, data) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            resolve(data)
          }
        })
      }
    })
  }
}
export const metamaskSendEth = async function (data) {
  let {
    from,
    to,
    value,
    gasPrice,
    gasLimit
  } = data
  const ethereum = window.ethereum
  let web3 = await getWeb3Metamask()
  let accounts = await ethereum.enable()
  web3.setProvider(ethereum)
  let selectedAddress = ethereum.selectedAddress
  const transactionParameters = {
    gasPrice: web3.utils.toHex(gasPrice),
    gasLimit: web3.utils.toHex(gasLimit),
    from: selectedAddress,
    to,
    value: web3.utils.toHex(value),
    data: ''
  }
  return new Promise((resolve, reject) => {
    web3.eth.sendTransaction(transactionParameters).on('transactionHash', function (hash) {
      console.log('Tx hash: ', hash)
      resolve(hash)
    }).on('error', function (e) {
      console.log(e)
      console.log('Error while trying to transfer using metamask extension')
      reject(e)
    })
  })
}
export const normaliseText = text => {
  let normalised
  if (!text || text.length === 0) return ''
  normalised = text.toLowerCase()
  normalised = normalised.replace(/\s/g, '')
  return normalised
}
export const metamaskSendToken = async function (data) {
  const {
    from,
    to,
    value,
    currency,
    gasLimit,
    gasPrice
  } = data
  const ethereum = window.ethereum
  let web3 = await getWeb3Metamask()
  await ethereum.enable()
  web3.setProvider(ethereum)
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
    nonce: web3.utils.toHex(count),
    gasPrice: web3.utils.toHex(gasPrice),
    gasLimit: web3.utils.toHex(gasLimit)
  }
  return new Promise((resolve, reject) => {
    web3.eth.sendTransaction(transactionParameters).on('transactionHash', function (hash) {
      console.log('Tx hash: ', hash)
      resolve(hash)
    })
      .on('error', function (e) {
        console.log(e)
        console.log('Error while trying to transfer using metamask extension')
        reject(e)
      })
  })
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
  tokens = tokens.map(token => {
    let checkedUrl
    if (token.logo) {
      let protocol = token.logo.split(':')[0]
      if (protocol === 'http') {
        checkedUrl = `${CONFIG.uniswapDexServer}static/${token.tokenAddress.toLowerCase()}.png`
      }
    } else {
      checkedUrl = token.logo
    }
    return {
      ...token,
      logo: checkedUrl
    }
  })
  tokens.forEach(token => {
    listedTokens[token.symbol] = {
      tokenName: token.name,
      tokenSymbol: token.symbol,
      tokenAddress: token.tokenAddress
    }
  })
  return tokens
}
export const getTokenHoldingByAnAccount = async (address) => {
  let response = await axios.get(`${CONFIG.uniswapDexServer}api/tokenholding?accountAddress=${address}`)
  let tokens = response.data.result
  return tokens
}

export const getEthToUsdcPrice = async () => {
  let url = `${CONFIG.uniswapDexServer}api/event?tokenAddress=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&limit=10`
  let response = await axios.get(url)
  let events = response.data.result
  for (let i = 0; i < events.length; i++) {
    let event = events[i]
    if (event.price > 0) return parseFloat(1 / event.price)
  }
}

export const isValidHex = (inputString) => {
  var re = /^[0-9a-fA-F]+$/
  if (re.test(inputString)) {
    re.lastIndex = 0
    return true
  } else {
    re.lastIndex = 0
    return false
  }
}
export const isValidAddress = (key) => {
  if (!key) return false
  let normalisedKey = key.trim().toLowerCase()
  if (normalisedKey.length !== 42) return false
  if (normalisedKey === '0'.repeat(42)) return false
  let keyToCheck
  if (normalisedKey[0] === '0' && normalisedKey[1] === 'x') {
    keyToCheck = normalisedKey.slice(2)
  } else {
    keyToCheck = normalisedKey
  }
  if (!isValidHex(keyToCheck)) return false
  return true
}
export const isValidPrivateKey = (key) => {
  let normalisedKey = key.trim().toLowerCase()
  let keyToCheck
  let finalKey
  if (normalisedKey[0] === '0' && normalisedKey[1] === 'x') {
    keyToCheck = normalisedKey.slice(2)
    finalKey = normalisedKey
  } else {
    keyToCheck = normalisedKey
    finalKey = '0x' + normalisedKey
  }
  if (keyToCheck.length !== 64) return false
  if (!isValidHex(keyToCheck)) return false
  return finalKey
}
export const getEvents = async (tokenAddress, limit = 50) => {
  try {
    let url = `${config.uniswapDexServer}api/event?tokenAddress=${tokenAddress}&limit=${limit}`
    let response = await axios.get(url)
    return response.data.result
  } catch (e) {
    return []
  }
}

export const prepareChart = (widget, resetZoom = true) => {
  let visibleRange
  let defaultTimeRange = {
    to: parseInt(Date.now() / 1000),
    from: parseInt(Date.now() / 1000) - 60 * 60 * 24 * 90
  }
  setTimeout(() => {
    try {
      visibleRange = JSON.parse(localStorage.getItem('visibleRange'))
      if (visibleRange && !resetZoom) {
        widget.chart().setVisibleRange(visibleRange.timeRange, function (err) {
          if (err) console.log(`Failed to set visible range for chart`)
        })
      } else {
        widget.chart().setVisibleRange(defaultTimeRange, function (err) {
          if (err) console.log(`Visible range is set for 1W range`)
        })
      }
    } catch (e) {
      console.log(`No Visible Range value are detected.`)
      widget.chart().setResolution('60', function (err) {
        if (err) console.log(`Failed to set resolution for chart`)
        else console.log(`Default resolution set to hourly.`)
      })
    }
    widget
      .chart()
      .onVisibleRangeChanged()
      .subscribe(null, function () {
        const {
          from,
          to
        } = widget.chart().getVisibleRange()
        const priceRange = widget.chart().getVisiblePriceRange()
        const currentResolution = widget.chart().resolution()
        const range = (to - from) / (60 * 60 * 24) // range in days
        if (range <= 0) return
        let visibleRangeToSave = {
          timeRange: {
            from: from,
            to: to
          },
          priceRange,
          resolution: currentResolution
        }
        localStorage.setItem('visibleRange', JSON.stringify(visibleRangeToSave))
      })
  }, 100)
}
