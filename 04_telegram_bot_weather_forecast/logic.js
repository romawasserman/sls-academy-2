import axios from "axios"
import { bot, intervalIds } from "./app.js"
import fs from "node:fs"

const dataBase = "data.txt"
//// API CALLS /////
function getWeather() {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=Zaporizhia&appid=8c9c8abbe2a66956fb288cae439a2fc7&units=metric`
      )
      .then(function (response) {
        const clouds =
          response.data.clouds.all < 20
            ? "Low"
            : response.data.clouds.all < 60
            ? "Moderate"
            : "Cloudy"
        const windDeg = response.data.wind.deg
        const windDirection =
          windDeg >= 337.5 || windDeg < 22.5
            ? "North"
            : windDeg >= 22.5 && windDeg < 67.5
            ? "Northeast"
            : windDeg >= 67.5 && windDeg < 112.5
            ? "East"
            : windDeg >= 112.5 && windDeg < 157.5
            ? "Southeast"
            : windDeg >= 157.5 && windDeg < 202.5
            ? "South"
            : windDeg >= 202.5 && windDeg < 247.5
            ? "Southwest"
            : windDeg >= 247.5 && windDeg < 292.5
            ? "West"
            : windDeg >= 292.5 && windDeg < 337.5
            ? "Northwest"
            : "Unknown"
        const weather = `Temperature: ${response.data.main.temp}°C,
            Feels like: ${response.data.main.feels_like}°C,
            Cloudiness: ${clouds},
            Wind: ${Math.floor(
              response.data.wind.speed
            )}m/s, ${windDirection}`.replace(/\n\s+/g, "\n")
        resolve(weather)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

export async function getForecast(hours) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=Zaporizhia&appid=8c9c8abbe2a66956fb288cae439a2fc7&units=metric`
    )

    let message = "Weather in Zaporizhia: \n\n"
    let sameDay
    response.data.list.forEach((data) => {
      const date = new Date(data.dt * 1000)
      const dateValue = date.getDate()
      const month = date.toLocaleString("en-US", { month: "long" })
      const day = date.toLocaleDateString("en-US", { weekday: "long" })
      const hour = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: false,
      })
      if (hour % hours === 0) {
        if (day !== sameDay) {
          message += `\n`
          message += `${day}, `
          message += `${dateValue} `
          message += `${month} \n`
        }
        message += `${hour} : 00, `
        message += `${data.main.temp > 0 ? "+" : ""}${data.main.temp}°C, `
        message += `Feels like: ${data.main.feels_like > 0 ? "+" : ""}${
          data.main.feels_like
        }°C, `
        message += `${data.weather[0].main}\n`
        sameDay = day
      }
    })
    return message
  } catch (err) {
    console.log("something went wrong ", err)
  }
}

//// HELPERS

export function findInterval(id) {
  if (intervalIds.has(id)) {
    return intervalIds.get(id)
  } else return null
}

function hoursToMillis(hours) {
  const milliseconds = 1000 * 60 * 60
  return hours * milliseconds
}

export function millisToHours(millis) {
  return millis / 1000 / 60 / 60
}

//// BOT COMMANDS
export async function startWeather(hours, chatId) {
  const userInterval = await findInterval(chatId)
  if (userInterval) {
    clearInterval(userInterval)
    intervalIds.delete(chatId)
    updateFileWithId(true, chatId, dataBase)
  }
  getWeather().then((weather) => {
    bot.sendMessage(chatId, weather)
  })
  const intervalId = setInterval(() => {
    getWeather().then((weather) => {
      bot.sendMessage(chatId, weather)
      const time = new Date().getTime()
      intervalIds.set(chatId, { userInterval: intervalId, date: time })
      updateTime(chatId, time)
    })
  }, hoursToMillis(hours))
  const time = new Date().getTime()
  intervalIds.set(chatId, { userInterval: intervalId, date: time })
  updateFileWithId(false, chatId, dataBase, time)
}

export async function RemoveCallbackSubscription(callbackQuery) {
  const chatId = callbackQuery.message.chat.id
  const messageId = callbackQuery.message.message_id

  if (callbackQuery.data === "/cancel") {
    calcelSubscription(chatId)
    bot.deleteMessage(chatId, messageId)
  }
}
export async function RemoveSubscription(msg) {
  const chatId = msg.chat.id

  if (msg.text === "/cancel") {
    calcelSubscription(chatId)
  }
}

async function calcelSubscription(chatId) {
  const userInterval = await findInterval(chatId)
  if (userInterval) {
    clearInterval(userInterval)
    intervalIds.delete(chatId)
    bot.sendMessage(chatId, "You succesfully cancel subscription")
  } else {
    bot.sendMessage(chatId, "You was not subscribed")
  }
  updateFileWithId(true, chatId, dataBase)
}
//// DATA COMMANDS

export function updateTime(userId, time) {
  fs.readFile(dataBase, "utf8", (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    const ids = data.split("\n").filter(Boolean).map(JSON.parse)
    const newIds = ids.map((id) => {
      if (id.id === userId) {
        id.time = time
      }
      return id
    })
    const updatedData = newIds.map(JSON.stringify).join("\n")

    fs.writeFile(dataBase, updatedData, (err) => {
      if (err) {
        console.error(err)
      }
    })
  })
}

export function readDatabase() {
  fs.readFile(dataBase, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err)
      return
    }

    const ids = data
      .split("\n")
      .map((id) => id.trim())
      .filter(Boolean)
      .map((id) => JSON.parse(id))
    ids.forEach((id) => {
      if (new Date().getTime() > id.time + hoursToMillis(1)) {
        startWeather(1, id.id)
      } else {
        setTimeout(() => startWeather(1, id.id), new Date().getTime() - id.time)
      }
    })
  })
}

export function updateFileWithId(remove, userId, filename, time) {
  fs.readFile(filename, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err)
      return
    }

    const ids = data
      .split("\n")
      .map((id) => id.trim())
      .filter(Boolean)
      .map((id) => JSON.parse(id))
    const index = ids.findIndex((id) => id.id === userId)
    if (remove && index !== -1) {
      ids.splice(index, 1)
    } else if (!remove && index === -1) {
      const newId = {
        id: userId,
        time: time,
      }
      ids.push(newId)
    } else {
      return
    }

    const updatedData = ids.map((id) => JSON.stringify(id)).join("\n")

    fs.writeFile(filename, updatedData, (err) => {
      if (err) {
        console.error("Error writing file", err)
      }
    })
  })
}
