import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import getBadgeEmbed from '../../functions/getBadgeEmbed'

const BadgeBox = ({ year, category, entry }) => {
  const [copied, setCopied] = useState(null)
  const { badgeLink, altText } = getBadgeEmbed('raw', year, category, entry)

  const copyEmbedToClipboard = (type, year, category, nominee) => {
    const badge = getBadgeEmbed(type, year, category, nominee)
    navigator.clipboard.writeText(badge)
    if (type === 'html') setCopied('HTML embed')
    if (type === 'md') setCopied('Markdown embed')
    if (type === 'bb') setCopied('BBCode embed')
  }

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => {
      setCopied(null)
    }, 3000)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <details className='badges-box category-description'>
      <summary>Badges</summary>
      <p>Copy embed code:</p>
      <div className='button-box'>
        <Button
          onClick={() => copyEmbedToClipboard('bb', year, category, entry)}
          variant='outline-dark'
        >
          BBCode
        </Button>
        <Button
          onClick={() => copyEmbedToClipboard('md', year, category, entry)}
          variant='outline-dark'
        >
          Markdown
        </Button>
        <Button
          onClick={() => copyEmbedToClipboard('html', year, category, entry)}
          variant='outline-dark'
        >
          HTML
        </Button>
      </div>
      {copied && <p className='copied-alert'>{copied} copied to clipboard!</p>}
      <img src={badgeLink} alt={altText} />
    </details>
  )
}

export default BadgeBox
