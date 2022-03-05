import React from 'react'
import validateURL from '../../functions/validateURL'

//! move this elsewhere... somewhere?
const TYPE = {
  sb: {
    img: '/images/sb.png',
    name: 'Space Battles',
    order: 1,
  },
  sv: {
    img: '/images/sv.png',
    name: 'Sufficient Velocity',
    order: 2,
  },
  qq: {
    img: '/images/qq.png',
    name: 'Questionable Questing',
    order: 3,
  },
  ao3: {
    img: '/images/ao3.png',
    name: 'Archive of Our Own',
    order: 4,
  },
  ffn: {
    img: '/images/ffn.png',
    name: 'Fanfiction dot net',
    order: 5,
  },
  youtube: {
    img: '/images/youtube.png',
    name: 'YouTube (You Tube)',
    order: 6,
  },
  reddit: {
    img: '/images/reddit.png',
    name: 'Reddit',
    order: 7,
  },
  tumblr: {
    img: '/images/tumblr.png',
    name: 'Tumblr (Tumbler)',
    order: 8,
  },
  deviantart: {
    img: '/images/deviantart.png',
    name: 'Deviant Art',
    order: 9,
  },
  imgur: {
    img: '/images/imgur.png',
    name: 'Imgur (Imager)',
    order: 10,
  },
  soundcloud: {
    img: '/images/soundcloud.png',
    name: 'SoundCloud (Sound Cloud)',
  },
  royalroad: {
    img: '/images/royalroad.png',
    name: 'Royal Road',
  },
  wordpress: {
    element: (
      <svg
        className='misc-link-svg'
        viewBox='0 0 122.52 122.523'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g>
          <path d='m8.708 61.26c0 20.802 12.089 38.779 29.619 47.298l-25.069-68.686c-2.916 6.536-4.55 13.769-4.55 21.388z' />
          <path d='m96.74 58.608c0-6.495-2.333-10.993-4.334-14.494-2.664-4.329-5.161-7.995-5.161-12.324 0-4.831 3.664-9.328 8.825-9.328.233 0 .454.029.681.042-9.35-8.566-21.807-13.796-35.489-13.796-18.36 0-34.513 9.42-43.91 23.688 1.233.037 2.395.063 3.382.063 5.497 0 14.006-.667 14.006-.667 2.833-.167 3.167 3.994.337 4.329 0 0-2.847.335-6.015.501l19.138 56.925 11.501-34.493-8.188-22.434c-2.83-.166-5.511-.501-5.511-.501-2.832-.166-2.5-4.496.332-4.329 0 0 8.679.667 13.843.667 5.496 0 14.006-.667 14.006-.667 2.835-.167 3.168 3.994.337 4.329 0 0-2.853.335-6.015.501l18.992 56.494 5.242-17.517c2.272-7.269 4.001-12.49 4.001-16.989z' />
          <path d='m62.184 65.857-15.768 45.819c4.708 1.384 9.687 2.141 14.846 2.141 6.12 0 11.989-1.058 17.452-2.979-.141-.225-.269-.464-.374-.724z' />
          <path d='m107.376 36.046c.226 1.674.354 3.471.354 5.404 0 5.333-.996 11.328-3.996 18.824l-16.053 46.413c15.624-9.111 26.133-26.038 26.133-45.426.001-9.137-2.333-17.729-6.438-25.215z' />
          <path d='m61.262 0c-33.779 0-61.262 27.481-61.262 61.26 0 33.783 27.483 61.263 61.262 61.263 33.778 0 61.265-27.48 61.265-61.263-.001-33.779-27.487-61.26-61.265-61.26zm0 119.715c-32.23 0-58.453-26.223-58.453-58.455 0-32.23 26.222-58.451 58.453-58.451 32.229 0 58.45 26.221 58.45 58.451 0 32.232-26.221 58.455-58.45 58.455z' />
        </g>
      </svg>
    ),
    name: 'Wordpress',
  },
  game: {
    img: '/images/game.svg',
    name: 'Itch.io',
  },
  gdocs: {
    img: '/images/gdocs.svg',
    name: 'Google Docs',
  },
  ccup: {
    img: '/images/ccup.png',
    name: 'Cauldron Cup',
  },
  misc: {
    element: (
      <svg
        className='misc-link-svg'
        width='112'
        height='112'
        viewBox='0 0 112 112'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g clipPath='url(#clip0)'>
          <path d='M22 18.5H46C48.2091 18.5 50 20.2909 50 22.5V24.5C50 26.7091 48.2091 28.5 46 28.5H24.5C20.0817 28.5 16.5 32.0817 16.5 36.5V87.5C16.5 91.9183 20.0817 95.5 24.5 95.5H76C80.4183 95.5 84 91.9183 84 87.5V66C84 63.7909 85.7909 62 88 62H89.5C91.7091 62 93.5 63.7909 93.5 66V90C93.5 98.8366 86.3366 106 77.5 106H22C13.1634 106 6 98.8366 6 90V34.5C6 25.6634 13.1634 18.5 22 18.5Z' />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M66.5 6H102C104.209 6 106 7.79086 106 10V45.5C106 47.7091 104.209 49.5 102 49.5H100.5C98.2909 49.5 96.5 47.7091 96.5 45.5V22.5L57.3284 61.6716C55.7663 63.2337 53.2337 63.2337 51.6716 61.6716L50.3284 60.3284C48.7663 58.7663 48.7663 56.2337 50.3284 54.6716L89.5 15.5H66.5C64.2909 15.5 62.5 13.7091 62.5 11.5V10C62.5 7.79086 64.2909 6 66.5 6Z'
          />
        </g>
        <defs>
          <clipPath id='clip0'>
            <rect width='112' height='112' />
          </clipPath>
        </defs>
      </svg>
    ),
    name: 'Miscellaneous',
    order: 99,
  },
}

