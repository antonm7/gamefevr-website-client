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
  hype: string
  user: {
    username: string
  }
}

interface User {
  username: string
}

export default function Visited({ reviews, favorites, user, hype }: Props) {
  const [userState, setUserState] = useState<User>()
  const [reviewsState, setReviewsState] = useState<Review_Type[]>([])
  const [favoritesState, setFavoritesState] = useState<Favorite_Type[]>([])
  const [width] = useWindowSize()
  const store = useStore()

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
        breakpoint: 640,
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
        breakpoint: 800,
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
            className={`mt-12 ${reviewsState.length === 2 && width > 1200
              ? 'w-[60rem]'
              : reviewsState.length === 3 && width > 1650
                ? 'w-[65%]'
                : 'w-full'
              }`}
          >
            {reviewsState.length > 0 ? (
              reviewsState.length === 2 && width >= 800 ? (
                <div
                  className={`flex  flex-nowrap ${width < 1650 ? 'justify-between' : 'justify-between'
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
                  className={`flex flex-nowrap ${width < 1700 ? 'justify-start' : 'justify-between'
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
                  <div className="w-2/5">
                    <Review
                      _id={review._id}
                      key={index}
                      userId={review.userId}
                      created_at={review.created_at}
                      gameId={review.gameId}
                      game_name={review.game_name}
                      game_image={review.game_image}
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
            className={`mt-12 ${width < 760
              ? ''
              : favoritesState.length === 2 && width >= 1200
                ? 'w-[44rem]'
                : favoritesState.length === 3 && width >= 1650
                  ? 'w-[83%]'
                  : favoritesState.length === 2 && width <= 1200
                    ? 'w-[44rem]'
                    : favoritesState.length === 3 && width <= 1200
                      ? 'w-[44rem]'
                      : 'w-full'
              }`}
          >
            {favoritesState.length > 0 ? (
              favoritesState.length === 2 ? (
                <div
                  className={`flex flex-nowrap ${width < 1650 ? 'justify-between' : 'justify-between'
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
                      />
                    )
                  )}
                </div>
              ) : favoritesState.length <= 4 && width > 1650 ? (
                <div
                  className={`flex flex-nowrap ${width < 1650 ? 'justify-start' : 'justify-between'
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
                      />
                    )
                  )}
                </div>
              ) : favoritesState.length === 1 && width < 1200 && width > 800 ? (
                favoritesState.map((review: Favorite_Type, index: number) => (
                  <div className="w-2/5">
                    <Favorite
                      _id={review._id}
                      key={index}
                      userId={review.userId}
                      created_at={review.created_at}
                      gameId={review.gameId}
                      game_name={review.game_name}
                      game_image={review.game_image}
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
