const fs = require('fs')
const currentYear = process.env.YEAR ? process.env.YEAR : new Date().getFullYear() - 1
const preferredPath = `${__dirname}/${currentYear}-results-constructed.json`
const resultsPath = `${__dirname}/../src/json/results/${currentYear}.json`
console.log(`Attempting to read from "${resultsPath}"`)

const readFile = () => {
  let path = process.env.JSON_PATH
  if (path && fs.existsSync(path)) return [path, fs.readFileSync(path)]
  if (fs.existsSync(preferredPath)) return [preferredPath, fs.readFileSync(preferredPath)]
  if (fs.existsSync(resultsPath)) return [resultsPath, fs.readFileSync(resultsPath)]
}

const [resultsFilePath, resultsFile] = readFile()
const results = resultsFile ? JSON.parse(resultsFile) : null
if (!results) {
  let path = process.env.JSON_PATH
  console.log(`Failed to read results data! I found no file at${path ? ` your specified path ("${path}"), or at` : ''} "${preferredPath}" or "${resultsPath}"! Please make sure a valid JSON file exists. You might want to run ./construct-results.js first.`)
  process.exit()
}
console.log(`Loaded "${resultsFilePath}"`)

const DATA = {}
let categories = []
results.sections.forEach(section => {
  categories = [...categories, ...section.categories]
})
console.log(`Found ${categories.length} categories`)

const accoladeName = process.env.ACCOLADE_NAME || `Cauldron Awards ${currentYear}`
const accolade = accoladeName.toLowerCase()
console.log(`Creating assignment data for accolade: "${accoladeName}"`)

const addNomineeToData = (type, length, category, nominee) => {
  let creator = nominee.author || nominee.artist || nominee.owner || nominee.name
  if (!creator) return
    
  let text = ''
  let title = category.title.replace(/Favou?rite/, 'Fav.')
  // let title = category.title.replace(/Favou?rite\s+/, '')
  if (type === "gold") text = `🏅 \`1st\`: ${title}`
  if (type === "silver") text = `🥈 \`2nd\`: ${title}`
  if (type === "bronze") text = `🥉 \`3rd\`: ${title}`
  if (length > 1) text.replace(/(1st|2nd|3rd)/, 'Joint $1')

  if (!DATA[creator]) DATA[creator] = {
    [accolade]: 0,
    PAYLOAD_DATA: {
      [accolade]: {
        categories: []
      }
    }
  }

  DATA[creator][accolade]++
  // let existingAccolade = 
  // if (DATA[creator].PAYLOAD_DATA[accolade].includes(text))
  DATA[creator].PAYLOAD_DATA[accolade].categories.push(text)
}

categories.forEach(category => {
  const { nominees } = category
  if (!nominees || nominees.length === 0) return

  const golds = nominees.filter(e => e.votes === nominees[0].votes)
  const silvers = !!nominees[golds.length]
      ? nominees.filter(e => e.votes === nominees[golds.length].votes)
      : []
  const bronzes = !!nominees[golds.length + silvers.length]
      ? nominees.filter(e => e.votes === nominees[golds.length + silvers.length].votes)
      : []

  console.log(`[${golds.length} gold, ${silvers.length} silver, ${bronzes.length} bronze] — category ${category.id}: ${category.title}`)

  golds.forEach(nominee => addNomineeToData("gold", golds.length, category, nominee))
  silvers.forEach(nominee => addNomineeToData("silver", silvers.length, category, nominee))
  bronzes.forEach(nominee => addNomineeToData("bronze", bronzes.length, category, nominee))
})

for (const user in DATA) {
  const payloadData = DATA[user].PAYLOAD_DATA[accolade].categories
  let repeatedCategories = {}
  let newPayloadData = []

  payloadData.forEach((userAccolade, index) => {
    if (repeatedCategories[userAccolade]) return
    let filtered = payloadData.filter((current, i) => index !== i && userAccolade === current)
    if (filtered.length > 0) {
      newPayloadData.push(`${userAccolade} \`[x${filtered.length + 1}]\``)
      repeatedCategories[userAccolade] = true
    } else {
      newPayloadData.push(userAccolade)
    }
  })

  DATA[user].PAYLOAD_DATA[accolade].categories = newPayloadData
}

console.log(`Created accolades for ${Object.keys(DATA).length} users`)
fs.writeFileSync(`./${currentYear}-accolade-assignments.json`, JSON.stringify(DATA, null, 2))
console.log(`\nData has been formatted and written to file!\n    > ./${currentYear}-accolade-assignments.json`)
process.exit()