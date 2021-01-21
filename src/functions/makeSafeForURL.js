const makeSafeForURL = (text, replacement = '-') => encodeURIComponent(
  `${text}`.toLowerCase().replace(/[\s/\\]+/g, replacement)
)

export default makeSafeForURL