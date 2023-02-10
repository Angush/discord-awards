const makeSafeForURL = (text, replacement = '-') =>
  encodeURIComponent(
    `${text}`
      .toLowerCase()
      .replace(/[\s/\\]+/g, replacement)
      .replace(/[^\w-]+/, '')
  )

export default makeSafeForURL
