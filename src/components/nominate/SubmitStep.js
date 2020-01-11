import React from 'react'
import PreviewCard from '../cards/PreviewCard'
import GoBack from '../util/GoBack'

const SubmitStep = ({
  nominee,
  selected: { type, categories },
  reset,
  goBack
}) => {
  const requiredTypes = {}
  if (type === 'other')
    categories[0].fields.forEach(
      field => (requiredTypes[field.id] = field.name)
    )

  return (
    <div>
      <h5>
        <GoBack onClick={goBack} />
        <small className='text-muted'>That's it!</small>
      </h5>
      <h4>Nominee submitted!</h4>
      <h6>
        Your {type} nominee was submitted in{' '}
        {categories.length > 1 ? 'these categories' : 'this category'}:
      </h6>
      <ol>
        {categories.map(category => (
          <li style={{ paddingLeft: '8px' }} key={category.name}>
            <strong>{category.name}</strong>
            <br />
            {category.description}
          </li>
        ))}
      </ol>
      <div className='preview mx-auto'>
        {type === 'other' ? (
          <PreviewCard
            data={nominee}
            requiredTypes={requiredTypes}
            usePlaceholders={false}
          />
        ) : type === 'fic' ? (
          <PreviewCard type='fic' fic={nominee} />
        ) : (
          <PreviewCard type='art' formData={nominee} />
        )}
      </div>
    </div>
  )
}

export default SubmitStep
