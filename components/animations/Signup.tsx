import Lottie from 'react-lottie'
import * as animationData from '../../public/animations/signup.json'
import React from 'react'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'

const SignupAnimation = React.memo(() => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMaxYMax meet', // Supports the same options as the svg element's preserveAspectRatio property
      clearCanvas: false,
      hideOnTransparent: true, //Boolean, only svg renderer, hides elements when opacity reaches 0 (defaults to true)
      className: 'signup-animation',
    },
  }
  const [width] = useWindowSize()
  return (
    <Lottie
      options={defaultOptions}
      style={{
        zIndex: 0,
        position: width > 640 ? 'absolute' : 'relative',
        height: width > 640 ? '100%' : '25rem',
        bottom: 0,
      }}
    ></Lottie>
  )
})

export default SignupAnimation
