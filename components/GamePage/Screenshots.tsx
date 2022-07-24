import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useWindowSize from "../../lib/functions/hooks/useWindowSize";
import { Short_Screenshot } from "../../types";

interface Props {
  isAnimated: boolean;
  images: Short_Screenshot[];
}

export default function Screenshots(props: Props) {
  const [width, height] = useWindowSize();

  const settings = {
    infinite: true,
    slidesToShow: width < 640 ? 2 : 3,
  };

  if (props.images.length === 0) return <div>Loading....</div>;

  return (
    <Slider
      {...settings}
      className={`ml-32 ${props.isAnimated
          ? "screenshots_animation_enabled"
          : "screenshots_animation_disabled"
        }`}
    >
      {props.images.map((s: Short_Screenshot, index: number) => (
        <div className="screenshot" key={index}>
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
  );
}
