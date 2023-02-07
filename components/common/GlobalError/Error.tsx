import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './index.module.scss'

type Props = {
  visibility: boolean
  text: string
  close: () => void
}

export default function Error({ visibility, text, close }: Props) {

  if (!visibility) return null

  return (
    <div
      className={`${styles.wrapper} fixed flex z-50 w-96 h-20 pl-4 rounded-lg rounded-r-none`}
      style={{ backgroundColor: '#faeeeb' }}
    >
      <div className="flex w-full items-center">
        <div className="flex items-center nowrap whitespace-nowrap w-full">
          <div
            id="error_icon"
            className="rounded-full flex items-center justify-center mr-4 nowrap whitespace-nowrap"
            style={{
              height: '2.2rem',
              width: '2.2rem',
              backgroundColor: '#fc5758',
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
                style={{ color: '#fc5758' }}
                className="h-5"
                icon={faXmark}
              />
            </div>
          </div>
          <div>
            <p className=" text-lg font- leading-6" style={{ color: 'black' }}>
              {text ? 'Error' : 'Unexpected Error'}
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
          onClick={() => close}
        />
      </div>
    </div>
  )
}
