import { useEffect } from 'react'
import Flickity from 'react-flickity-component'
import Image from 'next/image'
export default function Screenshots(props:any) {
    
    useEffect(() => {
        console.log(props.images)
    },[])

    const flickityOptions = {
        // initialIndex:0,
        // cellAlign: 'left',
        // pageDots:false,
        // prevNextButtons: false,
        // wrapAround: true,
        // draggable: true,
        // accessibility: false
    }
    return (
        <Flickity
        className={'carousel'} // default ''
        elementType={'div'} // default 'div'
         // takes flickity options {}
        disableImagesLoaded={false} // default false
        reloadOnUpdate // default false
        static // default false
      >
        <div className='h-full w-full bg-red-500'>welcome</div>
        <div className='h-full w-full bg-red-500'>welcome</div>
        <div className='h-full w-full bg-red-500'>welcome</div>
        <div className='h-full w-full bg-red-500'>welcome</div>
      
      </Flickity>
    )
}