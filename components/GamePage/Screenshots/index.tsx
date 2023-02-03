import Image from 'next/image'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import useWindowSize from '../../../lib/functions/hooks/useWindowSize'
import { Short_Screenshot } from '../../../types'
import styles from './index.module.scss'
interface Props {
  isAnimated: boolean
  images: Short_Screenshot[]
  setRef?: any
}

export default function Screenshots({ isAnimated, images, setRef }: Props) {
  const [width] = useWindowSize()

  const settings = {
    infinite: false,
    slidesToShow: width < 640 ? 2 : 3,
  }

  if (images.length === 0) return <div>Loading....</div>

  return (
    <Slider
      className={styles.slider_container}
      ref={setRef}
      arrows={false}
      {...settings}
    >
      {images.map((s: Short_Screenshot) => (
        <div key={s.id} className='relative h-[450px] w-[450px]'>
          <Image
            quality="1"
            loading="eager"
            className="z-0"
            objectPosition="center"
            src={s.image}
            layout="fill"
            objectFit="cover"
          />
        </div>
      ))}
    </Slider>
  )
}
