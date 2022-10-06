import { faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ObjectId } from 'bson'
import { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'
import { useStore } from '../../store'
import { Review_Type, Favorite_Type, Client_User } from '../../types/schema'
import Filters from '../Filters'
import SearchLayout from '../layout/SearchLayout'
import Favorite from './Favorite'
import Review from './Review'
import SettingsBar from './SettingsBar'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'

interface Props {
  reviews: Review_Type[]
  favorites: Favorite_Type[]
  user: Client_User
}

export default function CurrentProfile({ reviews, favorites, user }: Props) {
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const [userState, setUserState] = useState<Client_User>()
  const [reviewsState, setReviewsState] = useState<Review_Type[]>([])
  const [favoritesState, setFavoritesState] = useState<Favorite_Type[]>([])
  const [width] = useWindowSize()
  const store = useStore()

  const changeVisibleSettings = (value: boolean): void => {
    setIsOpened(value)
  }

  const settings = {
    infinite: false,
    slidesToShow: reviews.length >= 3 ? 3 : reviews.length,
    responsive: [
      {
        breakpoint: 1700,
        settings: {
          slidesToShow: reviews.length >= 2 ? 2 : reviews.length,
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
        breakpoint: 1600,
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

  const deleteReview = (id: ObjectId | undefined): void => {
    if (id) {
      const newReviews = reviewsState.filter(
        (review: Review_Type) => review._id !== id
      )
      setReviewsState(reviewsState.splice(0, reviewsState.length))
      setReviewsState(newReviews)
    }
  }

  const deleteFavorite = (id: ObjectId | undefined): void => {
    if (id) {
      const newFavorites = favorites.filter(
        (favorite: Favorite_Type) => favorite._id !== id
      )
      setFavoritesState(favorites.splice(0, favorites.length))
      setFavoritesState(newFavorites)
    }
  }

  const favoriteRef = useRef(null)
  const reviewsRef = useRef(null)

  if (!userState) return null

  return (
    <SearchLayout>
      <main className="px-44 py-10" id="profile_page">
        {store.isFilterOn ? <Filters /> : null}

        <SettingsBar
          user={user}
          isOpened={isOpened}
          close={() => changeVisibleSettings(false)}
        />
        <div
          id="profile_page_welcome"
          className="flex justify-between items-center"
        >
          <h1 id="welcome_title" className="text-white font-bold text-4xl">
            Welcome {userState?.username}!
          </h1>
          <div
            className="flex items-center"
            onClick={() => changeVisibleSettings(true)}
          >
            <FontAwesomeIcon
              icon={faGear}
              className="h-4 pr-2 cursor-pointer"
              style={{ color: '#616e7e' }}
            />
            <p
              className="text-large font-semibold cursor-pointer"
              style={{ color: '#616e7e' }}
            >
              Account Settings
            </p>
          </div>
        </div>
        <div className="pt-24">
          <h1 className="text-white font-bold text-3xl">Your Reviews</h1>
          <div
            className={`mt-12 
          ${reviewsState.length >= 4
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
                    deleteReview={(id) => deleteReview(id)}
                    user_name={review.user_name}
                  />
                ))}
              </Slider>
            ) : (
              <div className="text-md text-white font-semibold opacity-30">
                You don't have favorite games yet!
              </div>
            )}
          </div>
        </div>
        <div className="pt-14">
          <h1 className="text-white font-bold text-3xl">Favorite Games</h1>
          <div
            className={`mt-12 
          ${favoritesState.length >= 4
                ? 'w-full'
                : favoritesState.length === 3
                  ? 'w-full'
                  : favoritesState.length === 2 && width < 1600
                    ? 'w-full'
                    : 'w-80p'
              } `}
          >
            {favoritesState.length > 0 ? (
              <Slider {...favoritesSettings} ref={favoriteRef}>
                {favoritesState.map((review: Favorite_Type, index: number) => (
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
              </Slider>
            ) : (
              <div className="text-md text-white font-semibold opacity-30">
                You don't have favorite games yet!
              </div>
            )}
          </div>
        </div>
      </main>
    </SearchLayout>
  )
}
