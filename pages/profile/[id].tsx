import { getSession } from 'next-auth/react'
import clientPromise from '../../lib/functions/mongodb'
import { ObjectId } from 'bson'
import { Favorite_Type, Review_Type } from '../../types/schema'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import CurrentProfile from '../../components/Profile/CurrentProfile/index'
import VisitedProfile from '../../components/Profile/VisitedProfile/index'
import { GetServerSidePropsContext } from 'next'
import * as mongoDB from 'mongodb'

interface Props {
  reviews: Review_Type[]
  favorites: Favorite_Type[]
  hype: string
  isHyped: boolean
  user: {
    username: string
    email: string
  }
  visited: boolean
}

export default function Profile({
  reviews,
  favorites,
  user,
  visited,
  isHyped,
  hype,
}: Props) {
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
        user={user}
      />
    )
  }
}

interface Context {
  // Type 'Context' does not satisfy the constraint 'ParsedUrlQuery'.
  // Index signature for type 'string' is missing in type 'Context'.ts(2344)
  [id: string]: string
  id: string
}

export async function getServerSideProps(
  context: GetServerSidePropsContext<Context>
) {
  const session = await getSession(context)

  try {
    let user, reviews, favorites
    const isVisited = context?.params?.id !==
      session?.user?.userId

    const client = await clientPromise
    const db = client.db()

    let isHyped = false

    if (isVisited) {
      const userCollection: mongoDB.Collection =
        db.collection('users')
      user = await userCollection.findOne({
        _id: new ObjectId(context?.params?.id),
      })

      if (user?.hyped_users.includes(context?.params?.id)) {
        isHyped = true
      } else {
        isHyped = false
      }

      const getReviews = () => db
        .collection('reviews')
        .find({ userId: context?.params?.id })

      const getFavorites = () => db
        .collection('favorites')
        .find({ userId: context?.params?.id })
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
        hype: user?.hype,
        visited: isVisited,
        isHyped: isHyped
      }
    }
  } catch (e) {
    return {
      props: {
        user: null,
      }
    }
  }
}
