import { faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import Slider from 'react-slick'
import SearchLayout from '../../components/layout/SearchLayout'
import Favorite from '../../components/Profile/Favorite'
import Review from '../../components/Profile/Review'
import SettingsBar from '../../components/Profile/SettingsBar'
import { getSession } from 'next-auth/react'
import clientPromise from '../../lib/functions/mongodb'
import { ObjectId } from 'bson'
import { Review_Type } from '../../types/schema'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Profile(props:any) {
    const [isOpened, setIsOpened] = useState<boolean>(false)
    const [user, setUser] = useState<any>(null)
    const [reviews, setReviews] = useState<Review_Type[]>([])

    const changeVisibleSettings = (value:boolean) => {
        setIsOpened(value)
    }

    const settings = {
        infinite: false,
        slidesToShow: props.reviews.length >= 3 ? 3 : props.reviews.length
    }

    const favoritesSettings = {
        infinite: false,
        slidesToShow: 4
    }

    const items = [{name:'Portal 2',image:'/images/example.webp'}]

    useEffect(() => {
        setUser(props.user)
        setReviews(props.reviews)
    },[props.user])

    const deleteReview = (id:ObjectId | undefined) => {
        if(id) {
            const newReviews = reviews.filter((review:Review_Type) => review._id !== id)
            setReviews(newReviews)
        }
    }

    if(!user) {
        return null
    } else {
        return <SearchLayout>
            <main className="px-44 py-10">
            <SettingsBar isOpened={isOpened} method={() => changeVisibleSettings(false)}/>
                <div className='flex justify-between items-center'>
                    <h1 className='text-white font-bold text-4xl'>Welcome {user.username}</h1>
                    <div className='flex items-center' onClick={() => changeVisibleSettings(true)}>
                        <FontAwesomeIcon icon={faGear} className="h-4 pr-2 cursor-pointer" style={{color:'#616e7e'}}/>
                        <p className="text-large font-semibold cursor-pointer" style={{color:'#616e7e'}}>Account Settings</p>
                    </div>
                </div>
                <div className='pt-24'>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-white font-bold text-3xl'>Your Reviews</h1>
                    </div>
                    <div className='mt-12'>
                        <Slider {...settings}>
                            {reviews.map((review:Review_Type,index:number) => (
                                <Review 
                                    key={index} 
                                    _id={review._id} 
                                    likes={review.likes} 
                                    dislikes={review.dislikes} 
                                    gameId={review.gameId} 
                                    userId={review.userId} 
                                    created_at={review.created_at} 
                                    text={review.text} 
                                    rank={review.rank} 
                                    game_name={review.game_name} 
                                    game_image={review.game_image}
                                    deleteReview={(id) => deleteReview(id)} />
                            ))}
                        </Slider>
                    </div>
                </div>
                <div className='pt-14'>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-white font-bold text-3xl'>Favorite Games</h1>
                    </div>
                    <div className='mt-12'>
                        <Slider {...favoritesSettings}> 
                            {items.map((obj:any,index:number) => (
                                <Favorite key={index}/>
                            ))}
                        </Slider>
                    </div>
                </div>
            </main>
        </SearchLayout>
    }
}

export async function getServerSideProps(context:any) {
    const session:any = await getSession(context)

    try {
        const client = await clientPromise
        const db = client.db('gameFevr')
        const user:any = await db.collection('users').findOne({_id:new ObjectId(session?.user?.userId)})

        const reviews = await db.collection('reviews').find({userId:session?.user?.userId}).toArray()

        return {
            props: {
                user: {
                username: user.username,
                },
                favorite: user.favorite,
                reviews:JSON.parse(JSON.stringify(reviews))
            }
        }

    } catch (e) {
        console.log(e)
        return {
            props: {
                user:null
            }
        }
    }
}
