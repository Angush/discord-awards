import React from 'react'

const GenericVideoEmbed = ({ url, title }) => {
  return (
    <div>
      <video className='generic-video-embed' controls loop>
        <source src={url} type='video/mp4' />
        <source src={url} type='video/webm' />
      </video>
    </div>
  )
}

export default GenericVideoEmbed
