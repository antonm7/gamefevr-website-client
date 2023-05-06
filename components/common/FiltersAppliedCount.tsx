import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import useFiltersCount from '../../lib/functions/hooks/useFiltersCount'
import { useFiltersStore } from '../../store'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

type Props = {
  bigInput?: boolean
}

export default function FiltersAppliedCount({ bigInput }: Props) {
  const [hover, setHover] = useState<boolean>(false)
  const clearFilters = useFiltersStore(store => store.clearFilters)
  const filtersCount = useFiltersCount()

  if (filtersCount > 0) {
    return (
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`
            cursor-pointer flex 
            justify-center items-center ${bigInput ? 'right-12' : 'right-16'
          }
            absolute bg-cool-blue w-5 h-5 rounded-full 
            overflow-hidden `}
      >
        {hover ? (
          <FontAwesomeIcon
            className="text-white h-3"
            icon={faXmark as IconProp}
            onClick={() => clearFilters()}
          />
        ) : (
          <p className="text-white" style={{ fontSize: 12 }}>
            {filtersCount}
          </p>
        )}
      </div>
    )
  } else {
    return null
  }
}
