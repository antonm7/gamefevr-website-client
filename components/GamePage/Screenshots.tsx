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
          <Image src={s.image} key={index} width={300} height={150}/>
        ))}
      </Slider>
  );
}