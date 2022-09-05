import {
  faCheck,
  faExclamation,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useGlobalError } from '../../../store'

interface Props {
  visibility: boolean
  text: string
  answer: (value: 'yes' | 'no') => void
}

export default function Request({ visibility, text }: Props) {
  const state = useGlobalError((state) => state)

  const onYes = () => {
    state.setAnswer('yes')
  }

  const onNo = () => {
    state.setAnswer('no')
  }

  return (
    <div
      id="global_error"
      className={`${
        visibility ? 'global_animation_enabled' : 'global_animation_disabled'
      } fixed flex z-50 h-20 pl-4 rounded-lg rounded-r-none`}
      style={{ backgroundColor: '#e7eefa', width: '26rem' }}
    >
      <div className="flex w-full items-center">
        <div className="flex items-center nowrap whitespace-nowrap w-full">
          <div
            className="rounded-full flex items-center justify-center mr-4 nowrap whitespace-nowrap"
            style={{
              height: '2.2rem',
              width: '2.2rem',
              backgroundColor: '#3087e9',
            }}
          >
            <div
              style={{
                height: '1.7rem',
                width: '1.7rem',
                backgroundColor: 'white',
              }}
              className="rounded-full flex items-center justify-center nowrap whitespace-nowrap"
            >
              <FontAwesomeIcon
                style={{ color: '#3087e9' }}
                className="h-5"
                icon={faExclamation}
              />
            </div>
          </div>

          <p
            className="text-white text-md font-semibold "
            style={{ color: '#645f5d' }}
          >
            {text ? text : null}
          </p>
        </div>
        <div className="flex mr-4">
          <div
            onClick={() => onYes()}
            style={{ backgroundColor: '#50dc6b' }}
            className="bg-green-500 w-16 h-8 rounded-lg flex items-center justify-center cursor-pointer"
          >
            <FontAwesomeIcon className="text-white h-5" icon={faCheck} />
          </div>
          <div
            onClick={() => onNo()}
            style={{ backgroundColor: '#fb5758' }}
            className="w-16 h-8 rounded-lg ml-2 flex items-center justify-center"
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="text-white h-5 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
