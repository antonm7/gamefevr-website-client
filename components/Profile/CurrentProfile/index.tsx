import { ObjectId } from 'bson'
import { useEffect, useState } from 'react'
import { useStore } from '../../../store'
import { Review_Type, Favorite_Type } from '../../../types/schema'
import Filters from '../../Filters'
import SearchLayout from '../../layout'
import SettingsBar from '../SettingsBar'
import ReviewsSlider from '../ReviewsSlider'
import FavoritesSlider from '../FavoritesSlider'
import ProfileHeader from '../../common/ProfileHeader'
import { useRouter } from 'next/router'

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

    const router = useRouter()
    const store = useStore()

    const changeVisibleSettings = (value: boolean): void => {
        setIsOpened(value)
    }

    useEffect(() => {
        if (user) {
            setUsername(user.username)
            setUserState(user)
            setReviewsState(reviews)
            setFavoritesState(favorites)
        } else {
            router.push('/')
        }
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
            <main className='py-10 responsive_wrapper'>
                {store.isFilterOn ? <Filters /> : null}
                <SettingsBar
                    onUsernameChange={(name) => setUsername(name)}
                    user={user}
                    isOpened={isOpened}
                    close={() => changeVisibleSettings(false)}
                />
                <ProfileHeader isHyped={true} visited={false} username={username} hype={hype} changeVisibleSettings={val => changeVisibleSettings(val)} />
                <ReviewsSlider visited={false} reviews={reviewsState} deleteReview={(id) => deleteReview(id)} />
                <FavoritesSlider visited={false} favorites={favoritesState} deleteFavorite={(id) => deleteFavorite(id)} />
            </main>
        </SearchLayout >
    )
}