const getLinkType = link => {
  let match = TYPE.misc
  if (link.match(/questionablequesting\.com/)) match = TYPE.qq
  else if (link.match(/spacebattles\.com/)) match = TYPE.sb
  else if (link.match(/sufficientvelocity\.com/)) match = TYPE.sv
  else if (link.match(/fanfiction\.net/)) match = TYPE.ffn
  else if (link.match(/archiveofourown\.org/)) match = TYPE.ao3
  else if (link.match(/youtube\.com|youtu\.be/)) match = TYPE.youtube
  else if (link.match(/(old\.|www\.)?(reddit\.com|redd\.it)/))
    match = TYPE.reddit
  else if (link.match(/\.?tumblr\.com/)) match = TYPE.tumblr
  else if (link.match(/deviantart\.com/)) match = TYPE.deviantart
  else if (link.match(/imgur\.com/)) match = TYPE.imgur
  else if (link.match(/soundcloud\.com/)) match = TYPE.soundcloud
  else if (link.match(/(docs|sheets)\.google\.com/)) match = TYPE.gdocs
  else if (link.match(/wordpress\.com/)) match = TYPE.wordpress
  else if (link.match(/royalroad\.com/)) match = TYPE.royalroad
  else if (link.match(/(itch\.io)/)) match = TYPE.game
  else if (link.match(/syl\.ae\/cauldroncup/)) match = TYPE.ccup
  return match
}

const FicLinks = ({ links }) => {
  if (!links || links.length === 0)
    return <div className='fic-links'>No links.</div>

  const sorted = links
    .map(link => {
      if (!link) return { url: '' }
      return {
        ...getLinkType(link),
        url: link,
      }
    })
    .sort((a, b) => a.order - b.order)
    .filter(link => validateURL(link.url))

  return (
    <div className='fic-links'>
      {sorted.map((link, index) => {
        return (
          <a
            key={`${index}-${link.url}`}
            href={link.url}
            target='_blank'
            rel='noopener noreferrer'
          >
            {link.element && link.element}
            {link.img && (
              <img
                src={link.img}
                alt={`${link.name || `Destination`} link icon.`}
              />
            )}
          </a>
        )
      })}
    </div>
  )
}

export default FicLinks
