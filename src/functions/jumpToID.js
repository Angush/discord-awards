const jumpToID = (id, { offset = 80, smooth = true, onJump } = {}) => {
  try {
    window.scrollTo({
      behavior: smooth ? 'smooth' : 'auto',
      top: document.getElementById(id).offsetTop - offset
    })
    if (onJump) onJump()
  } catch (e) {
    console.error(e)
  }
}

export default jumpToID
