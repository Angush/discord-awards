import React, { useState, useEffect, useCallback } from 'react'
import makeSafeForURL from '../functions/makeSafeForURL'
import LoadingIndicator from '../components/util/LoadingIndicator'
import SelectAnotherYear from '../components/results/SelectAnotherYear'
import LinkedCategory from '../components/results/LinkedCategory'
import AllResults from '../components/results/AllResults'
import { Router, Link } from '@reach/router'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import PageHelmet from '../components/util/PageHelmet'

const ResultsPage = ({ userData, years, year }) => {
  const [yearProper, setYearProper] = useState(year)
  const [userCategoryVotes, setUserCategoryVotes] = useState({})
  const [lightboxData, setLightboxData] = useState(null)
  const [userVotes, setUserVotes] = useState({})
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [toc, setTOC] = useState([])
  const [latest] = useState(
    typeof year === 'string' && year.toLowerCase().trim() === 'latest'
  )

  useEffect(() => {
    const controller = new AbortController()
    const normalized = latest ? years[0] : year
    setYearProper(normalized)

    if (!years.includes(normalized)) {
      setLoading(false)
      return
    }
    window
      .fetch(`https://cauldron.angu.sh/api/votes/${normalized}`, {
        credentials: 'include',
        signal: controller.signal,
      })
      .then(response => {
        if (response.status === 404) return {}
        return response.json()
      })
      .then(resData => {
        // convert userVotes to a list of category IDs for easy checking
        let voteIDs = {}
        let replacementRegex = /c|_e\d+/g
        for (const key in resData) {
          let categoryID = key.replace(replacementRegex, '')
          if (voteIDs[categoryID] >= 1) voteIDs[categoryID] += 1
          else voteIDs[categoryID] = 1
        }
        setUserCategoryVotes(voteIDs)
        setUserVotes(resData)
      })
      .catch(console.error)

    import(
      /* webpackChunkName: "Results[request]" */ `../json/results/${normalized}.json`
    )
      .then(yearResults => {
        setData(yearResults.default)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })

    return () => controller.abort()
  }, [years, year, latest])

  useEffect(() => {
    if (!data) return
    let contents = []
    data.sections.forEach(s => {
      contents.push({
        text: `${s.sectionName} Categories`,
        anchor: `#${makeSafeForURL(s.sectionName)}`,
        children: s.categories.map(c => {
          return {
            text: c.title,
            anchor: `#${makeSafeForURL(c.title)}`,
          }
        }),
      })
    })
    setTOC(contents)
  }, [data])

  useEffect(() => {
    document.body.classList.add(`no-x-overflow`)
    return () => document.body.classList.remove(`no-x-overflow`)
  }, [])

  //= Open lightbox for image
  const lightboxHandler = useCallback(
    event => {
      const findItem = id => {
        let itemToFind
        const categoryId = parseInt(id.match(/c(?<id>\d+)/).groups.id)
        const nomineeId = parseInt(id.match(/e(?<id>\d+)/).groups.id)
        for (const section of data.sections) {
          if (itemToFind) break
          const categories = section.categories
          for (const category of categories) {
            if (itemToFind) break
            if (category.id === categoryId) {
              for (const nominee of category.nominees) {
                if (nominee.id === nomineeId) {
                  itemToFind = nominee
                  break
                }
              }
            }
          }
        }
        return itemToFind
      }

      // handle clicks on card images (for opening lightboxes)
      let classes = Object.values(event.target.classList)
      if (
        event.target.tagName === 'IMG' &&
        !classes.includes('non-expandable-img') &&
        classes.some(c => c.match(/result-img/))
      ) {
        event.preventDefault()
        let { id } = event.target
        const clicked = findItem(id)
        const srcs = []
        if (!clicked) return
        if (clicked.url) srcs.push(clicked.url)
        if (clicked.image) srcs.push(clicked.image)
        if (clicked.extraURLs) clicked.extraURLs.forEach(url => srcs.push(url))
        if (clicked.links) clicked.links.forEach(url => srcs.push(url))
        setLightboxData({
          ...clicked,
          id,
          srcs: srcs.filter(url => !!url),
          index: 0,
          total: srcs.length,
        })
      }
    },
    [data]
  )

  useEffect(() => {
    window.addEventListener('click', lightboxHandler)
    return () => window.removeEventListener('click', lightboxHandler)
  }, [lightboxHandler])

  const pageMetadata = (
    <PageHelmet
      meta={{
        description: `Results for the ${year} Cauldron Awards.`,
        title: `${year} Results - Cauldron Awards`,
      }}
    />
  )

  if (loading)
    return (
      <>
        {pageMetadata}
        <LoadingIndicator className='fade-rise'>
          <h4>Just a moment!</h4>
          <h6 className='text-muted'>
            We're loading the {latest ? 'latest' : yearProper} results for you.
          </h6>
          <SelectAnotherYear />
        </LoadingIndicator>
      </>
    )

  if (!data)
    return (
      <div className='result-years fade-rise'>
        {pageMetadata}
        <h4>Year not found!</h4>
        <h4>
          <small className='text-muted'>
            I don't have any results for the year you were looking for. Sorry!
          </small>
        </h4>
        <Link to='/results'>View years with available results.</Link>
      </div>
    )

  const total = !lightboxData ? null : lightboxData.total
  const nextIndex = !lightboxData ? null : (lightboxData.index + 1) % total
  const prevIndex = !lightboxData
    ? null
    : (lightboxData.index + total - 1) % total

  return (
    <>
      <PageHelmet
        meta={{
          description: data.totals
            ? `Results for the ${year} Cauldron Awards! With ${data.totals.nominees} entries across ${data.totals.categories} categories, and ${data.totals.votes} total votes.`
            : `Results for the ${year} Cauldron Awards.`,
          title: `${year} Results - Cauldron Awards`,
        }}
      />
      {lightboxData && (
        <Lightbox
          reactModalStyle={{ overlay: { zIndex: 1100 } }}
          mainSrc={lightboxData.srcs[lightboxData.index]}
          nextSrc={total > 1 ? lightboxData.srcs[nextIndex] : null}
          prevSrc={total > 1 ? lightboxData.srcs[prevIndex] : null}
          onCloseRequest={() => setLightboxData(null)}
          onMoveNextRequest={() =>
            setLightboxData({ ...lightboxData, index: nextIndex })
          }
          onMovePrevRequest={() =>
            setLightboxData({ ...lightboxData, index: prevIndex })
          }
          imageTitle={
            total > 1 && `Image #${lightboxData.index + 1} of ${total}.`
          }
          // imageCaption=''
          // ^ Could say "you voted for this" or give vote stats here?
        />
      )}
      <div className='results left-indent-container'>
        <Router>
          <AllResults
            default
            toc={toc}
            data={data}
            year={yearProper}
            setTOC={setTOC}
            userData={userData}
            userVotes={userVotes}
            userCategoryVotes={userCategoryVotes}
          />
          <LinkedCategory
            path='/:slug'
            data={data}
            year={yearProper}
            userData={userData}
            userVotes={userVotes}
            userCategoryVotes={userCategoryVotes}
          />
        </Router>
      </div>
    </>
  )
}

export default ResultsPage
