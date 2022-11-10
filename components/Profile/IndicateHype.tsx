import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { memo } from 'react'

interface Props {
  hype: string
}

const IndicateHype = ({ hype }: Props) => {
  return (
    <div className="flex items-center mx-4">
      <FontAwesomeIcon icon={faStar} className=" text-specialYellow h-4" />
      <p className="text-white text-xl pl-2">{hype}</p>
    </div>
  )
}

export default memo(IndicateHype)
