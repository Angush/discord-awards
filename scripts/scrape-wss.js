// NOTE: This script requires the following dev dependencies, and won't work outside a dev environment.
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const fs = require('fs')

const baseURL = `https://wormstorysearch.com`
const shortenURL = url =>
  url
    .replace(/(\.com)\/threads\/\S+\.\d+\/\S*post-(\d+)\/?$/i, '$1/posts/$2')
    .replace(/(\.com)\/threads\/\S+\.(\d+)\/?$/i, '$1/threads/$2')
    .replace(/(\.fanfiction.net\/s\/\d+)(\/?\d+)?\/\S+$/i, '$1')
    .replace(/(archiveofourown\.org\/)works\/\d+\/(chapters\/\d+)\/?$/i, '$1$2')
    .replace(/(docs\.google\.\w+\/\S+)\/(edit\S+)?\/?$/i, '$1')
    .replace(/\/threadmarks\/?$/i, '')

const currentYear = new Date().getFullYear()
const endOfPreviousYear = currentYear - 2
const pageOneURL = process.env.INCLUDE_NEW_YEAR_UPDATES
  ? `/?updated_after_filter=12%2F31%2F${endOfPreviousYear}&page=1&limit=20&sort=stories.story_updated_at&direction=desc&searching=true`
  : `/?updated_after_filter=12%2F31%2F${endOfPreviousYear}&updated_before_filter=01%2F01%2F${currentYear}&page=1&limit=20&sort=stories.story_updated_at&direction=desc&searching=true`

const pageLoadInterval = process.env.INTERVAL ?? 1000 // In milliseconds.
const cleanTitles = process.env.CLEAN ?? false

let results = []
let fetchedNSFWFics = process.env.NSFW ?? null // Set to false to enable NSFW fic scraping. Anything else will disable. Use NSFW=false when running to set it as a temporary environment variable instead of editing this file.
let totalPages = 0

const cleanTitle = title => {
  const cleanedTitle = title.replace(/\s*(\([^\(\)]*\)|\[[^\[\]]*\])/gi, '')
  return cleanedTitle.trim()
}

const cleanExistingTitles = () => {
  const cleanedPath = `${currentYear - 1}-fic-options-cleaned.json`
  const originalPath = `${currentYear - 1}-fic-options.json`
  const existing = JSON.parse(fs.readFileSync(originalPath))
  console.log(`Cleaning titles for ${existing.length} fics`)
  const cleaned = existing.map(item => {
    let newTitle = cleanTitle(item.title)
    console.log(`CLEANED: ${newTitle} —— ORIGINAL: ${item.title}`)
    item.title = newTitle
    return item
  })
  fs.writeFileSync(cleanedPath, JSON.stringify(cleaned))
  console.log(`\nCleaned ${existing.length} titles`)
  console.log(`Loaded fics from ${originalPath}`)
  console.log(`Saved cleaned fics in ${cleanedPath}`)
}

const loadPage = async (url, isNSFW = false) => {
  let res = await fetch(`${baseURL}${url}`)
  let pageData = await res.text()

  let $ = cheerio.load(pageData)
  let nextPageButton = $(`.footer ul.pagination li`).last()
  let nextPageURL = nextPageButton.hasClass('disabled')
    ? null
    : nextPageButton.children().last().prop('href')

  if (totalPages === 0) {
    const pageCount = $(`ul.pagination li:nth-last-child(2)`).text().trim()
    const storiesCount = $(`h1.page-title small`).text().match(/\d+/)?.[0]
    console.log(
      `Found ${pageCount} pages and ${storiesCount} total fics. Scraping now...\n`
    )
  }

  $(`tbody.rows tr td.title`).each((i, elem) => {
    let row = cheerio.load($(elem).html())
    let text = row.text().trim()

    let title = text.replace(/\n.+/s, '').trim()
    let author = text.match(/^\s*by\s+(.+)\s+on\s*/im)[1].trim()
    let links = []

    row(`a`)
      .slice(1)
      .each((aI, aElem) => {
        let link = $(aElem).prop('href')
        let shortened = shortenURL(
          link.replace(/\/(threadmarks|navigate)$/, '')
        )
        links.push(shortened.trim())
      })

    if (cleanTitles && cleanTitles != false) {
      title = cleanTitle(title)
    }
    let result = { title, author, links }
    if (isNSFW) result.nsfw = true
    results.push(result)
  })

  totalPages++
  let pageNumber = url.match(/page=(\d+)/i)[1]
  console.log(
    `Finished scraping${isNSFW ? ' NSFW' : ''} Page ${pageNumber}... ${
      results.length
    } fics stored...`
  )

  if (nextPageURL) {
    //! Fetch the next page of results.
    setTimeout(() => {
      loadPage(nextPageURL, isNSFW)
    }, pageLoadInterval)
  } else {
    if (fetchedNSFWFics === false) {
      //! If fetching NSFW fics is enabled, do that before saving.
      fetchedNSFWFics = true
      console.log(`\n= STARTING TO SCRAPE NSFW FICS ONLY =`)
      setTimeout(() => {
        loadPage(`${pageOneURL}&is_nsfw_eq=true`, true)
      }, pageLoadInterval)
    } else {
      //! Save data to file if we're all finished.
      let filename = `${currentYear - 1}-fic-options.json`
      console.log(
        `\n= FINISHED SCRAPING ${results.length} FICS OVER ${totalPages} PAGES =`
      )
      console.log(`= NOW SAVING DATA TO FILE: ${filename} =`)
      fs.writeFile(`./${filename}`, JSON.stringify(results), () =>
        console.log(`= DATA HAS BEEN SAVED! =`)
      )
    }
  }
}

if (cleanTitles?.toLowerCase?.() === 'only') {
  cleanExistingTitles()
} else {
  if (process.env.INCLUDE_NEW_YEAR_UPDATES) {
    console.log(`= SCRAPING FICS UPDATED AFTER ${endOfPreviousYear} =`)
  } else {
    console.log(
      `= SCRAPING FICS UPDATED BETWEEN ${endOfPreviousYear} and ${currentYear} =`
    )
  }
  loadPage(pageOneURL)
}
