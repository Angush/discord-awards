const envVarIsTrue = (text) => {
  let envVar = process.env[`REACT_APP_${text}`]
  if (!envVar) return false
  return envVar.toLowerCase() === 'true'
}

export default envVarIsTrue