import mysql from 'mysql2'
import fs from 'fs'

if (!process.env.SQL_URL) {
  if (
    !process.env.HOST ||
    !process.env.USER ||
    !process.env.PASSWORD ||
    !process.env.DB
  ) {
    console.log(`You need to provide an SQL database URL in the environment, as "SQL_URL"\nYou can set it when you run the script like so:
    > SQL_URL=URLHERE node ./construct-results.js
    
Alternatively, provide these four env variables instead: HOST, USER, PASSWORD, DB`)
    process.exit()
  }
}

const currentYear = process.env.YEAR
  ? parseInt(process.env.year)
  : new Date().getFullYear() - 1
const db = mysql.createConnection(
  process.env.SQL_URL || {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
  }
)

const DATA = {}

db.query(
  `
  SELECT 
    CONCAT("'", votes.idMember, "'") as idUser,
    votes.idContest, votes.idNomination, status
  FROM votes
  LEFT JOIN entries 
    ON entries.idNomination = votes.idNomination
    AND entries.idContest = votes.idContest
  WHERE status = 1
`,
  (error, results, fields) => {
    if (error) {
      console.log(`Failed to fetch votes data`)
      throw error
    }

    console.log(`Fetched data for ${results.length} votes`)
    results.forEach(vote => {
      let idUser = vote.idUser.replace(/^[']|[']$/g, '')
      if (!DATA[idUser]) DATA[idUser] = {}
      DATA[idUser][`c${vote.idContest}_e${vote.idNomination}`] = 1
    })

    fs.writeFileSync(
      `./${currentYear}-vote-history-constructed.json`,
      JSON.stringify(DATA, null, 2)
    )
    console.log(
      `\nData has been formatted and written to file!\n    > ./${currentYear}-vote-history-constructed.json`
    )
    process.exit()
  }
)
