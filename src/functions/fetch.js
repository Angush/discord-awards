const formatData = (text) => {
  try {
    const data = JSON.parse(text)
    if (!!data) return data
  } catch (err) {}
  return text
}

const fetch = (resource, options = {}) => {
  return new Promise((resolve, reject) => {
    window
      .fetch(resource, options)
      .then((res) => {
        if (res.ok) res.text().then((data) => resolve(formatData(data)))
        else res.text().then((data) => reject(formatData(data)))
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export default fetch
