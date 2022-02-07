import React from 'react'

const YouTubeEmbed = ({ id, title }) => {
  return (
    <div>
      <iframe
        className='video-embed'
        src={`https://www.youtube.com/embed/${id}`}
        frameBorder='0'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
        title={title}
      />
    </div>
  )
}

export default YouTubeEmbed
