import historyProvider from '../api/historyProvider'

// https://github.com/tradingview/charting_library/wiki/Resolution
const supportedResolutions = ['60', '240', '1D']
const config = {
  supported_resolutions: supportedResolutions
}

export const createDatafeed = (tokenAddress, tokenName, currency, type) => ({
  onReady: cb => {
    // console.log('=====onReady running')
    setTimeout(() => cb(config), 0)
  },
  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
    // console.log('====Search Symbols running')
  },
  resolveSymbol: (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback
  ) => {
    var split_data = symbolName.split(/[:/]/)
    var symbol_stub = {
      // name: symbolName,
      name: `${tokenName}/${currency}`,
      pro_name: `${tokenName}/${currency}`,
      description: '',
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      ticker: symbolName,
      exchange: split_data[0],
      minmov: 1,
      pricescale: 100000000,
      has_intraday: true,
      intraday_multipliers: ['1', '60'],
      supported_resolution: supportedResolutions,
      volume_precision: 5,
      data_status: 'streaming'
    }
    if (split_data[1].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY|ETH/)) {
      symbol_stub.pricescale = 10000
    }
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
          onHistoryCallback(bars, { noData: false })
        } else {
          onHistoryCallback(bars, { noData: true })
        }
      })
      .catch(err => {
        console.log({ err })
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
    // console.log('=====subscribeBars runnning')
  },
  unsubscribeBars: subscriberUID => {
    // console.log('=====unsubscribeBars running')
  },
  calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
    //optional
    // console.log('=====calculateHistoryDepth running')
    // while optional, this makes sure we request 24 hours of minute data at a time
    // CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
    return resolution < 60
      ? { resolutionBack: 'D', intervalBack: '1' }
      : undefined
  },
  getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
    //optional
    // console.log('=====getMarks running')
  },
  getTimeScaleMarks: (
    symbolInfo,
    startDate,
    endDate,
    onDataCallback,
    resolution
  ) => {
    //optional
    // console.log('=====getTimeScaleMarks running')
  },
  getServerTime: cb => {
    // console.log('=====getServerTime running')
  }
})
