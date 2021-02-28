import React, { useState, useEffect } from 'react'
import makeSafeForURL from '../functions/makeSafeForURL'
import LoadingIndicator from '../components/util/LoadingIndicator'
import SelectAnotherYear from '../components/results/SelectAnotherYear'
import LinkedCategory from '../components/results/LinkedCategory'
import AllResults from '../components/results/AllResults'
import { Router, Link } from '@reach/router'

const ResultsPage = ({ userData, years, year }) => {
  const [yearProper, setYearProper] = useState(year)
  const [userCategoryVotes, setUserCategoryVotes] = useState({})
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
        signal: controller.signal
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

    import(/* webpackChunkName: "Results[request]" */ `../json/results/${normalized}.json`)
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
            anchor: `#${makeSafeForURL(c.title)}`
          }
        })
      })
    })
    setTOC(contents)
  }, [data])

  useEffect(() => {
    document.body.classList.add(`no-x-overflow`)
    return () => document.body.classList.remove(`no-x-overflow`)
  }, [])

  if (loading)
    return (
      <>
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
        <h4>Year not found!</h4>
        <h4>
          <small className='text-muted'>
            I don't have any results for the year you were looking for. Sorry!
          </small>
        </h4>
        <Link to='/results'>View years with available results.</Link>
      </div>
    )

  return (
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
          path="/:slug"
          data={data}
          year={yearProper}
          userVotes={userVotes}
          userCategoryVotes={userCategoryVotes}
        />
      </Router>
    </div>
  )
}

export default ResultsPage
