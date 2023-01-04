import React from 'react'
import { Helmet } from 'react-helmet'

const PageHelmet = ({ meta: propMeta, noRobots = false }) => {
  const meta = {
    title: `Cauldron Awards`,
    description: `The home of the Cauldron Discord's annual community awards for fanfiction, fanart, and more!`,
    ...propMeta,
  }

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
          name='og:description'
          content={meta.ogDescription || meta.description}
        />
      )}
      {(meta.description || meta.twitterDescription) && (
        <meta
          name='twitter:description'
          content={meta.twitterDescription || meta.description}
        />
      )}

      {(meta.image || meta.ogImage) && (
        <meta name='og:image' content={meta.ogImage || meta.image} />
      )}
      {(meta.image || meta.twitterImage) && (
        <meta name='twitter:image' content={meta.twitterImage || meta.image} />
      )}

      {meta.robots && <meta name='robots' content={meta.robots} />}
      {noRobots && <meta name='robots' content='noindex, nofollow' />}
    </Helmet>
  )
}

export default PageHelmet
