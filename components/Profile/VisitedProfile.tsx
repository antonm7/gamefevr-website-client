import { useEffect, useState } from 'react'
import { useStore } from '../../store'
import { Review_Type, Favorite_Type } from '../../types/schema'
import Filters from '../Filters'
import SearchLayout from '../layout/SearchLayout'
import IndicateHype from './IndicateHype'
import ReviewsSlider from './ReviewsSlider'
import FavoritesSlider from './FavoritesSlider'

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
  const store = useStore()

  useEffect(() => {
    setUserState(user)
    setReviewsState(reviews)
    setFavoritesState(favorites)
  }, [user])

  if (!userState) return null

  return (
    <SearchLayout>
      <main className="px-44 py-10" id="profile_page">
        {store.isFilterOn ? <Filters /> : null}
        <div id="profile_page_welcome" className="flex items-center">
          <h1 id="welcome_title" className="text-white font-bold text-4xl">
            Welcome to {userState.username} profile!
          </h1>
          <IndicateHype hype={hype} />
        </div>
        <ReviewsSlider visited={true} reviews={reviewsState} deleteReview={() => null} />
        <FavoritesSlider visited={true} favorites={favoritesState} deleteFavorite={() => null} />

      </main>
    </SearchLayout>
  )
}
