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
        // console.log(
        //   `Actually returned: ${new Date(
        //     from * 1000
        //   ).toISOString()} - ${new Date(to * 1000).toISOString()}`
        // )
        // console.log(`Result result length: ${data.result.length}`)
        let arr = []
        arr.push(data.result[0])
        var bars = data.result.map(el => {
          return {
            time: parseInt(el.timestamp), // TradingView requires bar time in ms
            low: el.low * el.price_eth_usd,
            high: el.high * el.price_eth_usd,
            open: el.open * el.price_eth_usd,
            close: el.close * el.price_eth_usd,
            volume: el.volume_eth * el.price_eth_usd
          }
        })
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
