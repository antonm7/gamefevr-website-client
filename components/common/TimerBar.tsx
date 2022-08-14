import { useEffect, useState } from 'react'

interface Props {
  start: boolean
}

export default function TimerBar({ start }: Props) {
  const [w, setW] = useState<number>(0)

  useEffect(() => {
    if (start) {
      setTimeout(() => {
        if (w > 288) {
          setW(0)
          return
        }
        setW(w + 1)
      }, 12)
    } else {
      setW(0)
    }
  }, [start, w])

  return (
    <div
      className="h-1 bg-red-200 absolute "
      style={{ bottom: 0, left: 0, width: `${w}px` }}
    >
      <div></div>
    </div>
  )
}
