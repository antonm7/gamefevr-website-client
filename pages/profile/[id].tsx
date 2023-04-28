import { getSession } from 'next-auth/react'
import clientPromise from '../../lib/functions/mongodb'
import { ObjectId } from 'bson'
import { type Favorite_Type, type Review_Type } from '../../types/schema'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import CurrentProfile from '../../components/Profile/CurrentProfile/index'
import VisitedProfile from '../../components/Profile/VisitedProfile/index'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

export default function Profile({
  reviews,
  favorites,
  user,
  visited,
  isHyped,
  hype,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (visited) {
    return (
      <VisitedProfile
        isHyped={isHyped}
        reviews={reviews}
        favorites={favorites}
        user={user}
        hype={hype}
      />
    )
  } else {
    return (
      <CurrentProfile
        hype={hype}
        reviews={reviews}
        favorites={favorites}
        user={user as { email: string, username: string }}
      />
    )
  }
}

interface PageProps {
  user: {
    username: string,
    email?: string
  },
  favorites: Favorite_Type[],
  reviews: Review_Type[],
  visited: boolean,
  isHyped: boolean,
  error: null | string,
  hype: string
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const session = await getSession(ctx)

  try {
    let user, reviews, favorites
    const isVisited = ctx?.params?.id !==
      session?.user?.userId

    const client = await clientPromise
    const db = client.db()

    let isHyped = false

    if (isVisited) {
      const userCollection =
        db.collection('users')
      user = await userCollection.findOne({
        _id: new ObjectId(ctx?.params?.id as string),
      })

      if (user?.hyped_users.includes(ctx?.params?.id)) {
        isHyped = true
      } else {
        isHyped = false
      }

      const getReviews = () => db
        .collection('reviews')
        .find({ userId: ctx?.params?.id })

      const getFavorites = () => db
        .collection('favorites')
        .find({ userId: ctx?.params?.id })
        .toArray()

      const ReviewsAndFavorites = await Promise.allSettled([getReviews(), getFavorites()])
      reviews = ReviewsAndFavorites[0]
      favorites = ReviewsAndFavorites[1]

    } else {
      const getUser = () => db
        .collection('users')
        .findOne({ _id: new ObjectId(session?.user?.userId) })

      const getReviews = () => db
        .collection('reviews')
        .findOne({ userId: session?.user?.userId })

      const getFavorites = () => db
        .collection('favorites')
        .find({ userId: session?.user?.userId })
        .toArray()

      const fetchedData: any = await Promise.allSettled([
        getUser(), getReviews(), getFavorites()
      ])

      user = fetchedData[0].value
      reviews = fetchedData[1].value
      favorites = fetchedData[2].value
    }

    return {
      props: {
        user: isVisited
          ? {
            username: user?.username,
          }
          : {
            username: user?.username,
            email: user?.email,
          },
        favorites: favorites ? JSON.parse(JSON.stringify(favorites)) : [],
        reviews: reviews ? JSON.parse(JSON.stringify(reviews)) : [],
        hype: user?.hype as string,
        visited: isVisited,
        isHyped: isHyped,
        error: null
      }
    }
  } catch (e) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
}