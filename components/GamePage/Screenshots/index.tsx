import Image from 'next/image'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import useWindowSize from '../../../lib/functions/hooks/useWindowSize'
import { Short_Screenshot } from '../../../types'
import styles from './index.module.scss'
import { useState, useEffect } from 'react'

interface Props {
  isVisible: boolean
  images: Short_Screenshot[]
  lower1200?: boolean
  setRef?: any
}

export default function Screenshots({ isVisible, images, setRef, lower1200 }: Props) {
  const [width] = useWindowSize()
  const [pushedRight, setPushedRight] = useState(false)
  const settings = {
    infinite: false,
    slidesToShow: width < 640 ? 2 : 3,
  }

  if (images.length === 0) return <div>Loading....</div>

  useEffect(() => {
    if (!isVisible) {
      setTimeout(() => {
        setPushedRight(true)
      }, 100)
    } else {
      setTimeout(() => {
        setPushedRight(false)
      }, 100)
    }
  }, [isVisible])

  return (
    <div ref={setRef} className={`${styles.slider_container} ${lower1200 ? 'relative z-0' : 'absolute'}`}     >
      <Slider
        arrows={false}
        {...settings}
      >
        {images.map((s: Short_Screenshot) => (
          <div key={s.id} className={`relative ${lower1200 ? 'w-[250px] h-[250px]' : 'w-[450px] h-[450px]'}`}>
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
    </div>
  )
}
