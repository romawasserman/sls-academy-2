import axios from "axios"
import { bot, intervalIds } from "./app.js"

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
        console.log(weather)
        resolve(weather)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

function hoursToMillis(hours) {
  const milliseconds = 1000 * 10
  return hours * milliseconds
}

function findInterval(id) {
  if (intervalIds.has(id)) {
    return intervalIds.get(id)
  }else return null
}


export async function startWeather(hours, chatId) {
  const userInterval = await findInterval(chatId)
  if (userInterval) {
    clearInterval(userInterval)
    intervalIds.delete(chatId)
  }
  getWeather().then((weather) => {
    bot.sendMessage(chatId, weather)
  })
  const intervalId = setInterval(() => {
    getWeather().then((weather) => {
      bot.sendMessage(chatId, weather)
    })
  }, hoursToMillis(hours))
  intervalIds.set(chatId, intervalId)
}

export async function getForecast(hours) {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=Zaporizhia&appid=8c9c8abbe2a66956fb288cae439a2fc7&units=metric`)

  let message = 'Weather in Zaporizhia: \n\n'
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
      if (day !== sameDay){
        message += `\n`
        message += `${day}, `;
        message += `${dateValue} `
        message += `${month} \n`
      }
      message += `${hour} : 00, `
      message += `${data.main.temp > 0 ? '+' : ''}${data.main.temp}°C, `;
      message += `Feels like: ${data.main.feels_like > 0 ? '+' : ''}${data.main.feels_like}°C, `;
      message += `${data.weather[0].main}\n`
      sameDay = day
    }
  })
  return message
  } catch (err) {
    console.log('something went wrong ', err)
  }
}

