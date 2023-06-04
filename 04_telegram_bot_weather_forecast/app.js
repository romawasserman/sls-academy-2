import TelegramBot from "node-telegram-bot-api"
import { startWeather } from "./logic.js"

export const bot = new TelegramBot("6256959823:AAHdMt7Eu2yKKHxwhEbkoEffNzk_wx_DUjk", {
  polling: true,
})

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
      ],
      one_time_keyboard: true,
    }

    bot.sendMessage(msg.chat.id, "You want forecast each 3 hours or each 6 hours?", {
      reply_markup: JSON.stringify(keyboard),
    })
  }
})
let intervalId
bot.on("message", (msg) => {
  if (msg.text === "Get daily forecast each 3 hours") {
    startWeather(intervalId, 3, msg.chat.id)
  } else if (msg.text === "Get daily forecast each 6 hours") {
    startWeather(intervalId, 6, msg.chat.id)
  }
})
bot.on("polling_error", console.log)
