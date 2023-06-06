import axios from "axios"

const endpoints = [
  "https://jsonbase.com/sls-team/json-793",
  "https://jsonbase.com/sls-team/json-955",
  "https://www.youtube.com/",
  "https://jsonbase.com/sls-team/json-231",
  "https://jsonbase.com/sls-team/json-931",
  "https://jsonbase.com/sls-team/json-93",
  "https://jsonbase.com/sls-team/json-342",
  "https://jsonbase.com/sls-team/json-770",
  "https://jsonbase.com/sls-team/json-491",
  "https://jsonbase.com/sls-team/json-281",
  "https://jsonbase.com/sls-team/json-718",
  "https://jsonbase.com/sls-team/json-310",
  "https://jsonbase.com/sls-team/json-806",
  "https://jsonbase.com/sls-team/json-469",
  "https://jsonbase.com/sls-team/json-258",
  "https://jsonbase.com/sls-team/json-516",
  "https://jsonbase.com/sls-team/json-79",
  "https://jsonbase.com/sls-team/json-706",
  "https://jsonbase.com/sls-team/json-521",
  "https://jsonbase.com/sls-team/json-350",
  "https://jsonbase.com/sls-team/json-64",
]

async function start() {
  try {
    let trueValues = 0
    let falseValues = 0
    for (const url of endpoints) {
      let counter = 0
      while (counter < 3) {
        try {
          let response = await axios.get(url)
        //   console.log(response.data)
          const flag = findIsDone(response.data)
          if (flag === true) {
            trueValues++
            console.log(`[Success] ${url}: isDone - ${flag}`)
          } else if (flag === false) {
            falseValues++
            console.log(`[Success] ${url}: isDone - ${flag}`)
          } else {
            // console.log(`No IsDone `)
          }

          break
        } catch (error) {
          counter++
        }
      }
      if (counter === 3) {
        console.log(`[Fail] ${url}: The endpoint is unavailable`)
      }
    }
    console.log(
      `Found True values: ${trueValues},\nFound False values: ${falseValues} `
    )
  } catch (error) {
    console.log("Error:", error)
  }
}


start()

function findIsDone(object) {
  for (const key in object) {
    if (key === "isDone") {
      return object[key]
    }
    if (typeof object[key] === "object" && object[key] !== null) {
      const result = findIsDone(object[key])
      if (result !== null) {
        return result
      }
    }
  }
  return null
}


