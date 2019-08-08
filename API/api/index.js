import historyProvider from '../api/historyProvider'
import CONFIG from '../../config'
import axios from 'axios'
const serverUrl = CONFIG.uniswapDexServer

let supportedResolutions = ['60', '240', '1D']
const config = {
  supported_resolutions: supportedResolutions
}
const configMarketCharts = {
  support_market_resolutions: ['1D']
}
let _subs = []
export const createDatafeed = (tokenAddress, tokenName, currency, type) => ({
  onReady: cb => {
    setTimeout(() => cb(config), 0)
  },
  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {},
  resolveSymbol: (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback
  ) => {
    var split_data = symbolName.split(/[:/]/)
    var symbol_stub = {
      name: (currency !== null) ? `${tokenName}/${currency}` : `${tokenName}`,
      pro_name: (currency !== null) ? `${tokenName}/${currency}` : `${tokenName}`,
      description: '',
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      ticker: symbolName,
      exchange: 'UniswapDEX',
      minmov: 1,
      pricescale: 100000000,
      has_intraday: true,
      intraday_multipliers: ['1', '60'],
      supported_resolution: supportedResolutions,
      volume_precision: 5,
      data_status: 'streaming'
    }
    symbol_stub.pricescale = 10000

    setTimeout(function () {
      onSymbolResolvedCallback(symbol_stub)
    }, 0)
  },
  getBars: function (
    symbolInfo,
    resolution,
    from,
    to,
    onHistoryCallback,
    onErrorCallback,
    firstDataRequest
  ) {
    symbolInfo.tokenAddress = tokenAddress
    symbolInfo.currency = currency
    symbolInfo.type = type
    historyProvider
      .getBars(symbolInfo, resolution, from, to, firstDataRequest)
      .then(bars => {
        if (bars.length) {
          onHistoryCallback(bars, {
            noData: false
          })
        } else {
          onHistoryCallback(bars, {
            noData: true
          })
        }
      })
      .catch(err => {
        onErrorCallback(err)
      })
  },
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback
  ) => {
    // console.log(`=====subscribeBars runnning for ${tokenName}`)
    let existingSub = _subs.find(s => s.tokenName === tokenName)
    if (existingSub) {
      let index = _subs.findIndex(s => s.tokenName === tokenName)
      _subs[index].currency = currency
      _subs[index].subscribeUID = subscribeUID
      _subs[index].resolution = resolution
      _subs[index].symbolInfo = symbolInfo
      _subs[index].lastBar = historyProvider.history[symbolInfo.name].lastBar
      _subs[index].listener = onRealtimeCallback
    } else {
      var newSub = {
        tokenName,
        currency,
        type,
        subscribeUID,
        resolution,
        symbolInfo,
        lastBar: historyProvider.history[symbolInfo.name].lastBar,
        listener: onRealtimeCallback
      }
      _subs.push(newSub)
    }
  },
  unsubscribeBars: subscriberUID => {},
  calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
    return resolution < 60 ? {
        resolutionBack: 'D',
        intervalBack: '1'
      } :
      undefined
  },
  getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {},
  getTimeScaleMarks: (
    symbolInfo,
    startDate,
    endDate,
    onDataCallback,
    resolution
  ) => {},
  getServerTime: cb => {}
})

async function getLatestBar(tokenAddress, resolution, currency) {
  let url
  if (resolution === '60') {
    url = `${serverUrl}api/histohour?tokenAddress=${tokenAddress}`
  } else if (resolution === '240') {
    url = `${serverUrl}api/histo4hour?tokenAddress=${tokenAddress}`
  } else {
    url = `${serverUrl}api/histoday?tokenAddress=${tokenAddress}`
  }
  let response = await axios.get(url)
  let data = response.data
  if (!data.result || data.result.length === 0) {
    console.log('Backend API error:', data.Message)
    return null
  }
  if (data.result.length > 0) {
    let arr = []
    arr.push(data.result[0])
    var bars = data.result.map(el => {
      return {
        time: parseInt(el.timestamp), // TradingView requires bar time in ms
        low: el.low,
        high: el.high,
        open: el.open,
        close: el.close,
        volume: el.volume_eth,
        price_eth_usd: el.price_eth_usd
      }
    })
    if (currency === 'USD') {
      for (let i = bars.length - 1; i >= 1; i--) {
        bars[i].open = bars[i].open * bars[i - 1].price_eth_usd
        bars[i].close = bars[i].close * bars[i].price_eth_usd
        bars[i].high = bars[i].high * bars[i].price_eth_usd
        bars[i].low = bars[i].low * bars[i].price_eth_usd
        bars[i].volume = bars[i].volume * bars[i].price_eth_usd
      }
      bars[0].open = bars[0].open * bars[0].price_eth_usd
      bars[0].close = bars[0].close * bars[0].price_eth_usd
      bars[0].high = bars[0].high * bars[0].price_eth_usd
      bars[0].low = bars[0].low * bars[0].price_eth_usd
      bars[0].volume = bars[0].volume * bars[0].price_eth_usd
    }
    // bars[bars.length - 1].close = bars[bars.length - 1].open
    return bars[bars.length - 1]
  } else {
    return null
  }
}

setInterval(async () => {
  const filteredSubs = _subs.filter(s => s.type === 'txs')
  if (filteredSubs.length === 0) return
  try {
    let currentChartInfo = JSON.parse(localStorage.getItem('chartInfo'))
    let sub = filteredSubs.find(s => s.tokenName === currentChartInfo.tokenName)
    if (!sub) return
    let data = await getLatestBar(currentChartInfo.tokenAddress, sub.resolution, sub.currency)
    if (!data) return
    let _lastBar = updateBar(data, sub)
    sub.listener(_lastBar)
    sub.lastBar = _lastBar
  } catch (e) {

  }
}, 20000)

function updateBar(data, sub) {
  var lastBar = sub.lastBar
  if (data.time > lastBar.time) {
    console.log('create new candle')
  }
  return data
}