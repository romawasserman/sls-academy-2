import { readFile as _readFile } from "fs"
import { join } from "path"

function readFile(path) {
  return new Promise((resolve, reject) => {
    _readFile(path, "utf8", (err, data) => {
      if (err) {
        reject(err)
      } else {
        const users = data.split("\n").filter(Boolean)
        resolve(users)
      }
    })
  })
}

async function uniqueValues() {
  const usernamesSet = new Set()
  let allUsernamesSet
  const usernamesTen = new Map()

  for (let i = 0; i < 20; i++) {
    const filePath = join("data", `out${i}.txt`)
    const allUsers = await readFile(filePath)
    const temp = new Set(allUsers)
    const users = Array.from(temp)

    for (const user of users) {
      usernamesSet.add(user)
      if (!usernamesTen.has(user)) {
        usernamesTen.set(user, 1)
      } else {
        usernamesTen.set(user, usernamesTen.get(user) + 1)
      }
    }

    if (i === 0) {
      allUsernamesSet = new Set(users)
    } else {
      allUsernamesSet = new Set(
        users.filter((username) => allUsernamesSet.has(username))
      )
    }
  }
  let numberOfTens = 0
    for (const [user, times] of usernamesTen) {
      if (times >= 10) {
        numberOfTens++
      }
    }
//   console.log(usernamesSet.size)
//   console.log(allUsernamesSet.size)
//   console.log(numberOfTens)
  return `Total unique names : ${usernamesSet.size} \nNames found in each file : ${allUsernamesSet.size} \nNames found 10 or more times : ${numberOfTens} `
}

const start = new Date().getTime()
async function kek() {
  const kekw = await uniqueValues()
  const end = new Date().getTime()
  console.log(kekw,"\nTime to finish:", end - start)
}
kek()


