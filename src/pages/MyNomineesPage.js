import React, { useState, useEffect } from 'react'
import { Link } from '@reach/router'
import PreviewCard from '../components/cards/PreviewCard'

const MyNomineesPage = () => {
  const [categories, setCategories] = useState(null)
  const [nominees, setNominees] = useState(null)

  useEffect(() => {
    if (localStorage.categories && localStorage.nominees) {
      setCategories(JSON.parse(localStorage.categories))
      setNominees(JSON.parse(localStorage.nominees))
    }
  }, [])

  if (!nominees || !categories)
    return (
      <div className='vote-flow fade-rise text-center pad-top'>
        <h3>You haven't nominated anything yet!</h3>
        <p>
          Or if you have, I can't retrieve the records. (This'll be improved for
          the 2020 awards.)
        </p>
        <p>
          Visit <Link to='/nominate'>the nomination page</Link> to nominate
          something in one of our many categories!
        </p>
      </div>
    )

  const getCategoryNominees = id =>
    nominees
      .filter(nominee => nominee.categories.some(cid => cid === id))
      .map(n => n.data)

  return (
    <>
      <div className='my-nominees'>
        {categories.map(category => {
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
                      field => (types[field.id] = field.name)
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
    </>
  )
}

export default MyNomineesPage
