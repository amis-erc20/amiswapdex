import CONFIG from '../../config'
import { state, getters } from '../../store/index'
const serverUrl = CONFIG.uniswapDexServer
// var rp = require('request-promise').defaults({ json: true })
var axios = require('axios')
const history = {}

export default {
  history: history,
  getBars: function (symbolInfo, resolution, from, to, first, limit) {
    // console.log(symbolInfo)
    const url =
      resolution === '1D'
        ? `${serverUrl}api/histohour?tokenAddress=${symbolInfo.tokenAddress}&start=${from}&&end=${to}`
        : resolution >= 60
          ? `${serverUrl}api/histohour?tokenAddress=${symbolInfo.tokenAddress}&start=${from * 1000}&&end=${to * 1000}`
          : `${serverUrl}api/histohour?tokenAddress=${symbolInfo.tokenAddress}&start=${from * 1000}&&end=${to * 1000}`
    return axios.get(url).then(response => {
      console.log(url)
      let data = response.data
      if (!data.result || data.result.length === 0) {
        console.log('Backend API error:', data.Message)
        return []
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
        if (symbolInfo.currency === 'USD') {
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
        bars[bars.length - 1].close = bars[bars.length - 1].open
        if (first) {
          var lastBar = bars[bars.length - 1]
          history[symbolInfo.name] = { lastBar: lastBar }
        }
        return bars
      } else {
        return []
      }
    })
  }
}
