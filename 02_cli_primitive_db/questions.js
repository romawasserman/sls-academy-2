export const loginQuestions = [
  {
    type: "input",
    name: "name",
    message: "Enter the user's name. To exit press ENTER",
    validate(value) {
      const pass = value.match(/^[a-zA-Z]+$/)
      if (pass || value === "") {
        return true
      }

      return "Please enter a valid name"
    },
  },
]

export const dbQuestions = [
  {
    type: "confirm",
    name: "search",
    message: "Do you want to search database?",
    default: false,
  },
]
export const generalQuestions = [
  {
    type: "list",
    name: "gender",
    message: "What is your gender?",
    choices: ["Male", "Female"],
  },
  {
    type: "input",
    name: "age",
    message: "How old are you",
    validate(value) {
      const valid = !isNaN(parseFloat(value))
      return valid || "Please enter a number"
    },
    filter(value) {
      if (!isNaN(parseFloat(value))) {
        return Number(value)
      }
      return ""
    },
  },
]

export const searchQuestions = [
  {
    type: "input",
    name: "name",
    message: "Enter name that you looking for",
    validate(value) {
      const pass = value.match(/^[a-zA-Z]+$/)
      if (pass || value === "") {
        return true
      }

      return "Please enter a valid name"
    },
  },
]
