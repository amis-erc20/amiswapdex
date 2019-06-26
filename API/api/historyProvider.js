import CONFIG from '../../config'
import axios from 'axios'
const serverUrl = CONFIG.uniswapDexServer
const history = {}

export default {
  history: history,
  getBars: function (symbolInfo, resolution, from, to, first, limit) {
    let url
    if (symbolInfo.type === 'liquidity') {
      if (resolution === '60') {
        url = `${serverUrl}api/histohourmarket?start=${from * 1000}&&end=${to * 1000}`
      } else if (resolution === '240') {
        url = `${serverUrl}api/histo4hourmarket?start=${from * 1000}&&end=${to * 1000}`
      } else {
        url = `${serverUrl}api/histodaymarket?start=${from * 1000}&&end=${to * 1000}`
      }
    } else if (symbolInfo.type === 'volume') {
      if (resolution === '60') {
        url = `${serverUrl}api/histohourvolume?start=${from * 1000}&&end=${to * 1000}`
      } else if (resolution === '240') {
        url = `${serverUrl}api/histo4hourvolume?start=${from * 1000}&&end=${to * 1000}`
      } else {
        url = `${serverUrl}api/histodayvolume?start=${from * 1000}&&end=${to * 1000}`
      }
    } else if (symbolInfo.type === 'token') {
      url = `${serverUrl}api/histodaytoken?start=${from * 1000}&&end=${to * 1000}`
    } else if (symbolInfo.type === 'txs') {
      if (resolution === '60') {
        url = `${serverUrl}api/histohour?tokenAddress=${symbolInfo.tokenAddress}&start=${from * 1000}&&end=${to * 1000}`
      } else if (resolution === '240') {
        url = `${serverUrl}api/histo4hour?tokenAddress=${symbolInfo.tokenAddress}&start=${from * 1000}&&end=${to * 1000}`
      } else {
        url = `${serverUrl}api/histoday?tokenAddress=${symbolInfo.tokenAddress}&start=${from * 1000}&&end=${to * 1000}`
      }
    }

    return axios.get(url).then(response => {
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
            volume: el.volume_eth || el.amount_eth || el.token_count,
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
          history[symbolInfo.name] = {
            lastBar: lastBar
          }
        }
        return bars
      } else {
        return []
      }
    })
  }
}
