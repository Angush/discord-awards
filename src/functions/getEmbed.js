import React from 'react'
import YouTubeEmbed from '../components/cards/embeds/YouTubeEmbed'
import GenericVideoEmbed from '../components/cards/embeds/GenericVideoEmbed'

const getEmbed = (url, data) => {
  if (!url) return
  const title = `${data.title || 'Untitled'} by ${data.artist || 'Unknown'}`
  const match = url.match(
    /(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)(?<id>[\w-]+)/
  )
  if (match?.groups?.id)
    return <YouTubeEmbed id={match.groups.id} title={title} />
  if (url.match(/redd\.it.+format=mp4/))
    return <GenericVideoEmbed url={url} title={title} />

  return
}

export default getEmbed
