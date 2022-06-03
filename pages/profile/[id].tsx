import { faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRef, useState } from 'react'
import Slider from 'react-slick'
import SearchLayout from '../../components/layout/SearchLayout'
import Favorite from '../../components/Profile/Favorite'
import Reviews from '../../components/Profile/Reviews'
import SettingsBar from '../../components/Profile/SettingsBar'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Arrow from '../../components/Profile/Arrow'

export default function Profile() {
    const [isOpened, setIsOpened] = useState<boolean>(false)
    const slider = useRef<any>(null)

    const changeVisibleSettings = (value:boolean) => {
        setIsOpened(value)
    }

    const settings = {
        className: "center",
        centerPadding: "129px",
        infinite: true,
        slidesToShow: 3
    };
    
    const prev = () => slider.current.slickPrev()
    const next = () => slider.current.slickNext()

    const items = [{name:'Portal 2',image:'/images/example.webp'},{name:'Portal 2',image:'/images/example.webp'},{name:'Portal 2',image:'/images/example.webp'},{name:'Portal 2',image:'/images/example.webp'},{name:'Portal 2',image:'/images/example.webp'}]

    return (
        <SearchLayout>
            <main className="px-44 py-10">
             <SettingsBar isOpened={isOpened} method={() => changeVisibleSettings(false)}/>
                <div className='flex justify-between items-center'>
                    <h1 className='text-white font-bold text-4xl'>Welcome Anton!</h1>
                    {/* 
                    TODO:Check if it is needed
                    <h2>Need to verify your </h2> */}
                    <div className='flex items-center' onClick={() => changeVisibleSettings(true)}>
                        <FontAwesomeIcon icon={faGear} className="pr-2 cursor-pointer" style={{color:'#616e7e'}}/>
                        <p className="text-large font-semibold cursor-pointer" style={{color:'#616e7e'}}>Account Settings</p>
                    </div>
                </div>
                <div className='pt-24'>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-white font-bold text-3xl'>Your Reviews</h1>
                        <div className='flex items-center'>
                            <Arrow direction='left' onClick={() => prev()}/>
                            <Arrow direction='right' onClick={() => next()}/>
                        </div>
                    </div>
                    <div className='mt-6'>
                        <Slider {...settings} ref={slider}>
                            {items.map((obj:any,index:number) => (
                                <Favorite />
                            ))}
                        </Slider>

                    </div>
                </div>
                <div className='pt-24'>
                    <h1 className='text-white font-bold text-3xl'>Favorite Games</h1>
                    <div className='mt-6'>
                        <Reviews />
                    </div>
                </div>
            </main>
        </SearchLayout>
    )
}