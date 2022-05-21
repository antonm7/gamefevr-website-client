import { useEffect } from 'react'
import Flickity from 'react-flickity-component'
import Image from 'next/image'
export default function Screenshots(props:any) {
    
    useEffect(() => {
        console.log(props.images)
    },[])

   
    const flickityOptions:any =  {
      initialIndex:0,
      cellAlign: 'left',
      pageDots:false,
      prevNextButtons: false,
      // wrapAround: true,
      // draggable: true,
      // accessibility: false
    }

  return (
    <Flickity 
      className='w-full '
      options={flickityOptions}
      >
      <img src="https://placeimg.com/640/480/animals" className='w-5/6'/>
      <img src="https://placeimg.com/640/480/nature" className='w-full'/>
      <img src="https://placeimg.com/640/480/architecture" className='w-full'/>
     
    </Flickity>
  );
}