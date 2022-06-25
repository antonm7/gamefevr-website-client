import Slider from "react-slick"

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useWindowSize from '../../lib/functions/useWindowSize';
import Review from './Review';

export default function ReviewsSlider(props:any) {
  const [width, height] = useWindowSize();
  
  const settings = {
    infinite: false,
    slidesToShow: width > 1400 ? 3 : 2
  };

  return (
      <Slider {...settings} className={`reviews_slider ${props.isAnimated ? 'reviews_animation_enable' : 'reviews_animation_disable'}`}>
        <Review />
        <Review />
        <Review />
        <Review />
      </Slider>
  );
}