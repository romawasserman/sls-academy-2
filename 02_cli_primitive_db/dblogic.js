import fs from "node:fs"
import { promisify } from "node:util"

const appendFilePromise = promisify(fs.appendFile)
export const readFilePromise = promisify(fs.readFile)

export async function findPerson(name) {
  return readFilePromise("data.txt", "utf8")
    .then((data) => {
      const lines = data.trim().split("\n")

      const users = lines.map((line) => JSON.parse(line))
      const foundUser = users.find(
        (user) => name.name.toLowerCase() === user.name.toLowerCase()
      )

      return foundUser
    })
    .catch((err) => {
      console.error(err)
      return null
    })
}

export function appendPerson(data) {
  appendFilePromise("data.txt", JSON.stringify(data) + "\n")
    .catch((err) => {
      console.error(err)
    })
}
