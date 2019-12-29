import React from 'react'
import '../../style/spinner.css'

const Spinner = ({
  width = '18px',
  height = '18px',
  margin = '0 1px',
  color = '#333'
}) => {
  const styles = {
    width: width,
    height: height,
    margin: margin,
    backgroundColor: color
  }

  return (
    <div className='spinner'>
      <div className='bounce1' style={styles}></div>
      <div className='bounce2' style={styles}></div>
      <div className='bounce3' style={styles}></div>
    </div>
  )
}

export default Spinner
