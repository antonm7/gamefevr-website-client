import Lottie from "react-lottie";
import * as animationData from "../../public/animations/login.json";

export default function LoginAnimation() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMaxYMax meet", // Supports the same options as the svg element's preserveAspectRatio property
      clearCanvas: false,
      hideOnTransparent: true, //Boolean, only svg renderer, hides elements when opacity reaches 0 (defaults to true)
      className: "some-css-class-name",
    },
  };
  return (
    <Lottie
      options={defaultOptions}
      style={{ zIndex: 0, position: "absolute", bottom: 0 }}
    ></Lottie>
  );
}
