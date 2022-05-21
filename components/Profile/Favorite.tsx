import Image from 'next/image'
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.scss';

export default function Favorite(props:any) {

    const items = [
        // <div className='rounded bg-white item' data-value="1" style={{width:'290px',height:'230px'}}>
        //     <div className="relative" style={{minHeight:'75%',height:'75%',width:'100%'}}>
        //         <Image className='relative' quality="1" loading="eager" src='https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg' layout="fill" objectFit="cover" />
        //     </div>
        //     <h2 className='text-lg pt-3 pl-4 text-black font-semibold'>Game Name</h2>
        // </div>,
        
        // <div className='rounded bg-red-500 item' data-value="2" style={{width:'290px',height:'230px'}}>
        //     <div className="relative" style={{minHeight:'75%',height:'75%',width:'100%'}}>
        //         <Image className='relative' quality="1" loading="eager" src='https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg' layout="fill" objectFit="cover" />
        //     </div>
        //     <h2 className='text-lg pt-3 pl-4 text-black font-semibold'>Welcome</h2>
        // </div>
        <div className="item" data-value="1">1</div>,
    <div className="item" data-value="2">2</div>,
    <div className="item" data-value="3">3</div>,
    <div className="item" data-value="4">4</div>,
    <div className="item" data-value="5">5</div>,
    ];

    return (
        <AliceCarousel items={items} controlsStrategy="alternate"/>
    )
}