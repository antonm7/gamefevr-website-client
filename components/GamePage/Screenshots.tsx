import Image from 'next/image'
import Slider from "react-slick"

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useEffect, useState } from 'react';

export default function Screenshots(props:any) {
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    console.log(props.width)
    setWidth(props.width)
  },[props.width])

  const settings = {
    infinite: true,
    slidesToShow: width < 640 ? 2 : 3,
  };

  if(props.images.length === 0) return (<div>Loading....</div>)

  return (
      <Slider {...settings} className="ml-32">
        {props.images.map((s:any,index:number) => (
          <div className="screenshot" key={index}>
            <Image quality="1" loading="eager" className="z-0" objectPosition='center' src={s.image} layout="fill" objectFit="cover" />
          </div>
        ))}
      </Slider>
  );
}