/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState } from 'react'
import Error from './Error'
import Request from './Request'
import Sucssess from './Sucssess'
import Warning from './Warning'
import PubSub from 'pubsub-js'
import { OPEN_ALERT_TYPE } from '../../../types'

export default function GlobalError() {
  const [visibility, setVisibility] = useState(false)
  const [type, setType] = useState<'error' | 'warning' | 'request' | 'success' | null>(null)
  const [msg, setMsg] = useState<string>('')
  const [requestOwner, setRequestOwner] = useState<string>('')

  const OPEN_ALERT_FUNCTION = (data: any, objectData: OPEN_ALERT_TYPE): void => {
    if (objectData.type === 'request') {
      setRequestOwner(objectData.requestOwner!)
    }
    setType(objectData.type)
    setVisibility(true)
    setMsg(objectData.msg)
    if (objectData.type !== 'request') {
      setTimeout(() => {
        setVisibility(false)
      }, 1450)
    }
    PubSub.unsubscribe(openToken)
  }

  const CLOSE_ALERT_FUNCTION = (): void => {
    setVisibility(false)
    PubSub.unsubscribe(closeToken)
  }

  const openToken = PubSub.subscribe('OPEN_ALERT', OPEN_ALERT_FUNCTION)
  const closeToken = PubSub.subscribe('CLOSE_ALERT', CLOSE_ALERT_FUNCTION)

  if (type === 'error') return <Error close={() => setVisibility(false)} visibility={visibility} text={msg} />

  if (type === 'warning') return <Warning close={() => setVisibility(false)} visibility={visibility} text={msg} />

  if (type === 'request') return <Request owner={requestOwner} visibility={visibility} text={msg} />

  if (type === 'success') return <Sucssess close={() => setVisibility(false)} visibility={visibility} text={msg} />

  return null
}
