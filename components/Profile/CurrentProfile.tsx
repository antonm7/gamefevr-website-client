import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ObjectId } from "bson";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import useWindowSize from "../../lib/functions/useWindowSize";
import { useStore } from "../../store";
import { Review_Type, Favorite_Type, Client_User } from "../../types/schema";
import Filters from "../Filters";
import SearchLayout from "../layout/SearchLayout";
import Favorite from "./Favorite";
import Review from "./Review";
import SettingsBar from "./SettingsBar";

interface Props {
    reviews: Review_Type[],
    favorites: Favorite_Type[],
    user:Client_User
}

export default function CurrentProfile(props:Props) {
    const [isOpened, setIsOpened] = useState<boolean>(false)
    const [user, setUser] = useState<any>(null)
    const [reviews, setReviews] = useState<Review_Type[]>([])
    const [favorites, setFavorites] = useState<Favorite_Type[]>([])
    const [width, height] = useWindowSize();

    const store = useStore()

    const changeVisibleSettings = (value:boolean) => {
        setIsOpened(value)
    }

    const settings = {
        infinite: false,
        slidesToShow: props.reviews.length >= 3 ? 3 : props.reviews.length
    }

    const favoritesSettings = {
        infinite: false,
        slidesToShow: width > 1440 ? props.favorites.length >= 4 ? 4 : props.favorites.length : width > 1200 ? props.favorites.length >= 3 ? 3 : props.favorites.length : props.favorites.length >= 2 ? 2 : props.favorites.length
    }

    useEffect(() => {
        setUser(props.user)
        setReviews(props.reviews)
        setFavorites(props.favorites)
    },[props.user])

    const deleteReview = (id:ObjectId | undefined) => {
        if(id) {
            const newReviews = reviews.filter((review:Review_Type) => review._id !== id)
            setReviews(newReviews)
        }
    }

    const deleteFavorite = (id:ObjectId | undefined) => {
        if(id) {
            const newFavorites = favorites.filter((favorite:Favorite_Type) => favorite._id !== id)
            setFavorites(newFavorites)
        }
    }
    
    if(!user) return null

    return (
        <SearchLayout>
            <main className="px-44 py-10" id="profile_page">
                {store.isFilterOn ? <Filters /> : null}
                <SettingsBar user={props.user} isOpened={isOpened} close={() => changeVisibleSettings(false)}/>
                <div id="profile_page_welcome" className='flex justify-between items-center'>
                    <h1 id="welcome_title" className='text-white font-bold text-4xl'>Welcome {user?.username}!</h1>
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
                        {reviews.length > 0 ?
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
                            </Slider> :
                            <div className='text-md text-white font-semibold opacity-30'>You don't have favorite games yet!</div>
                        }
                    </div>
                </div>
                <div className='pt-14'>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-white font-bold text-3xl'>Favorite Games</h1>
                    </div>
                    <div className='mt-12'>
                        {favorites.length > 0 ?
                            <Slider {...favoritesSettings}> 
                                {favorites.map((review:Favorite_Type,index:number) => (
                                    <Favorite 
                                        _id={review._id}
                                        key={index} 
                                        userId={review.userId} 
                                        created_at={review.created_at}    
                                        gameId={review.gameId}
                                        game_name={review.game_name}
                                        game_image={review.game_image}
                                        deleteFavorite={(id) => deleteFavorite(id)}
                                    />
                                ))}
                            </Slider> :
                            <div className='text-md text-white font-semibold opacity-30'>You don't have favorite games yet!</div>
                        }
                    </div>
                </div>
            </main>
        </SearchLayout>
    )
}