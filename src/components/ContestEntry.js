import React from 'react'
import FicLinks from './FicLinks'

const ContestEntry = ({ id, contestID, item, toggleVote }) => {
  let contestDetails = item.contests.find(c => c.id === contestID)
  let voteText = `${contestDetails.votes} vote${contestDetails.votes !== 1 ? `s` : ``}`

  let clicked = () => {
    toggleVote(contestID, id)
  }

  if (item.type === "art") {
    return (
      <div className="entry art">
        <div className={item.nsfw ? "art_image art_nsfw" : "art_image"}>
          <img src={item.imageURL} alt={`Art by ${item.artist}`}/>
        </div>
        <div className="art_overlay">
          <div className="art_data">
            <h3>
              {item.title}
              {item.nsfw && <span className="nsfw_indicator">NSFW</span>}
            </h3>
            <h4>by <span className="author">{item.artist}</span></h4>
          </div>
          <div
            className={contestDetails.voted ? "votecount voted" : "votecount"}
            onClick={clicked}
          >
            <p>{voteText}</p>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="entry fic">
        <div className="fic_data">
          <h3>
            {item.title}
            {item.nsfw && <span className="nsfw_indicator">NSFW</span>}
          </h3>
          <h4>by <span className="author">{item.author}</span></h4>
          <FicLinks links={Object.values(item.links).filter(v => v)}/>
        </div>
        {/* <hr></hr> */}
        <div 
          className={contestDetails.voted ? "votecount voted" : "votecount"}
          onClick={clicked}
        >
          <p>{voteText}</p>
        </div>
      </div>
    )
  }

}

export default ContestEntry