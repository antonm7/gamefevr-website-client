import { useState, useEffect } from 'react'
import { useFiltersStore } from '../../../store'

export default function useFiltersCount() {
  const [count, setCount] = useState<number>(0)
  const { consoles, genres, yearRange } = useFiltersStore()

  useEffect(() => {
    setCount(0)
    if (consoles.length > 0) {
      setCount((n) => (n += consoles.length))
    }
    if (genres.length > 0) {
      setCount((n) => (n += genres.length))
    }
    if (yearRange[0] === 1990 && yearRange[1] === 2022) {
      return
    } else {
      setCount((n) => (n += 1))
    }
  }, [consoles, genres, yearRange])

  return count
}
