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
      }, 3)
    } else {
      setW(0)
    }
  }, [start, w])

  return (
    <div
      className={`absolute opacity-75 bg-red-200 w-24`}
      style={{ bottom: 0, left: 0, width: `${w}px`, backgroundColor: color }}
    >
      <div></div>
    </div>
  )
}
