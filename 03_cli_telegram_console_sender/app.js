import TelegramBot from "node-telegram-bot-api"
import { program } from "commander"
import { sendAllUsersMessage, sendAllUsersPhoto, storeChatId } from "./logic.js"

const token = "6293864039:AAHNshlJK2Voyz8dHZxNnYgkEJlGEJ2GKzk"

export const bot = new TelegramBot(token, { polling: true })

program
  .name("CLI: TELEGRAM CONSOLE SENDER")
  .description("An application for sending text or photo to Telegram Bot")
  .version("1.3.3.7")

program
  .command("message")
  .description("Send message from console to Telegram Bot")
  .arguments("<message>")
  .alias("m")
  .action(async (message) => {
    console.log(message);
    if (!message) {
      console.log('Enter message');
      process.exit()
    }else {
      let startCommandReceived = false;
      bot.onText(/\/start/, async (msg) => {
        if (!startCommandReceived) {
          startCommandReceived = true;
        storeChatId(msg.chat.id, async () => {
          await sendAllUsersMessage(message)
          process.exit()
        })
      }})
      setTimeout(async () => {
        if (!startCommandReceived) {
          await sendAllUsersMessage(message);
          process.exit();
        }
      }, 500);
    }
  })

program
  .command("photo")
  .description(
    "Send image to telegramm. Write path or just drag'n'drop to terminal"
  )
  .arguments("<path>")
  .alias("p")
  .action(async (path) => {
    let startCommandReceived = false; 


    bot.onText(/\/start/, async (msg) => {
      if (!startCommandReceived) {
        startCommandReceived = true;
        storeChatId(msg.chat.id, async () => {
          await sendAllUsersPhoto(path);
          process.exit();
        });
      }
    });


    setTimeout(async () => {
      if (!startCommandReceived) {
        await sendAllUsersPhoto(path);
        process.exit();
      }
    }, 500);
  });

program.parse(process.argv)
