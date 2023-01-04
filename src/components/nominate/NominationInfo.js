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
              otherwise indicated or not applicable.
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
              category title, description, or embedded criteria/info accordion
              or modal).
            </li>
            <li>
              Entrants must be adherent to the rules of the Cauldron Discord —
              chiefly, <strong>rule 5</strong> (no racism, sexism, homo- or
              trans-phobia, etc.) and <strong>rule 6</strong> (no sexual content
              involving minor characters or sexual assault, etc.) If you don't
              know where the full text for these rules are, you shouldn't be
              nominating anything.
            </li>
            <li>
              Wherever a category indicates that additional criteria
              stipulations apply (whether in its title, description, or the
              embedded criteria/info accordions or modals), entrants must also
              satisfy those criteria.
            </li>
            <li>
              Self-nominations (ie. nominating your own creations) are{' '}
              <strong>
                permitted and <em>encouraged</em>
              </strong>
              . We don't want great works to slip through the cracks, and{' '}
              <em>you're</em> the least likely person to forget to nominate your
              own works!
            </li>
          </ol>
          <p>
            Above all, nominate whatever you can think of! Don't stop yourself
            because it's something <em>you</em> made, or you think someone else
            might have already nominated what <em>you</em> want to nominate —
            it's better to have a duplicate entry than no entry at all!
          </p>
          <p>
            Similarly, if a category has additional criteria or information, and
            you're unsure whether or not your nominee meets the requirements:
            just nominate it anyway! Non-qualifying entrants will be rejected
            during the vetting process after nominations are finished. It's
            better to have 10 rejected entrants and 10 accepted than only 5
            entrants in total.
          </p>
        </div>
      </details>
    </div>
  )
}

export default NominationInfo
