import { useEffect } from 'react'
import Image from 'next/image'
import Slider from "react-slick"

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Screenshots(props:any) {
  
const settings = {
    infinite: true,
    // speed: 500,
    slidesToShow: 3,
    // slidesToScroll: 1
  };

  if(props.images.length === 0) return (<div>Loading....</div>)

  return (
    <Slider {...settings}>
        {props.images.map((s:any,index:number) => (
          <div key={index} className="h-60 w-96 bg-cover bg-red-200 rounded-xl bg-center bg-no-repeat" style={{height:'14rem',backgroundImage: `url(${s.image})`}}>
            welcome
          </div>
        ))}
      </Slider>
  );
}