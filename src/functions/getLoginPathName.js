const getLoginPathName = () => {
  if (window.location.pathname === '/')
    return `https://cauldron.angu.sh/api/login`
  else
    return encodeURI(
      `https://cauldron.angu.sh/api/login?pathname=${window.location.pathname}`
    )
}

export default getLoginPathName
