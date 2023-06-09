import TelegramBot from "node-telegram-bot-api"
import {
  getForecast,
  readDatabase,
  RemoveCallbackSubscription,
  RemoveSubscription,
  startWeather,
} from "./logic.js"

readDatabase()
export const bot = new TelegramBot(
  "6256959823:AAHdMt7Eu2yKKHxwhEbkoEffNzk_wx_DUjk",
  {
    polling: true,
  }
)

export const intervalIds = new Map()

bot.onText(/\/start/, (msg) => {
  const keyboard = {
    keyboard: [[{ text: "Forecast in Zaporizhzhia" }]],
    one_time_keyboard: true,
  }
  bot.sendMessage(msg.chat.id, "Forecast in Zaporizhzhia", {
    reply_markup: JSON.stringify(keyboard),
  })
})

bot.on("message", (msg) => {
  if (msg.text === "Forecast in Zaporizhzhia") {
    const keyboard = {
      keyboard: [
        [{ text: "Get daily forecast each 3 hours" }],
        [{ text: "Get daily forecast each 6 hours" }],
        [{ text: "Get current weather each hour" }],
      ],
      one_time_keyboard: true,
    }

    bot.sendMessage(
      msg.chat.id,
      "You want forecast each 3 hours or each 6 hours?",
      {
        reply_markup: JSON.stringify(keyboard),
      }
    )
  }
})

bot.on("message", async (msg) => {
  if (msg.text === "Get daily forecast each 3 hours") {
    try {
      const forecast = await getForecast(3)
      bot.sendMessage(msg.chat.id, forecast)
    } catch (err) {
      console.log(err)
    }
  } else if (msg.text === "Get daily forecast each 6 hours") {
    try {
      const forecast = await getForecast(6)
      bot.sendMessage(msg.chat.id, forecast)
    } catch (err) {
      console.log(err)
    }
  } else if (msg.text === "Get current weather each hour") {
    startWeather(1, msg.chat.id)
    const button = {
      text: "or write /cancel anytime",
      callback_data: "/cancel",
    }

    const keyboard = {
      inline_keyboard: [[button]],
    }

    const options = {
      reply_markup: keyboard,
    }
    bot.sendMessage(msg.chat.id, "Press to cancel subscription,", options)
  }
})

bot.on("callback_query", (callbackQuery) => {
  RemoveCallbackSubscription(callbackQuery)
})

bot.onText(/\/cancel/, (msg) => {
  RemoveSubscription(msg)
})

bot.on("polling_error", console.log)
