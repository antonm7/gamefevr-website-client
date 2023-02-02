import { useEffect, useState } from 'react'
import { useStore } from '../../../store'
import { Review_Type, Favorite_Type } from '../../../types/schema'
import Filters from '../../Filters'
import SearchLayout from '../../layout'
import ReviewsSlider from '../ReviewsSlider'
import FavoritesSlider from '../FavoritesSlider'
import ProfileHeader from '../../common/ProfileHeader'

interface Props {
  reviews: Review_Type[]
  favorites: Favorite_Type[]
  hype: string
  user: {
    username: string
  }
  isHyped: boolean
}

interface User {
  username: string
}

export default function Visited({ isHyped, reviews, favorites, user, hype }: Props) {
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
      <main className="px-44 py-10">
        {store.isFilterOn ? <Filters /> : null}
        <ProfileHeader isHyped={isHyped} visited={true} username={userState.username} hype={hype} changeVisibleSettings={() => null} />
        <ReviewsSlider visited={true} reviews={reviewsState} deleteReview={() => null} />
        <FavoritesSlider visited={true} favorites={favoritesState} deleteFavorite={() => null} />
      </main>
    </SearchLayout>
  )
}
