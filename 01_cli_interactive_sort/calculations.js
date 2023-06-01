export function divideNumsAndWords(str) {
  const wordsArray = []
  const numsArray = []

  const newArr = str.split(" ")

  newArr.forEach((word) => {
    const hasSymbols = Array.from(word).every((letter) => {
      return letter.toLowerCase() === letter.toUpperCase()
    })
    if (word) {
      if (hasSymbols) {
        numsArray.push(word)
      } else {
        wordsArray.push(word)
      }
    }
  })

  return {
    wordsArray,
    numsArray,
  }
}
export function sortByAlphabet(arr) {
  return arr.sort()
}

export function sortFromSmallToGreat(arr) {
  return arr.sort((a, b) => a - b)
}

export function sortFromGreatToSmall(arr) {
  return arr.sort((a, b) => b - a)
}

export function sortByLength(arr) {
  return arr.sort((a, b) => a.length - b.length)
}

export function uniqueWords(arr) {
  return new Set([...arr])
}

export function allUniqueWords(arr1, arr2) {
  return new Set([...arr1, ...arr2])
}
