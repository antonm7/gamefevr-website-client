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
import Arrows from './Arrows'

interface Props {
  reviews: Review_Type[]
  favorites: Favorite_Type[]
  user: Client_User
}

export default function CurrentProfile(props: Props) {
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const [user, setUser] = useState<Client_User>()
  const [reviews, setReviews] = useState<Review_Type[]>([])
  const [favorites, setFavorites] = useState<Favorite_Type[]>([])

  const store = useStore()

  const changeVisibleSettings = (value: boolean) => {
    setIsOpened(value)
  }

  const settings = {
    infinite: false,
    slidesToShow: props.reviews.length >= 3 ? 3 : props.reviews.length,
    responsive: [
      {
        breakpoint: 1700,
        settings: {
          slidesToShow: props.reviews.length >= 2 ? 2 : props.reviews.length,
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
        breakpoint: 1600,
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

  const deleteReview = (id: ObjectId | undefined) => {
    if (id) {
      const newReviews = reviews.filter(
        (review: Review_Type) => review._id !== id
      )
      setReviews(reviews.splice(0, reviews.length))
      setReviews(newReviews)
    }
  }

  const deleteFavorite = (id: ObjectId | undefined) => {
    if (id) {
      const newFavorites = favorites.filter(
        (favorite: Favorite_Type) => favorite._id !== id
      )
      setFavorites(favorites.splice(0, favorites.length))
      setFavorites(newFavorites)
    }
  }

  const favoriteRef = useRef(null)
  const reviewsRef = useRef(null)

  if (!user) return null

  return (
    <SearchLayout>
      <main className="px-44 py-10" id="profile_page">
        {store.isFilterOn ? <Filters /> : null}

        <SettingsBar
          user={props.user}
          isOpened={isOpened}
          close={() => changeVisibleSettings(false)}
        />
        <div
          id="profile_page_welcome"
          className="flex justify-between items-center"
        >
          <h1 id="welcome_title" className="text-white font-bold text-4xl">
            Welcome {user?.username}!
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
          <div className="flex items-center justify-between">
            <h1 className="text-white font-bold text-3xl">Your Reviews</h1>
            <Arrows count={reviews.length} componentRef={reviewsRef} />
          </div>
          <div
            className={`mt-12 
          ${reviews.length >= 4
                ? 'w-full'
                : reviews.length === 3
                  ? 'w-full'
                  : reviews.length === 2
                    ? 'w-4/6'
                    : 'w-full'
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
          <div className="flex items-center justify-between">
            <h1 className="text-white font-bold text-3xl">Favorite Games</h1>
            <Arrows count={favorites.length} componentRef={favoriteRef} />
          </div>
          <div
            className={`mt-12 
          ${favorites.length >= 4
                ? 'w-full'
                : favorites.length === 3
                  ? 'w-3/4'
                  : favorites.length === 2
                    ? 'w-2/4'
                    : 'w-full'
              } `}
          >
            {favorites.length > 0 ? (
              <Slider {...favoritesSettings} ref={favoriteRef}>
                {favorites.map((review: Favorite_Type, index: number) => (
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
