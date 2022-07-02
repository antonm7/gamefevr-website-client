import Slider from "react-slick"
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useWindowSize from '../../lib/functions/useWindowSize';
import Review from './Review';
import { Review_Type } from "../../types/schema";
import { useEffect } from "react";

export default function ReviewsSlider(props:any) {
  const [width, height] = useWindowSize();
  
  const settings = {
    infinite: false,
    width: width > 1400 ? 3 : 2
  };


  return (
      <Slider {...settings} className={`reviews_slider ${props.isAnimated ? 'reviews_animation_enable' : 'reviews_animation_disable'}`}>
        {props.reviews.map((review:Review_Type,index:number) => (
            <Review key={index} _id={review._id} likes={review.likes} dislikes={review.dislikes} gameId={review.gameId} userId={review.userId} created_at={review.created_at} text={review.text} rank={review.rank} />
          ))}
      </Slider>
  );
}