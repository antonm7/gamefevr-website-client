import { useEffect, useState } from 'react'
import { useGlobalError } from '../../../store'
import Error from './Error'
import Request from './Request'
import Warning from './Warning'

interface Props {
  isVisible: boolean
  type: 'error' | 'warning' | 'request' | undefined
}
export default function GlobalError(props: Props) {
  const [visibility, setVisibility] = useState(props.isVisible)
  const [type, setType] = useState(props.type)
  const changeGlobalErrorVisibility = useGlobalError(
    (store) => store.setIsVisible
  )
  const text = useGlobalError((store) => store.text)

  useEffect(() => {
    if (props.isVisible) {
      setType(props.type)
      setVisibility(true)
      if (props.type !== 'request') {
        setTimeout(() => {
          setVisibility(false)
          changeGlobalErrorVisibility(false)
        }, 4000)
      }
    } else {
      setVisibility(false)
    }
  }, [props.isVisible])

  if (type === 'error') return <Error visibility={visibility} text={text} />

  if (type === 'warning') return <Warning visibility={visibility} text={text} />

  if (type === 'request')
    return (
      <Request
        visibility={visibility}
        answer={(val) => console.log(val)}
        text={text}
      />
    )
  return null
}
