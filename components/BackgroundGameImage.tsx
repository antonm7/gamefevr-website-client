import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import { useState } from 'react'

interface Props {
  bg: string | null
  movieUrl: string | null
}

export default function BackgroundGameImage({ bg, movieUrl }: Props) {
  const [movieVisibility, setMovieVisibility] = useState<boolean>(false)
  if (!bg) return <div className="bg-image overflow-hidden"></div>

  if (!movieUrl)
    return (
      <div className="bg-image overflow-hidden">
        <Image
          quality={55}
          loading="eager"
          className="z-0"
          src={bg}
          layout="fill"
          objectFit="cover"
          alt="Not Working!"
        />
      </div>
    )

  return (
    <div
      className="bg-image overflow-hidden cursor-pointer"
      onMouseEnter={() => setMovieVisibility(true)}
      onMouseLeave={() => setMovieVisibility(false)}
    >
      {movieVisibility ? (
        <div className="video-container rounded-xl overflow-hidden">
          <video autoPlay muted loop style={{ width: '100%', height: '14rem' }}>
            <source src={movieUrl} />
          </video>
        </div>
      ) : (
        <div>
          <Image
            quality={55}
            loading="eager"
            className="z-0"
            src={bg}
            layout="fill"
            objectFit="cover"
            alt="Not Working!"
          />
          <div className="opacity-80 left-4 bottom-4 bg-gray-900 absolute rounded-full w-12 h-12 flex items-center justify-center">
            <FontAwesomeIcon className="text-white h-5" icon={faPlay} />
          </div>
        </div>
      )}
    </div>
  )
}
