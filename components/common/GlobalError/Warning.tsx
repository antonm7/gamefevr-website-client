import { faExclamation, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
  visibility: boolean
  text: string
  close: () => void
}
export default function Warning({ visibility, text, close }: Props) {

  if (!visibility) return null

  return (
    <div
      id="global_error"
      className={`${visibility ? 'global_animation_enabled' : 'global_animation_disabled'
        } fixed flex z-50 w-96 h-20 pl-4 rounded-lg rounded-r-none`}
      style={{ backgroundColor: '#fdf8eb' }}
    >
      <div className="flex w-full items-center">
        <div className="flex items-center nowrap whitespace-nowrap w-full">
          <div
            className="rounded-full flex items-center justify-center mr-4 nowrap whitespace-nowrap"
            style={{
              height: '2.2rem',
              width: '2.2rem',
              backgroundColor: '#febf1f',
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
                style={{ color: '#febf1f' }}
                className="h-5"
                icon={faExclamation}
              />
            </div>
          </div>
          <div>
            <p className=" text-lg font- leading-6" style={{ color: 'black' }}>
              Warning
            </p>
            <p
              className="text-white text-md font-medium "
              style={{ color: '#645f5d' }}
            >
              {text ? text : 'something went wrong'}
            </p>
          </div>
        </div>
        <FontAwesomeIcon
          style={{ color: 'gray' }}
          className="h-5 mr-4 opacity-60 cursor-pointer hover:opacity-90"
          icon={faXmark}
          onClick={() => close()}
        />
      </div>
    </div>
  )
}
