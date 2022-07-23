import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useGlobalError } from '../../store'
import TimerBar from './TimerBar'

interface Props {
  isVisible: boolean
}
export default function GlobalError(props: Props) {
  const [visibility, setVisibility] = useState<boolean>(props.isVisible)
  const changeGlobalErrorVisibility = useGlobalError(
    (store) => store.setIsVisible
  )
  const text = useGlobalError((store) => store.text)

  useEffect(() => {
    if (props.isVisible) {
      setVisibility(true)
      setTimeout(() => {
        setVisibility(false)
        changeGlobalErrorVisibility(false)
      }, 4000)
    }
  }, [props.isVisible])

  return (
    <div
      id="global_error"
      className={`${
        visibility ? 'global_animation_enabled' : 'global_animation_disabled'
      } fixed flex z-50 w-72 h-12 pl-4 rounded-sm`}
      style={{ backgroundColor: '#FEF2F2' }}
    >
      <div className="flex items-center nowrap whitespace-nowrap">
        <div
          className="bg-red-300 rounded-full flex items-center justify-center mr-4 nowrap whitespace-nowrap"
          style={{ height: '1.4rem', width: '1.4rem' }}
        >
          <FontAwesomeIcon className="h-3 text-white" icon={faXmark} />
        </div>
        <p
          className="text-white text-sm font-semibold"
          style={{ color: '#991B1B' }}
        >
          {text ? text : 'Something went wrong'}
        </p>
      </div>
      <TimerBar start={visibility} />
    </div>
  )
}
