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

const DATA = {
  header: { paragraphs: {} },
  totals: {
    categories: 0,
    nominees: 0,
    unapprovedNominees: 0,
    sections: 0,
    votes: 0,
    voters: 0,
  },
  sections: [],
}

const finalizeData = (sectionResults, categoryResults, nomineeResults) => {
  const SECTIONS = {}
  const CATEGORIES = {}
  const CATEGORIES_IN_SECTIONS = {}
  const SECTION_ORDER = []

  //* Format the data for the sections
  console.log(`\n  1. Formatting sections...`)
  sectionResults.forEach(section => {
    SECTIONS[section.section] = {
      sectionName: section.section,
      nominees: 0,
      votes: section.totalVotes,
      voters: section.voters,
      categories: [],
    }
    CATEGORIES_IN_SECTIONS[section.section] = {}
  })

  //* Format the data for the categories
  console.log(`  2. Formatting categories...`)
  categoryResults.forEach(category => {
    let newCategory = {
      id: parseInt(category.idContest),
      votes: category.totalVotes,
      voters: category.voters,
      type: category.type,
      title: category.title,
      description: category.description,
      nominees: [],
    }
    if (category.label) newCategory.label = category.label
    if (category.fields) {
      if (typeof category.fields === 'string')
        newCategory.fields = JSON.parse(category.fields)
      else newCategory.fields = category.fields
    }
    if (category.collection) newCategory.collection = category.collection
    if (!SECTION_ORDER.includes(category.section))
      SECTION_ORDER.push(category.section)
    CATEGORIES_IN_SECTIONS[category.section][category.idContest] = true
    CATEGORIES[category.idContest] = newCategory
  })

  //* Format the data for the nominees
  console.log(`  3. Formatting nominees...`)
  nomineeResults.forEach(nominee => {
    let nomineeData =
      typeof nominee.data === 'string' ? JSON.parse(nominee.data) : nominee.data
    if (!nomineeData)
      return console.log(
        `Nominee ${nominee.idNomination} has no data. This shouldn't happen.`,
        nominee
      )
    let newNominee = {
      id: nominee.idNomination,
      votes: parseInt(nominee.voteCount),
      ...nomineeData,
    }
    CATEGORIES[nominee.idContest].nominees.push(newNominee)
  })

  //* Add the categories and sections to the final data, then output to file
  console.log(`  4. Formatting total counts and adding placement notations...`)
  Object.entries(CATEGORIES_IN_SECTIONS).forEach(
    ([sectionName, sectionCategories]) => {
      Object.keys(sectionCategories).forEach(categoryId => {
        const category = CATEGORIES[categoryId]

        //* Add "1st", "2nd", and "3rd" placements to appropriate nominees
        const placementOptions = ['1st', '2nd', '3rd']
        let nextPlacement = placementOptions[0]
        let previous = null

        for (const index in category.nominees) {
          if (nextPlacement === undefined) break
          const votes = category.nominees[index].votes
          if (previous === null) {
            category.nominees[index].placement = nextPlacement
            nextPlacement =
              placementOptions[placementOptions.indexOf(nextPlacement) + 1]
          } else {
            if (previous.votes === votes) {
              category.nominees[index].placement = previous.placement
            } else {
              category.nominees[index].placement = nextPlacement
              nextPlacement =
                placementOptions[placementOptions.indexOf(nextPlacement) + 1]
            }
          }
          previous = category.nominees[index]
        }

        SECTIONS[sectionName].categories.push(category)
        SECTIONS[sectionName].nominees += category.nominees.length
      })
      DATA.totals.categories += SECTIONS[sectionName].categories.length
      DATA.totals.nominees += SECTIONS[sectionName].nominees
    }
  )
  DATA.sections = SECTION_ORDER.map(sectionName => SECTIONS[sectionName])
  DATA.totals.sections = DATA.sections.length

  fs.writeFileSync(
    `./${currentYear}-results-constructed.json`,
    JSON.stringify(DATA, null, 2)
  )
  console.log(
    `\nData has been formatted and written to file!\n    > ./${currentYear}-results-constructed.json`
  )
  process.exit()
}

const selectNominees = (sections, categories) => {
  const approvedOnly = !process.env.GET_UNVETTED
  console.log(
    `\nGetting nominee data... ${
      approvedOnly ? 'Approved entries only' : 'Unvetted entries included'
    }`
  )

  db.query(
    `
    SELECT * FROM (
      SELECT v.idContest, v.idNomination, SUM(v.idNomination = v.idNomination) as voteCount, n.data
      FROM votes v
      INNER JOIN nominations n ON n.idNomination = v.idNomination
      GROUP BY v.idContest, v.idNomination
  
      UNION
  
      SELECT e.idContest, e.idNomination, 0 as voteCount, n.data
      FROM entries e
      INNER JOIN nominations n ON n.idNomination = e.idNomination
      WHERE e.status IN (${approvedOnly ? '1' : '1, 2, 0'})
      AND e.idNomination NOT IN (
        SELECT votes.idNomination FROM votes
        WHERE votes.idContest = e.idContest
      )
      GROUP BY e.idContest, e.idNomination
  
      ORDER BY idContest, voteCount DESC, idNomination
    ) d
  `,
    (error, results, fields) => {
      if (error) {
        console.log(`Failed to fetch nominee data!`)
        throw error
      }

      console.log(`Fetched nominee data: ${results.length} nominees!`)
      console.log(`\nFirst nominee:`, results[0])
      finalizeData(sections, categories, results)
    }
  )
}

const selectCategories = sections => {
  console.log(`\nGetting category data...`)

  db.query(
    `
    SELECT votes.idContest, title, type, description, section, label, fields, collection, 
      COUNT(DISTINCT idMember) as voters, COUNT(idMember) as totalVotes
    FROM votes
    INNER JOIN contests on votes.idContest = contests.idContest
    GROUP BY votes.idContest
  `,
    (error, results, fields) => {
      if (error) {
        console.log(`Failed to fetch category data!`)
        throw error
      }

      console.log(`Fetched category data: ${results.length} categories!`)
      console.log(`\nFirst category:`, results[0])
      selectNominees(sections, results)
    }
  )
}

const selectSections = () => {
  console.log(`\nGetting section data...`)

  db.query(
    `
    SELECT section, COUNT(DISTINCT v.idMember) as voters, COUNT(v.idMember) as totalVotes
    FROM contests c
    INNER JOIN votes v ON v.idContest = c.idContest
    GROUP BY section
  `,
    (error, results, fields) => {
      if (error) {
        console.log(`Failed to fetch section data!`)
        throw error
      }

      console.log(`Fetched section data: ${results.length} sections!`)
      console.log(`\nSections are:`, results)
      selectCategories(results)
    }
  )
}

const selectTotals = () => {
  console.log(`\nGetting totals data...`)

  db.query(
    `
    SELECT COUNT(*) as totalVotes, COUNT(DISTINCT idMember) as voters
    FROM votes
  `,
    (error, results, fields) => {
      if (error) {
        console.log(`Failed to fetch totals data!`)
        throw error
      }

      const totals = results[0]
      console.log(`Fetched totals data!`, totals)
      DATA.totals.voters = totals.voters
      DATA.totals.votes = totals.totalVotes
      DATA.totals.unapprovedNominees = totals.totalEntries
      selectSections()
    }
  )
}

selectTotals()
