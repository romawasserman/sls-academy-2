import fs from 'node:fs'

const filePath = './data.json'

const jsonData = fs.readFileSync(filePath, 'utf8')

const parsedData = JSON.parse(jsonData)

const newData = parsedData.map((data) => {
    const {user : {name : userName, _id : userId}, endDate, startDate} = data
    return {userId, userName,  'vacations' : [{"startDate" : startDate, 'endDate' : endDate}]}
})

const result = mergeVacations(newData)
console.log(JSON.stringify(result, null, 2));

function mergeVacations(array) {
    const unique = {};
  
    for (const obj of array) {
  
      if (unique[obj.userId]) {
        unique[obj.userId].vacations.push(...obj.vacations);
      } else {
        unique[obj.userId] = { ...obj };
      }
    }
    const mergedArray = Object.values(unique);
  
    return mergedArray;
  }
  
