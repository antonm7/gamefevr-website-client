import React from 'react'
import Lottie from 'react-lottie'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'
import * as animationData from '../../public/animations/login.json'

const LoginAnimation = React.memo(() => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMaxYMax meet', // Supports the same options as the svg element's preserveAspectRatio property
      clearCanvas: false,
      hideOnTransparent: true, //Boolean, only svg renderer, hides elements when opacity reaches 0 (defaults to true)
      className: 'login-animation',
    },
  }
  const [width] = useWindowSize()
  return (
    <Lottie
      options={defaultOptions}
      style={{
        zIndex: 0,
        position: 'absolute',
        height: width > 1200 ? '100%' : width > 900 ? '60%' : '35%',
        top: width < 400 ? '-3rem' : '',

      }}
    ></Lottie>
  )
})

export default LoginAnimation
