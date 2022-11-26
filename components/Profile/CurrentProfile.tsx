import { faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ObjectId } from 'bson'
import { useEffect, useState } from 'react'
import { useStore } from '../../store'
import { Review_Type, Favorite_Type } from '../../types/schema'
import Filters from '../Filters'
import SearchLayout from '../layout/SearchLayout'
import SettingsBar from './SettingsBar'
import IndicateHype from './IndicateHype'
import ReviewsSlider from './ReviewsSlider'
import FavoritesSlider from './FavoritesSlider'

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
  const store = useStore()

  const changeVisibleSettings = (value: boolean): void => {
    setIsOpened(value)
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
            id="account_settings_wrapper_titles"
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
        <ReviewsSlider visited={false} reviews={reviewsState} deleteReview={(id) => deleteReview(id)} />
        <FavoritesSlider visited={false} favorites={favoritesState} deleteFavorite={(id) => deleteFavorite(id)} />
      </main>
    </SearchLayout>
  )
}
