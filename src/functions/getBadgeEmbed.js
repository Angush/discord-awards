import makeSafeForURL from './makeSafeForURL'
const baseURL = process.env.REACT_APP_BADGE_BASE_URL ?? `https://cauldron.angu.sh`

const getBadgeEmbed = (type, year, category, nominee) => {
  const title = makeSafeForURL(category.title)
  const titleWithoutQuotes = category.title.replace(/"/g, '')

  const altText = `${nominee.placement} place in the ${titleWithoutQuotes} category in the ${year} Cauldron Awards`
  const categoryLink = `${baseURL}/results/${year}/${title}`
  const badgeLink = `${baseURL}/badges/${year}/cat_${category.id}/${nominee.placement}_${nominee.id}.png`

  if (type === 'bb')
    return `[url=${categoryLink}][img alt="${altText}"]${badgeLink}[/img][/url]`

  if (type === 'md') return `[![${altText}](${badgeLink})](${categoryLink})`

  if (type === 'html')
    return `<a href="${categoryLink}"><img src="${badgeLink}" alt="${altText}" /></a>`

  if (type === 'raw')
    return {
      badgeLink,
      altText,
      categoryLink,
    }

  return badgeLink
}

export default getBadgeEmbed
