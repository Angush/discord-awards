import React from 'react'
import envVarIsTrue from '../../functions/envVarIsTrue'

const currentYear =
  new Date().getMonth() >= 10
    ? new Date().getFullYear()
    : new Date().getFullYear() - 1

const NominationInfo = () => {
  if (envVarIsTrue('NOMINATIONS_CLOSED')) return null

  return (
    <div className='nomination-info'>
      <details>
        <summary>
          <h5 style={{ display: 'inline-block' }}>
            Nominations for {currentYear} are open!
          </h5>
          <p>
            Please read the awards eligibility criteria below before lodging any
            nominations. Click to view.
          </p>
        </summary>
        <div className='nomination-info-details'>
          <p>Criteria for eligible nominations is as follows:</p>
          <ol className='nomination-criteria'>
            <li>
              Entrants must be a fanwork for a Wildbow universe (ie. Parahumans,
              Otherverse, Twig) or otherwise associated with the fandom ("The
              creator is part of the fandom" doesn't count), except where
              otherwise indicated.
            </li>
            <li>
              Entrants must have been initially posted or updated in a
              substantial manner during the year of {currentYear}, except where
              otherwise indicated (eg. "New" categories require entrants to have
              originated in {currentYear}).
            </li>
            <li>
              Entrants may be created by any persons, on or off Cauldron, except
              where otherwise indicated (eg. "by a Cauldron member" in a
              category title or description).
            </li>
            <li>
              Entrants must be adherent to the rules of the Cauldron Discord —
              chiefly, rules 5 (no racism, sexism, homo- or trans-phobia, etc.)
              and 6 (no sexual content involving minor characters or sexual
              assault, etc.) If you don't know where the full text for these
              rules are, you shouldn't be nominating anything.
            </li>
            <li>
              Wherever a category indicates that additional criteria
              stipulations apply (whether in its title, description, or the
              embedded criteria accordions or modals), entrants must also
              satisfy those criteria.
            </li>
            <li>
              Self-nominations (ie. nominating your own creations) are permitted
              and encouraged — you're the least likely person to forget to
              nominate your work!
            </li>
          </ol>
          <p>
            Above all, nominate whatever you can think of! Don't stop yourself
            because it's something <em>you</em> made, or you think someone else
            might have already nominated what <em>you</em> want to nominate —
            it's better to have a duplicate entry than no entry at all!
          </p>
        </div>
      </details>
    </div>
  )
}

export default NominationInfo
