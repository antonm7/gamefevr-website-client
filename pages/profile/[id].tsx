import { faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import Slider from 'react-slick'
import SearchLayout from '../../components/layout/SearchLayout'
import Favorite from '../../components/Profile/Favorite'
import Reviews from '../../components/Profile/Reviews'
import SettingsBar from '../../components/Profile/SettingsBar'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export default function Profile() {
    const [isOpened, setIsOpened] = useState<boolean>(false)

    const changeVisibleSettings = (value:boolean) => {
        setIsOpened(value)
    }

    const settings = {
        infinite: true,
        slidesToShow: 4
    }

    const items = [{name:'Portal 2',image:'/images/example.webp'},{name:'Portal 2',image:'/images/example.webp'},{name:'Portal 2',image:'/images/example.webp'},{name:'Portal 2',image:'/images/example.webp'},{name:'Portal 2',image:'/images/example.webp'}]

    return (
        <SearchLayout>
            <main className="px-44 py-10">
             <SettingsBar isOpened={isOpened} method={() => changeVisibleSettings(false)}/>
                <div className='flex justify-between items-center'>
                    <h1 className='text-white font-bold text-4xl'>Welcome Anton!</h1>
                    <div className='flex items-center' onClick={() => changeVisibleSettings(true)}>
                        <FontAwesomeIcon icon={faGear} className="pr-2 cursor-pointer" style={{color:'#616e7e'}}/>
                        <p className="text-large font-semibold cursor-pointer" style={{color:'#616e7e'}}>Account Settings</p>
                    </div>
                </div>
                <div className='pt-24'>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-white font-bold text-3xl'>Your Reviews</h1>
                    </div>
                    <div className='mt-12'>
                        <Slider {...settings}> 
                            {items.map((obj:any,index:number) => (
                                <Reviews key={index}/>
                            ))}
                        </Slider>
                    </div>
                </div>
                <div className='pt-14'>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-white font-bold text-3xl'>Favorite Games</h1>
                    </div>
                    <div className='mt-12'>
                        <Slider {...settings}> 
                            {items.map((obj:any,index:number) => (
                                <Favorite key={index}/>
                            ))}
                        </Slider>
                    </div>
                </div>
            </main>
        </SearchLayout>
    )
}