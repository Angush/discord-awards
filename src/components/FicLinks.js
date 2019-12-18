import React from 'react'

const FicLinks = ({ links }) => {
  return (
    <div className="links">
      {links.map(link => {
        let imageURL = null
        if (link.match(/questionablequesting.com/)) imageURL = "/images/qq.png"
        else if (link.match(/spacebattles.com/)) imageURL = "/images/sb.png"
        else if (link.match(/sufficientvelocity.com/)) imageURL = "/images/sv.png"
        else if (link.match(/fanfiction.net/)) imageURL = "/images/ffn.png"
        else if (link.match(/archiveofourown.org/)) imageURL = "/images/ao3.png"
        if (!imageURL) return null
        return (
          <a key={link} href={link}>
            <img src={imageURL} alt="Destination website icon."/>
          </a>
        )
      })}
    </div>
  )
}

export default FicLinks