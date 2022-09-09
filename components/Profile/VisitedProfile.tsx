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

export default function Visited(props: Props) {
  const [user, setUser] = useState<Client_User>()
  const [reviews, setReviews] = useState<Review_Type[]>([])
  const [favorites, setFavorites] = useState<Favorite_Type[]>([])
  const [width] = useWindowSize()
  const store = useStore()

  const settings = {
    infinite: false,
    slidesToShow: props.reviews.length >= 3 ? 3 : props.reviews.length,
    responsive: [
      {
        breakpoint: 1700,
        settings: {
          slidesToShow:
            props.favorites.length >= 2 ? 2 : props.favorites.length,
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
    slidesToShow: props.favorites.length >= 4 ? 4 : props.favorites.length,
    responsive: [
      {
        breakpoint: 1700,
        settings: {
          slidesToShow:
            props.favorites.length >= 3 ? 3 : props.favorites.length,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow:
            props.favorites.length >= 2 ? 2 : props.favorites.length,
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
    setUser(props.user)
    setReviews(props.reviews)
    setFavorites(props.favorites)
  }, [props.user])

  const favoriteRef = useRef<any>(null)
  const reviewsRef = useRef<any>(null)

  if (!user) return null

  return (
    <SearchLayout>
      <main className="px-44 py-10" id="profile_page">
        {store.isFilterOn ? <Filters /> : null}
        <div
          id="profile_page_welcome"
          className="flex justify-between items-center"
        >
          <h1 id="welcome_title" className="text-white font-bold text-4xl">
            Welcome to {user.username} profile!
          </h1>
        </div>
        <div className="pt-24">
          <h1 className="text-white font-bold text-3xl">Reviews</h1>
          <div
            className={`mt-12 
            ${
              reviews.length >= 4
                ? 'w-full'
                : reviews.length === 3
                ? 'w-full'
                : reviews.length === 2 && width < 1600
                ? 'w-full'
                : 'w-80p'
            } `}
          >
            {reviews.length > 0 ? (
              <Slider {...settings} ref={reviewsRef}>
                {reviews.map((review: Review_Type, index: number) => (
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
              favorites.length >= 4
                ? 'w-full'
                : favorites.length === 3
                ? 'w-full'
                : favorites.length === 2 && width < 1600
                ? 'w-full'
                : 'w-80p'
            } `}
          >
            {favorites.length > 0 ? (
              <Slider
                className="ml-48"
                {...favoritesSettings}
                ref={favoriteRef}
              >
                {favorites.map((review: Favorite_Type, index: number) => (
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
