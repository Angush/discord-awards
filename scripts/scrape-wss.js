const fetch = require('node-fetch')
const cheerio = require('cheerio')
const fs = require('fs')

const baseURL = `https://wormstorysearch.com`
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const shortenURL = url => url
  .replace(/(\.com)\/threads\/\S+\.\d+\/\S*post-(\d+)$/i, '$1/posts/$2')
  .replace(/(\.com)\/threads\/\S+\.(\d+)\/?$/i, '$1/threads/$2')
  .replace(/(\.fanfiction.net\/s\/\d+(\/?\d+)?)\/\S+$/i, '$1')
  .replace(/(archiveofourown\.org\/)works\/\d+\/(chapters\/\d+)$/i, '$1$2')
  .replace(/(docs\.google\.\w+\/\S+)\/(edit\S+)?$/i, '$1')

const currentYear = new Date().getFullYear()
const endOfPreviousYear = currentYear - 2
const pageLoadInterval = 1000 // milliseconds

let results = []
let fetchedNSFWFics = null // Set to false to enable NSFW fic scraping. Anything else will disable.
let totalPages = 0

const loadPage = async (url, isNSFW = false) => {
  let res = await fetch(`${baseURL}${url}`)
  let pageData = await res.text()

  let $ = cheerio.load(pageData)
  let nextPageButton = $(`.footer ul.pagination li`).last()
  let nextPageURL = nextPageButton.hasClass('disabled') ? null : nextPageButton.children().last().prop('href')

  $(`tbody.rows tr td.title`).each((i, elem) => {
    let row = cheerio.load($(elem).html())
    let text = row.text().trim()

    let title = text.replace(/\n.+/s, '').trim()
    let author = text.match(/^\s*by\s+(.+)\s+on\s*/mi)[1].trim()
    let links = []

    row(`a`).slice(1).each((aI, aElem) => {
      let link = $(aElem).prop('href')
      let shortened = shortenURL(link.replace(/\/(threadmarks|navigate)$/, ''))
      links.push(shortened.trim())
    })

    let result = { title, author, links }
    if (isNSFW) result.nsfw = true
    results.push(result)
  })

  totalPages++
  let pageNumber = url.match(/page=(\d+)/i)[1]
  console.log(`Finished scraping${isNSFW ? ' NSFW' : ''} Page ${pageNumber}... ${results.length} fics stored...`)

  if (nextPageURL) {
    //! Fetch the next page of results
    setTimeout(() => {
      loadPage(nextPageURL, isNSFW)
    }, pageLoadInterval)
  } else {
    if (fetchedNSFWFics === false) {
      //! If fetching NSFW fics is enabled, do that before saving
      fetchedNSFWFics = true
      console.log(`\n= STARTING TO SCRAPE NSFW FICS ONLY =`)
      setTimeout(() => {
        loadPage(`/?updated_after_filter=12%2F31%2F${endOfPreviousYear}&updated_before_filter=01%2F01%2F${currentYear}&is_nsfw_eq=true&page=1&limit=20&sort=stories.story_updated_at&direction=desc&searching=true`, true)
      }, pageLoadInterval)
    } else {
      //! Save data to file if we're all finished
      let filename = `${currentYear - 1}-fic-options.json`
      console.log(`\n= FINISHED SCRAPING ${results.length} FICS OVER ${totalPages} PAGES =`)
      console.log(`= NOW SAVING DATA TO FILE: ${filename} =`)
      fs.writeFile(`./${filename}`, JSON.stringify(results), () => console.log(`= DATA HAS BEEN SAVED! =`))
    }
  }
}

// loadPage(`https://wormstorysearch.com/`)
console.log(`= SCRAPING FICS UPDATED BETWEEN ${endOfPreviousYear} and ${currentYear} =\n`)
loadPage(`/?updated_after_filter=12%2F31%2F${endOfPreviousYear}&updated_before_filter=01%2F01%2F${currentYear}&page=1&limit=20&sort=stories.story_updated_at&direction=desc&searching=true`)
