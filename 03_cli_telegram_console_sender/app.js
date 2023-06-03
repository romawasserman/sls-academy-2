import TelegramBot from "node-telegram-bot-api"
import { program } from "commander"

const token = "5991745792:AAGODNtq5HgkjvNIr3yxLW9eKT9C0hd5-XM"

export const bot = new TelegramBot(token, { polling: true })

let users = []

program
  .name("CLI: TELEGRAM CONSOLE SENDER")
  .description("An application for sending text or photo to Telegram Bot")
  .version("1.3.3.7")

program
  .command("message")
  .description("Send message from console to Telegram Bot")
  .arguments("<message>")
  .alias("m")
  .action((message) => {
    if (!message) {
      console.log("Enter message")
      process.exit()
    } else {
      bot.onText(/\/start/, (msg) => {
        if (!users.includes(msg.chat.id)) {
          console.log(msg.chat.id, users)
          users.push(msg.chat.id)
          bot.sendMessage(msg.chat.id, message).then(() => process.exit())
        }
      })
    }
  })

program
  .command("photo")
  .description(
    "Send image to telegramm. Write path or just drag'n'drop to terminal"
  )
  .arguments("<path>")
  .alias("p")
  .action((path) => {
    if (!path) {
      console.log("Please provide path to image")
      process.exit()
    } else {
      bot.onText(/\/start/, (msg) => {
        if (!users.includes(msg.chat.id)) {
          console.log(msg.chat.id, users)
          users.push(msg.chat.id)
          bot.sendPhoto(msg.chat.id, path).then(() => process.exit())
        }
      })
    }
  })

program.parse(process.argv)
