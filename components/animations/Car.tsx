import Lottie from 'react-lottie';
import * as animationData from '../../public/animations/1920.json'


export default function Car() {
    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMinYMax meet', // Supports the same options as the svg element's preserveAspectRatio property
          clearCanvas: false,
          hideOnTransparent: true, //Boolean, only svg renderer, hides elements when opacity reaches 0 (defaults to true)
          className: 'some-css-class-name',
        }
      };
      return <Lottie options={defaultOptions}
      style={{zIndex:0,position:'absolute',bottom:0,left:0}}></Lottie>
}