import React from 'react'
import Lottie from 'react-lottie'
import * as animationData from '../../public/animations/1920.json'
import * as lowData from '../../public/animations/low.json'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'

const Car = React.memo(() => {
  const [width] = useWindowSize()
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: width > 640 ? animationData : lowData,
    rendererSettings: {
      preserveAspectRatio: 'xMinYMax ', // Supports the same options as the svg element's preserveAspectRatio property
      clearCanvas: false,
      hideOnTransparent: true, //Boolean, only svg renderer, hides elements when opacity reaches 0 (defaults to true)
    },
  }

  return (
    <Lottie
      options={defaultOptions}
      style={{
        zIndex: 0,
        position: 'absolute',
        bottom: 0,

      }}
    ></Lottie>
  )
})
export default Car
