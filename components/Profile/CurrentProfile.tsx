import { faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ObjectId } from 'bson'
import { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'
import { useStore } from '../../store'
import { Review_Type, Favorite_Type } from '../../types/schema'
import Filters from '../Filters'
import SearchLayout from '../layout/SearchLayout'
import Favorite from './Favorite'
import Review from './Review'
import SettingsBar from './SettingsBar'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'
import IndicateHype from './IndicateHype'

interface Props {
  reviews: Review_Type[]
  favorites: Favorite_Type[]
  hype: string
  user: {
    email: string
    username: string
  }
}

interface User {
  email: string
  username: string
}

export default function CurrentProfile({
  reviews,
  favorites,
  user,
  hype,
}: Props) {
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const [userState, setUserState] = useState<User | null>(null)
  const [username, setUsername] = useState<string>('')
  const [reviewsState, setReviewsState] = useState<Review_Type[]>([])
  const [favoritesState, setFavoritesState] = useState<Favorite_Type[]>([])
  const [width] = useWindowSize()
  const store = useStore()

  const changeVisibleSettings = (value: boolean): void => {
    setIsOpened(value)
  }

  const reviewSettings = {
    infinite: false,
    slidesToShow: 3,
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
          slidesToShow: reviews.length >= 2 ? 2 : reviews.length,
        },
      },
      {
        breakpoint: 800,
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
        breakpoint: 1650,
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
    setUsername(user.username)
    setUserState(user)
    setReviewsState(reviews)
    setFavoritesState(favorites)
  }, [user])

  const deleteReview = (id: ObjectId | undefined): void => {
    if (id) {
      const newReviews = reviewsState.filter(
        (review: Review_Type) => review._id !== id
      )
      setReviewsState(newReviews)
    }
  }

  const deleteFavorite = (id: ObjectId | undefined): void => {
    if (id) {
      const newFavorites = favoritesState.filter(
        (favorite: Favorite_Type) => favorite._id !== id
      )
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
          onUsernameChange={(name) => setUsername(name)}
          user={user}
          isOpened={isOpened}
          close={() => changeVisibleSettings(false)}
        />
        <div
          id="profile_page_welcome"
          className="flex justify-between items-center"
        >
          <div className="flex items-center" id="profile_indicate_wrapper">
            <h1 id="welcome_title" className="text-white font-bold text-4xl">
              Welcome {username}!
            </h1>
            <IndicateHype hype={hype} />
          </div>
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
            className={`mt-12 ${
              reviewsState.length === 2 && width > 1200
                ? 'w-[60rem]'
                : reviewsState.length === 3 && width > 1650
                ? 'w-[65%]'
                : 'w-full'
            }`}
          >
            {reviewsState.length > 0 ? (
              reviewsState.length === 2 && width >= 800 ? (
                <div
                  className={`flex  flex-nowrap ${
                    width < 1650 ? 'justify-between' : 'justify-between'
                  }`}
                >
                  {reviewsState.map((review: Review_Type, index: number) =>
                    width < 1200 ? (
                      <div className="w-2/4">
                        <Review
                          _id={review._id}
                          key={index}
                          userId={review.userId}
                          created_at={review.created_at}
                          gameId={review.gameId}
                          game_name={review.game_name}
                          game_image={review.game_image}
                          deleteReview={(id) => deleteReview(id)}
                          user_name={review.user_name}
                          text={review.text}
                          rank={review.rank}
                          likes={review.likes}
                          dislikes={review.dislikes}
                        />
                      </div>
                    ) : (
                      <Review
                        _id={review._id}
                        key={index}
                        userId={review.userId}
                        created_at={review.created_at}
                        gameId={review.gameId}
                        game_name={review.game_name}
                        game_image={review.game_image}
                        deleteReview={(id) => deleteReview(id)}
                        user_name={review.user_name}
                        text={review.text}
                        rank={review.rank}
                        likes={review.likes}
                        dislikes={review.dislikes}
                      />
                    )
                  )}
                </div>
              ) : reviewsState.length <= 3 && width > 1700 ? (
                <div
                  className={`flex flex-nowrap ${
                    width < 1700 ? 'justify-start' : 'justify-between'
                  }`}
                >
                  {reviewsState.map((review: Review_Type, index: number) => (
                    <Review
                      _id={review._id}
                      key={index}
                      userId={review.userId}
                      created_at={review.created_at}
                      gameId={review.gameId}
                      game_name={review.game_name}
                      game_image={review.game_image}
                      deleteReview={(id) => deleteReview(id)}
                      user_name={review.user_name}
                      text={review.text}
                      rank={review.rank}
                      likes={review.likes}
                      dislikes={review.dislikes}
                    />
                  ))}
                </div>
              ) : reviewsState.length === 1 && width < 1200 && width > 800 ? (
                reviewsState.map((review: Review_Type, index: number) => (
                  <div>
                    <Review
                      _id={review._id}
                      key={index}
                      userId={review.userId}
                      created_at={review.created_at}
                      gameId={review.gameId}
                      game_name={review.game_name}
                      game_image={review.game_image}
                      deleteReview={(id) => deleteReview(id)}
                      user_name={review.user_name}
                      text={review.text}
                      rank={review.rank}
                      likes={review.likes}
                      dislikes={review.dislikes}
                    />
                  </div>
                ))
              ) : width < 800 ? (
                <Slider {...reviewSettings} ref={reviewsRef}>
                  {reviewsState.map((review: Review_Type, index: number) => (
                    <Review
                      _id={review._id}
                      key={index}
                      userId={review.userId}
                      created_at={review.created_at}
                      gameId={review.gameId}
                      game_name={review.game_name}
                      game_image={review.game_image}
                      deleteReview={(id) => deleteReview(id)}
                      user_name={review.user_name}
                      text={review.text}
                      rank={review.rank}
                      likes={review.likes}
                      dislikes={review.dislikes}
                    />
                  ))}
                </Slider>
              ) : (
                <Slider {...reviewSettings} ref={reviewsRef}>
                  {reviewsState.map((review: Review_Type, index: number) => (
                    <Review
                      _id={review._id}
                      key={index}
                      userId={review.userId}
                      created_at={review.created_at}
                      gameId={review.gameId}
                      game_name={review.game_name}
                      game_image={review.game_image}
                      deleteReview={(id) => deleteReview(id)}
                      user_name={review.user_name}
                      text={review.text}
                      rank={review.rank}
                      likes={review.likes}
                      dislikes={review.dislikes}
                    />
                  ))}
                </Slider>
              )
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
            className={`mt-12 ${
              width < 760
                ? ''
                : favoritesState.length === 2 && width >= 1200
                ? 'w-[44rem]'
                : favoritesState.length === 3 && width >= 1650
                ? 'w-[83%]'
                : favoritesState.length === 2 && width <= 1200
                ? 'w-[44rem]'
                : favoritesState.length === 3 && width <= 1200
                ? 'w-full'
                : 'w-full'
            }`}
          >
            {favoritesState.length > 0 ? (
              favoritesState.length === 2 && width > 760 ? (
                <div
                  className={`flex flex-nowrap ${
                    width < 1650 ? 'justify-between' : 'justify-between'
                  }`}
                >
                  {favoritesState.map((review: Favorite_Type, index: number) =>
                    width < 1200 ? (
                      <div className="w-2/4">
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
                      </div>
                    ) : (
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
                    )
                  )}
                </div>
              ) : favoritesState.length <= 4 && width > 1650 ? (
                <div
                  className={`flex flex-nowrap ${
                    width < 1650 ? 'justify-start' : 'justify-between'
                  }`}
                >
                  {favoritesState.map(
                    (review: Favorite_Type, index: number) => (
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
                    )
                  )}
                </div>
              ) : favoritesState.length === 1 && width < 1200 && width > 800 ? (
                favoritesState.map((review: Favorite_Type, index: number) => (
                  <div>
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
                  </div>
                ))
              ) : favoritesState.length === 1 && width < 800 ? (
                favoritesState.map((review: Favorite_Type, index: number) => (
                  <div className="w-full">
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
                  </div>
                ))
              ) : (
                <Slider {...favoritesSettings} ref={favoriteRef}>
                  {favoritesState.map(
                    (review: Favorite_Type, index: number) => (
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
                    )
                  )}
                </Slider>
              )
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
