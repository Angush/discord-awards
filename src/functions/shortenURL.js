const shortenURL = url => {
  return url
    .replace(/(\.com)\/threads\/\S+\.\d+\/\S*post-(\d+)$/i, '$1/posts/$2')
    .replace(/(\.com)\/threads\/\S+\.(\d+)\/?$/i, '$1/threads/$2')
    .replace(/(\.fanfiction.net\/s\/\d+(\/?\d+)?)\/\S+$/i, '$1')
    .replace(/(archiveofourown\.org\/)works\/\d+\/(chapters\/\d+)$/i, '$1$2')
    .replace(/(docs\.google\.\w+\/\S+)\/(edit\S+)?$/i, '$1')
}

export default shortenURL
