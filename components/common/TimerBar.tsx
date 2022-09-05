import { useEffect, useState } from 'react'

interface Props {
  start: boolean
  color: string
}

export default function TimerBar({ start, color }: Props) {
  const [w, setW] = useState<number>(0)

  useEffect(() => {
    if (start) {
      setTimeout(() => {
        if (w > 550) {
          setW(0)
          return
        }
        setW(w + 1)
      }, 4)
    } else {
      setW(0)
    }
  }, [start, w])

  return (
    <div
      className="h-1 absolute  opacity-75"
      style={{ bottom: 0, left: 0, width: `${w}px`, backgroundColor: color }}
    >
      <div></div>
    </div>
  )
}
