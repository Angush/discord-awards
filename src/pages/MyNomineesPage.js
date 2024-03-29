import React, { useState, useEffect } from 'react'
import { Link } from '@reach/router'
import PreviewCard from '../components/cards/PreviewCard'
import envVarIsTrue from '../functions/envVarIsTrue'

const nominationsClosed = envVarIsTrue('NOMINATIONS_CLOSED')

const MyNomineesPage = () => {
  const [categories, setCategories] = useState(null)
  const [nominees, setNominees] = useState(null)

  useEffect(() => {
    if (localStorage.categories && localStorage.nominees) {
      setCategories(JSON.parse(localStorage.categories))
      setNominees(JSON.parse(localStorage.nominees))
    }
  }, [])

  if (!nominees || nominees.length === 0 || !categories)
    return (
      <div className='fade-rise text-center pad-top'>
        <h3>
          {nominationsClosed
            ? "You didn't nominate anything!"
            : "You haven't nominated anything!"}
        </h3>
        <p style={{ marginTop: '20px' }}>
          Or if you {nominationsClosed ? 'did' : 'have'}, I can't retrieve the
          records. Try visiting this page again on the same device (and browser)
          that you used to make your nominations.
        </p>
        {nominationsClosed ? (
          <p>
            Visit <Link to='/vote'>the vote page</Link> to register your votes
            for the 2021 awards before voting closes!
          </p>
        ) : (
          <p>
            Visit <Link to='/nominate'>the nomination page</Link> to put your
            own entries in for the 2021 awards before nominations close!
          </p>
        )}
        <p>(This'll be improved for the 2022 awards. Maybe.)</p>
      </div>
    )

  const getCategoryNominees = (id) => {
    if (nominees.length === 0 || !nominees[0].categories) return []
    return nominees
      .filter((nominee) => nominee.categories.some((cid) => cid === id))
      .map((n) => n.data)
  }

  return (
    <div className='fade-rise'>
      <h3
        style={{
          marginTop: '20px',
        }}
      >
        My Nominees
      </h3>
      <div className='clear-nominees'>
        <div
          className='btn-link text-danger'
          onClick={() => {
            setNominees(null)
            localStorage.nominees = []
          }}
        >
          Clear stored nominee history
        </div>
        <div className='text-muted'>(Note: does not undo nominations)</div>
      </div>
      <div className='my-nominees'>
        {categories.map((category) => {
          let categoryNominees = getCategoryNominees(category.id)
          let count = categoryNominees.length
          if (!categoryNominees || count === 0) return null
          return (
            <div key={`cat-${category.id}`} className='category'>
              <h5>
                <small className='text-muted'>
                  {count} nominee{count > 1 && 's'}
                </small>
              </h5>
              <h4>{category.name}</h4>
              <h6>{category.description}</h6>
              <div className='entries'>
                {categoryNominees.map((nominee, index) => {
                  let types = {}
                  if (category.fields)
                    category.fields.forEach(
                      (field) => (types[field.id] = field.name)
                    )

                  return (
                    <div key={`cat-${category.id}-nom-${index}`}>
                      {category.type === 'other' ? (
                        <PreviewCard
                          data={nominee}
                          requiredTypes={types}
                          usePlaceholders={false}
                        />
                      ) : category.type === 'fic' ? (
                        <PreviewCard type='fic' fic={nominee} />
                      ) : (
                        <PreviewCard type='art' formData={nominee} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <div className='vertical-padding'></div>
    </div>
  )
}

export default MyNomineesPage
