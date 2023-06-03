import inquirer from "inquirer"
import { findPerson, appendPerson, readFilePromise } from "./dblogic.js"
import {
  loginQuestions,
  dbQuestions,
  generalQuestions,
  searchQuestions,
} from "./questions.js"

function app() {
  inquirer.prompt(loginQuestions).then((name) => {
    if (name.name) {
      inquirer.prompt(generalQuestions).then((info) => {
        const fullInfo = { ...name, ...info }
        appendPerson(fullInfo)
        app()
      })
    } else {
      inquirer.prompt(dbQuestions).then((dbName) => {
        if (dbName.search) {
          readFilePromise("data.txt", "utf8")
          .then((data) => {
          const array = []
          const lines = data.trim().split("\n")
          lines.forEach((line) => {
            array.push(JSON.parse(line))
          })
          console.log(array);
        }).then(() => {
          inquirer.prompt(searchQuestions).then(async (username) => {
            const result = await findPerson(username)
            if (result) {
              console.log('User found: \n', result)
            } else {
              console.log("We cant find user with this name")
            }
          })
        })
        } else {
          console.log("Bye! Hope to see you again")
        }
      })
    }
  })
}
app()
