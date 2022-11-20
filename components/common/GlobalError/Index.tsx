import { useEffect, useState } from 'react'
import { useGlobalError } from '../../../store'
import Error from './Error'
import Request from './Request'
import Sucssess from './Sucssess'
import Warning from './Warning'

interface Props {
  isVisible: boolean
  propsType: 'error' | 'warning' | 'request' | 'success' | undefined
}

export default function GlobalError({ isVisible, propsType }: Props) {
  const [visibility, setVisibility] = useState(false)
  const [type, setType] = useState(propsType)
  const changeGlobalErrorVisibility = useGlobalError(
    (store) => store.setIsVisible
  )
  const text = useGlobalError((store) => store.text)

  useEffect(() => {
    console.log(isVisible, 'changed,')
    if (isVisible) {
      setType(propsType)
      setVisibility(true)
      if (propsType !== 'request') {
        setTimeout(() => {
          setVisibility(false)
          changeGlobalErrorVisibility(false)
        }, 1900)
      }
    } else {
      setVisibility(false)
      changeGlobalErrorVisibility(false)
    }
  }, [isVisible])

  if (type === 'error') return <Error visibility={visibility} text={text} />

  if (type === 'warning') return <Warning visibility={visibility} text={text} />

  if (type === 'request') return <Request visibility={visibility} text={text} />

  if (type === 'success')
    return <Sucssess visibility={visibility} text={text} />

  return null
}
