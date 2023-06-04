import axios from "axios"
import { bot } from "./app.js"

async function getWeather() {
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
  const milliseconds = 1000 * 60 * 60
  return hours * milliseconds
}

export function startWeather(intervalId, hours, chatId) {
  if (intervalId) {
    clearInterval(intervalId)
  }
  getWeather().then((weather) => {
    bot.sendMessage(chatId, weather)
  })
  intervalId = setInterval(() => {
    getWeather().then((weather) => {
      bot.sendMessage(chatId, weather)
    })
  }, hoursToMillis(hours))
}
