import TelegramBot from "node-telegram-bot-api"
import axios from "axios"
import NodeCache from "node-cache"

const bot = new TelegramBot("6289438035:AAH_JvT3xlfYBe8G8Wteujet2g1a0L0gB6k", {
  polling: true,
})





bot.onText(/\/start/, (msg) => {
  const keyboard = {
    keyboard: [[{ text: "Курс валют" }]],
    one_time_keyboard: true,
  }
  bot.sendMessage(msg.chat.id, "Що вас цікавить?", {
    reply_markup: JSON.stringify(keyboard),
  })
})



bot.on("message", (msg) => {
    if (msg.text === "Курс валют") {
  
      const keyboard = {
        keyboard: [
          [{ text: "USD" }],
          [{ text: "EUR" }],
        ],
        one_time_keyboard: true,
      }
  
      bot.sendMessage(msg.chat.id, "Оберіть валюту", {
        reply_markup: JSON.stringify(keyboard),
      })
    }
  })

  bot.on("message", (msg) => {
    if (msg.text === "USD") {
      bot.sendMessage(msg.chat.id, "Оберіть валюту")
    }
    if (msg.text === 'EUR') {
      bot.sendMessage(msg.chat.id, "Оберіть валюту")
    }
  })