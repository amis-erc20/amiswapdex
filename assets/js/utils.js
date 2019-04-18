import Web3 from 'web3'
import axios from 'axios'
import { exchangeABI, tokenABI, ERC20_ABI } from './abi'
import { tokenAddresses, exchangeAddresses } from './token'
import BigNumber from 'bignumber.js'
import CONFIG from '../../config.js'

let tokenSymbols = Object.keys(exchangeAddresses)
let exchangeContracts = {}
let tokenContracts = {}

export const initContracts = async function(web3) {
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
export const getWeb3 = function() {
	return new Promise(function(resolve, reject) {
		try {
			// let web3 = new Web3(new Web3.providers.HttpProvider("mainnet.infura.io/v3/6f70582e339948738835c25da4b9b8a5"));
			let web3 = new Web3(
				'wss://mainnet.infura.io/ws/v3/6f70582e339948738835c25da4b9b8a5'
			)
			resolve(web3)
		} catch (e) {
			console.log(e)
			reject('Cannot get web3 instance')
		}
	})
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
		// let response = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,JPY,EUR`)
		// return response.data.USD
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
export const getDAIToUSDPrice = async () => {
	try {
		let response = await axios.get(
			`https://min-api.cryptocompare.com/data/price?fsym=DAI&tsyms=USD,JPY,EUR`
		)
		return response.data.USD
	} catch (e) {
		console.log(`ERROR - getDAIToUSDPrice`)
		console.log(e)
	}
}

export const getHistory = async function(address) {
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
export const getTokenHistory = async function(address) {
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
export const getBalance = async function(address, web3) {
	if (!address) return
	try {
		// let url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest`
		// let response = await axios.get(url)
		// return parseInt(response.data.result)
		let balance = await web3.eth.getBalance(address)
		return balance
	} catch (e) {
		console.log(`ERROR - getBalance`)
		console.log(e)
		return
	}
}
export const getTokenBalance = async function(address, currency, web3) {
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
	} catch (e) {
		console.log(`ERROR - getTokenBalance`)
		console.log(e)
		return 0
	}
}

export const estimateGas = async function(transaction, web3) {
	try {
		let gas = await web3.eth.estimateGas({
			from: transaction.from,
			to: transaction.to,
			value: parseInt(transaction.amount)
		})
		return gas
	} catch (e) {
		return 0
	}
}
export const estimateGasPrice = async function(web3) {
	let gasPrice = await web3.eth.getGasPrice()
	return gasPrice
}
export const signAndSendETH = async function(transaction, privateKey, web3) {
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
			.on('transactionHash', function(hash) {
				console.log('Tx hash: ', hash)
				resolve(hash)
			})
	})
}

export const sendToken = async function(tx, currency, privateKey, web3) {
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
			.on('transactionHash', function(hash) {
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
			.on('transactionHash', function(hash) {
				console.log('Tx hash: ', hash)
				resolve(hash)
			})
	})
}

export const swapTokenToEth = async function(
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
			.on('transactionHash', function(hash) {
				console.log('Tx hash: ', hash)
				resolve(hash)
			})
	})
}

export const swapEthToToken = async function(
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
				.on('error', function(error) {
					console.log(error)
					resolve(false)
				})
				.on('transactionHash', function(hash) {
					console.log('Tx hash: ', hash)
					resolve(hash)
				})
		} catch (e) {
			console.log('Error...')
		}
	})
}

export const swapTokenToToken = async function(
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
			.on('transactionHash', function(hash) {
				console.log('Tx hash: ', hash)
				resolve(hash)
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
