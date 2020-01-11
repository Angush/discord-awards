const jumpToID = (id, { offset = 80, smooth = true } = {}) => {
  try {
    window.scrollTo({
      behavior: smooth ? 'smooth' : 'auto',
      top: document.getElementById(id).offsetTop - offset
    })
  } catch (e) {
    console.error(e)
  }
}

export default jumpToID
