import axios from "axios"
import NodeCache from "node-cache"
import { bot } from "./app.js"

const myCache = new NodeCache({ stdTTL: 60, checkperiod: 60 })

export async function messageInfo(currency, id) {
  const privatValue = await getPrivatBank(currency)
  const monoValue = await getMonoBank(currency)
  bot.sendMessage(
    id,
    ` Курс ${currency} to UAH PrivatBank: \nКупівля : ${parseFloat(
      privatValue.buy
    ).toFixed(2)}, Продаж : ${parseFloat(privatValue.sale).toFixed(
      2
    )} \n\nКурс ${currency} to UAH Monobank: \nКупівля : ${monoValue.rateBuy.toFixed(
      2
    )}, Продаж : ${monoValue.rateSell.toFixed(2)}`
  )
}

async function getPrivatBank(currencyName) {
  try {
    const res = await axios.get(
      "https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5"
    )
    const privat = res.data.find((currency) => currency.ccy === currencyName)
    return privat
  } catch (err) {
    console.log(err)
  }
}

async function getMonoBank(currencyName) {
  try {
    if (!myCache.has("monoUsd")) {
      const res = await axios.get("https://api.monobank.ua/bank/currency")
      const monoUsd = res.data.find(
        (currency) =>
          currency.currencyCodeA === 840 && currency.currencyCodeB === 980
      )
      const monoEur = res.data.find(
        (currency) =>
          currency.currencyCodeA === 978 && currency.currencyCodeB === 980
      )
      const success = myCache.mset([
        { key: "monoUsd", val: monoUsd },
        { key: "monoEur", val: monoEur },
      ])
      return currencyName === "USD"
        ? monoUsd
        : currencyName === "EUR"
        ? monoEur
        : null
    } else {
      return currencyName === "USD"
        ? myCache.get("monoUsd")
        : currencyName === "EUR"
        ? myCache.get("monoEur")
        : null
    }
  } catch (err) {
    console.log(err)
  }
}
