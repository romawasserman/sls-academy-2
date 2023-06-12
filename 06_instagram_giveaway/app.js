import { readFile as _readFile } from "fs"
import { join } from "path"

function readFile(path) {
  return new Promise((resolve, reject) => {
    _readFile(path, "utf8", (err, data) => {
      if (err) {
        reject(err)
      } else {
        const users = data.split("\n")
        resolve(users)
      }
    })
  })
}

async function uniqueValues() {
  const usernamesTen = {}
  let numberOfTens = 0
  let existInAll = 0

  for (let i = 0; i < 20; i++) {
    const filePath = join("data", `out${i}.txt`)
    const allUsers = await readFile(filePath)
    const users = new Set(allUsers)


    for (const user of users) {
      usernamesTen[user] = (usernamesTen[user] || 0) + 1
      if (usernamesTen[user] === 10) {
        numberOfTens++
      }
      if (usernamesTen[user] === 20) {
        existInAll++
      }
    }
  }
  return `Total unique names : ${
    Object.keys(usernamesTen).length
  } \nNames found in each file : ${existInAll} \nNames found 10 or more times : ${numberOfTens} `
}

const start = new Date().getTime()
async function kek() {
  const kekw = await uniqueValues()
  const end = new Date().getTime()
  console.log(kekw, "\nTime to finish:", end - start)
}
kek()
