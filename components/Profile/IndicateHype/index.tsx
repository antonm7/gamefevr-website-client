import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { memo } from 'react'
import styles from './styles.module.scss'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

interface Props {
  hype: string
}

const IndicateHype = ({ hype }: Props) => {
  return (
    <div className="flex items-center ml-4" id={styles.wrapper}>
      <FontAwesomeIcon icon={faStar as IconProp} className=" text-specialYellow h-4" />
      <p className="text-white text-xl pl-2">{hype}</p>
    </div>
  )
}

export default memo(IndicateHype)
