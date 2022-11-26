import React from 'react'
import Lottie from 'react-lottie'
import * as animationData from '../../../public/animations/seperate/car.json'

const Car = React.memo(() => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMaxYMax meet', // Supports the same options as the svg element's preserveAspectRatio property
            clearCanvas: false,
            hideOnTransparent: true, //Boolean, only svg renderer, hides elements when opacity reaches 0 (defaults to true)
            className: 'some-css-class-name',
        },
    }

    return (
        <Lottie
            options={defaultOptions}
            style={{
                zIndex: 3,
                position: 'absolute',
                bottom: 0,
                width: '12rem'
            }}
        ></Lottie>
    )
})
export default Car
