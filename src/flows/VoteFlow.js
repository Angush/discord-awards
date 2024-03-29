import React, { useState, useEffect, useCallback } from 'react'
import makeSafeForURL from '../functions/makeSafeForURL'
import LoadingIndicator from '../components/util/LoadingIndicator'
import TableOfContents from '../components/util/TableOfContents'
import SubmitVotes from '../components/vote/SubmitVotes'
import Contest from '../components/vote/Contest'
import { Button } from 'react-bootstrap'
import { navigate } from '@reach/router'
import envVarIsTrue from '../functions/envVarIsTrue'
import getLoginPathName from '../functions/getLoginPathName'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

const VoteFlow = ({ userData }) => {
  const [sections, setSections] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [loadedCache, setLoadedCache] = useState(false)
  const [originalVotes, setOriginalVotes] = useState({ votes: {} })
  const [lightboxData, setLightboxData] = useState(null)
  const [changedVotes, setChangedVotes] = useState({})
  const [expanded, setExpanded] = useState({})
  const [changes, setChanges] = useState({ total: 0 })
  const [votes, setVotes] = useState({})
  const [toc, setTOC] = useState(null)
  const { canVet, canVote } = userData
  const VOTING_CLOSED = envVarIsTrue(`VOTING_CLOSED`)

  //= Create the table of contents
  const createTOC = useCallback(sectionData => {
    if (!sectionData) return
    let tableOfContests = []
    sectionData.forEach(s => {
      tableOfContests.push({
        text: `${s.sectionName} Categories`,
        anchor: `#${s.anchor}`,
        children: s.contests.map(contest => {
          return {
            text: contest.name,
            anchor: `#${contest.anchor}`,
          }
        }),
      })
    })
    setTOC({
      expanded: false,
      items: tableOfContests,
    })
  }, [])

  const validateCachedChanges = useCallback((cachedVotes, contests) => {
    const newVotes = {}
    let validated = false

    for (const id in cachedVotes) {
      let vote = cachedVotes[id]
      try {
        if (vote === true || vote === false) {
          let cID = id.match(/^c(\d+)_/)[1]
          let eID = id.match(/_e(\d+)$/)[1]
          if (contests[cID].entries[eID]) {
            newVotes[id] = vote
            validated = true
          }
        }
      } catch (e) {}
    }

    return { items: newVotes, valid: validated }
  }, [])

  const countCachedChanges = useCallback(
    (cachedVotes, contests) => {
      let total = 0
      let newChanges = {}

      for (const id in cachedVotes) {
        try {
          let cached = cachedVotes[id]
          let original = originalVotes.votes[id]
          if (cached === original) continue
          if (cached === false && !original) continue

          let cID = id.match(/^c(\d+)_/)[1]
          let eID = id.match(/_e(\d+)$/)[1]
          let entry = contests[cID].entries[eID]
          let type = cached === false ? 'Deselected' : 'Selected'
          let element = (
            <li key={`${id}-change`}>
              {type} <span>{entry.data.identifier}</span>
            </li>
          ) // ! TODO: If we modify the changes format in selectEntry, also gotta make sure we modify it here to match. Otherwise it'll be borked.

          if (!newChanges[cID]) newChanges[cID] = {}
          newChanges[cID][id] = element
          total++
        } catch (e) {}
      }

      setChanges({
        ...newChanges,
        total: total,
      })
    },
    [originalVotes]
  )

  //= Validate the votes
  useEffect(() => {
    let parsed = null
    try {
      if (loadedCache) return
      if (!userData.logged_in) return
      if (!sections.fetched) return
      if (!originalVotes.fetched) return
      // if (loadedCache || !sections.fetched || !userData.logged_in) return
      let cached = localStorage.unsubmitted
      if (!cached) return
      parsed = JSON.parse(cached)
    } catch (e) {}

    setLoadedCache(true)

    if (!parsed) {
      localStorage.unsubmitted = JSON.stringify({})
      return
    }

    // bit of a mess, but makes validating WAY easier
    let contests = {}
    sections.items.forEach(s => {
      s.contests.forEach(c => {
        let entries = {}
        c.entries.forEach(e => {
          entries[e.id] = e
        })
        contests[c.id] = { ...c, entries: entries }
      })
    })

    let validated = validateCachedChanges(parsed, contests)
    if (!validated || !validated.valid) return

    countCachedChanges(validated.items, contests)
    setChangedVotes(validated.items)
  }, [
    sections,
    userData,
    validateCachedChanges,
    countCachedChanges,
    originalVotes,
    loadedCache,
  ])

  //= Format category data
  const formatData = useCallback(
    raw => {
      let hasVotes = raw.votes ? true : false
      let categories = raw.contests
      for (const id in categories) {
        categories[id].entries = []
        categories[id].anchor = makeSafeForURL(categories[id].name)
        if (categories[id].fields && categories[id].type === 'other') {
          let fields = Object.values(categories[id].fields)
          categories[id].single =
            (fields.length === 1 && fields[0].id !== 'description') ||
            fields.every(f => f.id === 'owner' || f.id === 'link')
        }
      }

      const createIdentifier = (contestType, { id, data }) => {
        if (contestType === 'other') {
          let identifier = ''
          if (data.name) identifier = data.name
          else if (data.link) identifier = data.link
          else if (data.image) identifier = data.image

          if (data.owner) identifier += ` [${data.owner}]`

          return identifier
        } else if (contestType === 'fic') {
          return `${data.title} by ${data.author}`
        } else if (contestType === 'art') {
          return `${data.title || 'Untitled'} by ${data.artist}`
        } else return `Entry ID ${id}`
      }

      Object.values(raw.nominations).forEach(nom => {
        let nomination = {
          id: nom.id,
          data: nom.data,
        }

        // add nominations to contest
        nom.categories.forEach(cID => {
          if (!nomination.data.identifier) {
            let contest = categories[cID]
            nomination.data.identifier = createIdentifier(
              contest.type,
              nomination
            )
          }
          categories[cID].entries.push({
            id: nomination.id,
            data: {
              ...nomination.data,
              key: `c${cID}_e${nomination.id}`,
            },
          })
        })
      })

      // create section list
      let sectionData = {}
      Object.values(raw.contests).forEach(contest => {
        if (!contest.entries || contest.entries.length === 0) return
        if (!sectionData[contest.section]) {
          sectionData[contest.section] = {
            sectionName: contest.section,
            anchor: `${makeSafeForURL(contest.section)}-categories`,
            contests: [categories[contest.id]],
          }
        } else {
          sectionData[contest.section].contests.push(categories[contest.id])
        }
      })
      sectionData = Object.values(sectionData)

      createTOC(sectionData)
      setSections({
        items: sectionData,
        fetched: true,
      })
      if (hasVotes)
        setOriginalVotes({
          votes: raw.votes,
          fetched: true,
        })
      localStorage.voteables = JSON.stringify(sectionData)
    },
    [createTOC]
  )

  //= Open lightbox for image
  const lightboxHandler = useCallback(
    event => {
      const findItem = id => {
        let itemToFind
        const contestId = parseInt(id.match(/c(?<id>\d+)/).groups.id)
        const nomineeId = parseInt(id.match(/e(?<id>\d+)/).groups.id)
        for (const section of sections.items) {
          if (itemToFind) break
          const contests = section.contests
          for (const contest of contests) {
            if (itemToFind) break
            if (contest.id === contestId) {
              for (const entry of contest.entries) {
                if (entry.id === nomineeId) {
                  itemToFind = entry
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
        classes.some(c => c.match(/card-img/))
      ) {
        event.preventDefault()
        let { id } = event.target
        const clicked = findItem(id)
        const srcs = []
        const { data } = clicked
        if (data.url) srcs.push(data.url)
        if (data.image) srcs.push(data.image)
        if (data.extraURLs) data.extraURLs.forEach(url => srcs.push(url))
        if (data.links) data.links.forEach(url => srcs.push(url))
        setLightboxData({
          ...data,
          id,
          srcs: srcs.filter(url => !!url),
          index: 0,
          total: srcs.length,
        })
      }
    },
    [sections]
  )

  useEffect(() => {
    window.addEventListener('click', lightboxHandler)
    return () => window.removeEventListener('click', lightboxHandler)
  }, [lightboxHandler])

  //= Get voteables data
  useEffect(() => {
    const controller = new AbortController()
    let cached = localStorage.voteables
    if (cached)
      try {
        let parsed = JSON.parse(cached)
        createTOC(parsed)
        setSections({
          items: parsed,
          fetched: false,
        })
      } catch (e) {}

    window
      .fetch(`https://cauldron.angu.sh/api/voteables`, {
        credentials: 'include',
        signal: controller.signal,
      })
      .then(response => response.json())
      .then(resData => {
        formatData(resData)
      })
      .catch(console.error)

    return () => controller.abort()
  }, [createTOC, formatData])

  //= Discard vote data if user logs out
  useEffect(() => {
    if (!userData.logged_in) {
      console.log(`Clearing votes due to logout`)
      setOriginalVotes({ votes: {} })
      setChangedVotes({})
    }
  }, [userData])

  //= Spread changed votes over original votes whenever either change
  useEffect(() => {
    if (!userData.logged_in) return

    setVotes({
      ...originalVotes.votes,
      ...changedVotes,
    })

    if (!originalVotes.fetched) return
    try {
      //= Store changes in localStorage
      let storeable = {}
      for (const key in changedVotes) {
        if (
          originalVotes.votes[key] !== changedVotes[key] &&
          !(!originalVotes.votes[key] && !changedVotes[key])
        ) {
          // only store votes that have actually changed
          storeable[key] = changedVotes[key]
        }
      }
      localStorage.unsubmitted = JSON.stringify(storeable)
    } catch (e) {}
  }, [originalVotes, changedVotes, userData])

  const selectEntry = !userData.logged_in
    ? () => alert(`You need to log in to register votes!`)
    : (key, changeText) => {
        if (submitting) return
        //- Set changedVotes based on original and current vote status
        let originallySelected = originalVotes.votes[key] === true
        let currentlySelected = votes[key] === true
        let cID = (key.match(/^c(\d+)_/) || [])[1]
        if (!cID)
          return console.error(
            `Invalid contest ID. This shouldn't ever happen.`,
            cID
          )

        let change = 0
        if (currentlySelected) {
          change = originallySelected ? 1 : -1
          setChangedVotes({
            ...changedVotes,
            [key]: false,
          })
        } else {
          change = originallySelected ? -1 : 1
          setChangedVotes({
            ...changedVotes,
            [key]: true,
          })
        }

        //- Calculate the new number of changes
        let contestChanges = changes[cID]
        if (!contestChanges) contestChanges = {}
        let type = currentlySelected ? 'Deselected' : 'Selected'
        if (change === -1) {
          delete contestChanges[key]
        } else {
          contestChanges[key] = (
            <li key={`${key}-change`}>
              {type} <span>{changeText}</span>
            </li>
          )
          // TODO: perhaps change this to be an object?
          // * { type: '(de)selected', identifier: {changeText}, voteID: {key} }
          // * Then format it into the <li></li> in Contest.js
          // ? This would enable us to:
          //   - (a) store the data in localStorage, which might be a problem if we're creating React elements.
          //   - (b) potentially let user click the <li></li> to undo that vote? Might be bad UX, unless we prompt with a confirmation box first.
        }

        let total = changes.total
        setChanges({
          ...changes,
          [cID]: contestChanges,
          total: total + change,
        })

        console.log(`${type} entry with key ${key}, AKA.`, changeText)
      }

  const entryIsSelected = id => {
    if (votes[id] === true) return true
    else return false
  }

  const numberOfVotes = id => {
    let count = 0
    let match = new RegExp(`^c${id}_e\\d+$`)
    for (const vote in originalVotes.votes) {
      if (match.test(vote) && originalVotes.votes[vote] === true) count++
    }
    return count
  }

  const submitVotes = event => {
    event.preventDefault()
    let redirectLocation = getLoginPathName()
    if (!userData.logged_in) {
      window.location.href = redirectLocation
      return
    }

    if (VOTING_CLOSED && !canVote) return

    let submissionData = []
    for (const key in changedVotes) {
      // parse contest and entry ids
      let cID = (key.match(/^c(\d+)_/) || [])[1]
      let eID = (key.match(/_e(\d+)$/) || [])[1]
      if (
        cID &&
        eID &&
        originalVotes.votes[key] !== changedVotes[key] &&
        !(!originalVotes.votes[key] && !changedVotes[key])
      ) {
        // only submit votes that have actually changed
        submissionData.push({
          c: cID,
          e: eID,
          r: changedVotes[key] === false,
        })
      }
    }

    if (submissionData.length === 0)
      return console.error(
        `Found no valid votes to submit. Not sure how this happened.`
      )

    setSubmitting(true)
    window
      .fetch(`https://cauldron.angu.sh/api/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        credentials: 'include',
        body: JSON.stringify(submissionData),
      })
      .then(res => {
        setSubmitting(false)
        if (res.status === 201) {
          console.log(`Submission succeeded!`)
          return res.json()
        }
        console.error(`Submission failed status code ${res.status}!`, res)
        if (res.status === 401) {
          console.warn(`User login expired. Forcing page reload...`)
          navigate(redirectLocation)
          return null
        }
      })
      .then(newVotes => {
        if (!newVotes) return
        console.log(`Submitted! Committing changes and resyncing...`)
        setChanges({ total: 0 })
        setChangedVotes({})
        setOriginalVotes({
          votes: newVotes,
          fetched: true,
        })
      })
      .catch(console.error)
  }

  if (!sections || !toc)
    return (
      <>
        <LoadingIndicator className='fade-rise'>
          <h4>Just a moment!</h4>
          <h6 className='text-muted'>We're fetching the entries for you.</h6>
        </LoadingIndicator>
        <TableOfContents />
      </>
    )

  // TODO: add little circular checkboxes that appear on hover (or always, on mobile) in the top-right corner of larger cards. (Maybe only draw it if an {onClick} prop exists, within the cards?) Clicking this is the same as clicking the card, and marks the checkbox.

  let submissionText
  if (VOTING_CLOSED && canVet && !canVote) submissionText = 'Voting is closed.'
  else if (!userData.logged_in) submissionText = 'Log in to vote! Click here.'
  else if (!sections.fetched) submissionText = 'Syncing vote data...'
  else if (!userData.user.isCauldron)
    submissionText = "You're not a member of Cauldron!"
  else
    submissionText =
      changes.total === 0
        ? `Select an entry to vote!`
        : changes.total === 1
        ? `Lodge unsubmitted change`
        : `Lodge ${changes.total} unsubmitted changes`

  const total = !lightboxData ? null : lightboxData.total
  const nextIndex = !lightboxData ? null : (lightboxData.index + 1) % total
  const prevIndex = !lightboxData
    ? null
    : (lightboxData.index + total - 1) % total

  const SelectEntryButton = ({ data }) => {
    const isSelected = entryIsSelected(data.key)
    return (
      <Button
        variant={isSelected ? 'danger' : 'primary'}
        onClick={() => selectEntry(data.key, data.identifier)}
      >
        {isSelected ? 'Deselect this entry' : 'Select this entry'}
      </Button>
    )
  }

  return (
    <>
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
          imageCaption={<SelectEntryButton data={lightboxData} />}
        />
      )}
      <TableOfContents
        items={toc.items}
        isOpen={toc.expanded}
        closeMenu={() => {
          setTOC({
            ...toc,
            expanded: false,
          })
        }}
        offsets={[
          {
            breakpoint: 576,
            distance: 64,
          },
          {
            default: true,
            distance: -12,
          },
        ]}
      />
      <div id='content' className='vote-flow left-indent-container fade-rise'>
        <div
          className={toc.expanded ? 'toc-click expanded' : 'toc-click'}
          onClick={() => setTOC({ ...toc, expanded: !toc.expanded })}
        ></div>

        {sections.items.map(section => {
          const isExpanded = expanded[section.anchor]
          return (
            <section
              key={section.sectionName}
              id={section.anchor}
              className='contest_section'
            >
              <div className='contest-section-header'>
                <h3>
                  {section.sectionName}
                  <span className='section-categories-text'> Categories</span>
                </h3>
                <Button
                  variant={isExpanded ? 'light' : 'outline-light'}
                  onClick={() => {
                    setExpanded({
                      ...expanded,
                      [section.anchor]: isExpanded ? false : true,
                    })
                  }}
                >
                  {isExpanded ? 'Collapse' : 'Expand'} All
                </Button>
                {VOTING_CLOSED && canVet && !canVote && (
                  <p className='closed-vote-warning'>
                    <span className='bold'>Note: voting is closed.</span> You
                    have permission to view the vote options, but you may not
                    lodge any votes.
                  </p>
                )}
                {VOTING_CLOSED && canVet && canVote && (
                  <p className='closed-vote-warning'>
                    <span className='bold'>Note: voting is closed.</span> You
                    have permission to lodge votes despite this, but they may be
                    annulled later.
                  </p>
                )}
              </div>
              {section.contests.map((contest, index) => (
                <Contest
                  key={`cat-${contest.id}`}
                  changes={
                    changes[contest.id]
                      ? Object.values(changes[contest.id])
                      : []
                  }
                  votes={numberOfVotes(contest.id)}
                  isSelected={entryIsSelected}
                  select={selectEntry}
                  contest={contest}
                  expanded={isExpanded}
                />
              ))}
            </section>
          )
        })}

        <div id='controls'>
          <Button
            id='open-toc'
            variant='light'
            onClick={() => setTOC({ ...toc, expanded: !toc.expanded })}
          >
            <img
              alt='Toggle table of contents'
              fill='black'
              src='/images/list.svg'
              width='34px'
              height='34px'
            />
            {/* TOC */}
          </Button>
          <SubmitVotes
            onClick={submitVotes}
            submitting={submitting}
            disabled={
              !sections.fetched ||
              (userData.logged_in && changes.total < 1) ||
              (userData.logged_in && !userData.user.isCauldron) ||
              (VOTING_CLOSED && !canVote)
            }
          >
            {submissionText}
          </SubmitVotes>
        </div>
        <div className='vertical-padding'></div>
      </div>
    </>
  )
}

export default VoteFlow
