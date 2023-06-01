import { createInterface } from "readline"
import {
  sortByAlphabet,
  divideNumsAndWords,
  sortFromGreatToSmall,
  sortFromSmallToGreat,
  sortByLength,
  uniqueWords,
  allUniqueWords
} from "./calculations.js"

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

function askData() {
  rl.question(
    "Please enter words or digits dividing them by space : ",
    (data) => {
      if (data === "exit") {
        console.log("Good bye! Hope to see you again!")
        rl.close()
        return
      } else {
        console.log("You entered:", data)
      }

      askForOptions(data)
    }
  )
}

function askForOptions(data) {
  rl.question(
    "What should we do with this data?\n1.Sort words alphabetically\n2.Show numbers from lesser to greater\n3.Show numbers from bigger to smaller\n4.Display words in ascending order by number of letters in the word\n5.Show only unique words\n6.Display only unique values from the set of words and numbers entered by the user\nTo exit the program enter 'exit'",
    (option) => {
      const { wordsArray, numsArray } = divideNumsAndWords(data)
      if (option === "exit") {
        console.log("Good bye! Hope to see you again!")
        rl.close()
        return
      }
      else if (option === "1") {
        console.log(sortByAlphabet(wordsArray))
        askData()
      }
      else if (option === "2") {
        console.log(sortFromSmallToGreat(numsArray))
        askData()
      }
      else if (option === "3") {
        console.log(sortFromGreatToSmall(numsArray))
        askData()
      }
      else if (option === '4') {
        console.log(sortByLength(wordsArray))        
        askData()

      }
      else if (option === '5') {
        console.log(uniqueWords(wordsArray))
        askData()
      }
      else if (option === '6') {
        console.log(allUniqueWords(wordsArray, numsArray));
        askData();
      }else {
        console.log("Invalid option. Please choose a number from 1 to 6.");
        askForOptions(data)
      }
    }
  )
}
askData()
