import { useState, useEffect } from 'react'

const useWidth = () => {
  const [width, setWidth] = useState(window.innerWidth || undefined)

  useEffect(() => {
    if (typeof window !== 'object') return false

    const handleResize = () => setWidth(window.innerWidth)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width
}

export default useWidth
