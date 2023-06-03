import fs from 'node:fs'
import { bot } from './app.js'
export function storeChatId(chatId, callback) {
  try {
    const data = fs.readFileSync("chatIds.txt", "utf8")
    const chatIds = data.trim().split("\n")

    if (!chatIds.includes(chatId.toString())) {
      fs.appendFileSync("chatIds.txt", `${chatId}\n`)
    }

    callback()
  } catch (err) {
    console.error("Error reading or storing chat ID:", err)
  }
}

async function sendMessageToChat(chatId, message) {
  await bot.sendMessage(chatId, message)
}

export async function sendAllUsersMessage(message) {
  try {
    const data = fs.readFileSync("chatIds.txt", "utf8")
    const chatIds = data.trim().split("\n")

    const sentChatIds = new Set()

    for (const chatId of chatIds) {
      if (!sentChatIds.has(chatId)) {
        await sendMessageToChat(chatId, message)
        sentChatIds.add(chatId)
      }
    }

    console.log("Message sent to all users.")
  } catch (err) {
    console.error("Please type /start in telegram bot")
  }
}

async function sendPhotoToChat(chatId, photo) {
  try {
    await bot.sendPhoto(chatId, photo)
  } catch (error) {
    console.error("please type /start in telegram bot")
  }
}

export async function sendAllUsersPhoto(imagePath) {
  try {
    const data = fs.readFileSync("chatIds.txt", "utf8")
    const chatIds = data.trim().split("\n")

    const sentChatIds = new Set()

    for (const chatId of chatIds) {
      if (!sentChatIds.has(chatId)) {
        try {
          await sendPhotoToChat(chatId, imagePath)
          sentChatIds.add(chatId)
        } catch (error) {
          console.error("please press /start in telegram")
        }
      }
    }
  } catch (error) {
    console.error("Error sending photo to all users:", error)
  }
}
