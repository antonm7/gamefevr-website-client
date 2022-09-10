import { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'
import { useStore } from '../../store'
import { Review_Type, Favorite_Type, Client_User } from '../../types/schema'
import Filters from '../Filters'
import SearchLayout from '../layout/SearchLayout'
import Favorite from './Favorite'
import Review from './Review'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'

interface Props {
  reviews: Review_Type[]
  favorites: Favorite_Type[]
  user: Client_User
}

export default function Visited({ reviews, favorites, user }: Props) {
  const [userState, setUserState] = useState<Client_User>()
  const [reviewsState, setReviewsState] = useState<Review_Type[]>([])
  const [favoritesState, setFavoritesState] = useState<Favorite_Type[]>([])
  const [width] = useWindowSize()
  const store = useStore()

  const settings = {
    infinite: false,
    slidesToShow: reviews.length >= 3 ? 3 : reviews.length,
    responsive: [
      {
        breakpoint: 1700,
        settings: {
          slidesToShow: favorites.length >= 2 ? 2 : favorites.length,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  const favoritesSettings = {
    infinite: false,
    slidesToShow: favorites.length >= 4 ? 4 : favorites.length,
    responsive: [
      {
        breakpoint: 1700,
        settings: {
          slidesToShow: favorites.length >= 3 ? 3 : favorites.length,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: favorites.length >= 2 ? 2 : favorites.length,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  useEffect(() => {
    setUserState(user)
    setReviewsState(reviews)
    setFavoritesState(favorites)
  }, [user])

  const favoriteRef = useRef<any>(null)
  const reviewsRef = useRef<any>(null)

  if (!userState) return null

  return (
    <SearchLayout>
      <main className="px-44 py-10" id="profile_page">
        {store.isFilterOn ? <Filters /> : null}
        <div
          id="profile_page_welcome"
          className="flex justify-between items-center"
        >
          <h1 id="welcome_title" className="text-white font-bold text-4xl">
            Welcome to {userState.username} profile!
          </h1>
        </div>
        <div className="pt-24">
          <h1 className="text-white font-bold text-3xl">Reviews</h1>
          <div
            className={`mt-12 
            ${
              reviewsState.length >= 4
                ? 'w-full'
                : reviewsState.length === 3
                ? 'w-full'
                : reviewsState.length === 2 && width < 1600
                ? 'w-full'
                : 'w-80p'
            } `}
          >
            {reviewsState.length > 0 ? (
              <Slider {...settings} ref={reviewsRef}>
                {reviewsState.map((review: Review_Type, index: number) => (
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
                    visited={true}
                    user_name={review.user_name}
                  />
                ))}
              </Slider>
            ) : (
              <div className="text-md text-white font-semibold opacity-30">
                No Reviews
              </div>
            )}
          </div>
        </div>
        <div className="pt-14">
          <h1 className="text-white font-bold text-3xl">Favorite Games</h1>
          <div
            className={`mt-12 
            ${
              favoritesState.length >= 4
                ? 'w-full'
                : favoritesState.length === 3
                ? 'w-full'
                : favoritesState.length === 2 && width < 1600
                ? 'w-full'
                : 'w-80p'
            } `}
          >
            {favoritesState.length > 0 ? (
              <Slider
                className="ml-48"
                {...favoritesSettings}
                ref={favoriteRef}
              >
                {favoritesState.map((review: Favorite_Type, index: number) => (
                  <Favorite
                    _id={review._id}
                    key={index}
                    userId={review.userId}
                    created_at={review.created_at}
                    gameId={review.gameId}
                    game_name={review.game_name}
                    game_image={review.game_image}
                    visited={true}
                  />
                ))}
              </Slider>
            ) : (
              <div className="text-md text-white font-semibold opacity-30">
                No Favorite Games
              </div>
            )}
          </div>
        </div>
      </main>
    </SearchLayout>
  )
}
