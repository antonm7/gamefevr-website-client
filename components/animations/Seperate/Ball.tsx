import React from 'react'
import Lottie from 'react-lottie'
import * as animationData from '../../../public/animations/seperate/ball.json'

const Ball = React.memo(() => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData,
        rendererSettings: {
            // preserveAspectRatio: 'xMaxYMax meet', // Supports the same options as the svg element's preserveAspectRatio property
            clearCanvas: false,
            hideOnTransparent: true, //Boolean, only svg renderer, hides elements when opacity reaches 0 (defaults to true)
            className: 'some-css-class-name',
        },
    }

    return (
        <Lottie
            options={defaultOptions}
            style={{
                zIndex: 0,
                position: 'absolute',
                top: '-5rem',
                left: 0,
                width: '10rem'
            }}
        ></Lottie>
    )
})
export default Ball
