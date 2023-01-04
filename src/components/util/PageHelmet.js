import { useLocation } from '@reach/router'
import React from 'react'
import { Helmet } from 'react-helmet'

const BASE_URL = `https://cauldron.angu.sh`

const PageHelmet = ({ meta: propMeta, noRobots = false }) => {
  const location = useLocation()

  const meta = {
    title: `Cauldron Awards`,
    description: `The home of the Cauldron Discord's annual community awards for fanfiction, fanart, and more!`,
    canonical: location.pathname,
    ...propMeta,
  }

  const images = {
    image:
      meta.image && meta.image.startsWith?.('/')
        ? `${BASE_URL}${meta.image}`
        : meta.image,
    ogImage:
      meta.ogImage && meta.ogImage.startsWith?.('/')
        ? `${BASE_URL}${meta.ogImage}`
        : meta.ogImage,
    twitterImage:
      meta.twitterImage && meta.twitterImage.startsWith?.('/')
        ? `${BASE_URL}${meta.twitterImage}`
        : meta.twitterImage,
  }

  const canonical =
    meta.canonical && meta.canonical.startsWith?.('/')
      ? `${BASE_URL}${meta.canonical}`
      : meta.canonical || BASE_URL

  return (
    <Helmet defaultTitle='Cauldron Awards'>
      <title>{meta.title}</title>
      <meta name='og:title' content={meta.ogTitle || meta.title} />
      <meta name='twitter:title' content={meta.twitterTitle || meta.title} />

      {meta.description && (
        <meta name='description' content={meta.description} />
      )}
      {(meta.description || meta.ogDescription) && (
        <meta
          property='og:description'
          content={meta.ogDescription || meta.description}
        />
      )}
      {(meta.description || meta.twitterDescription) && (
        <meta
          name='twitter:description'
          content={meta.twitterDescription || meta.description}
        />
      )}

      {(images.image || images.ogImage) && (
        <meta property='og:image' content={images.ogImage || images.image} />
      )}
      {(images.image || images.twitterImage) && (
        <meta
          name='twitter:image'
          content={images.twitterImage || images.image}
        />
      )}

      {meta.robots && <meta name='robots' content={meta.robots} />}
      {noRobots && <meta name='robots' content='noindex, nofollow' />}

      {canonical && <link rel='canonical' href={canonical} />}
    </Helmet>
  )
}

export default PageHelmet
