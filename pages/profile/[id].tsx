import { getSession } from 'next-auth/react'
import clientPromise from '../../lib/functions/mongodb'
import { ObjectId } from 'bson'
import { Client_User, Favorite_Type, Review_Type } from '../../types/schema'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import CurrentProfile from '../../components/Profile/CurrentProfile'
import VisitedProfile from '../../components/Profile/VisitedProfile'
import { GetServerSidePropsContext } from 'next'

interface Props {
  reviews: Review_Type[]
  favorites: Favorite_Type[]
  user: Client_User
  visited: boolean
}

export default function Profile(props: Props) {
  if (props.visited) {
    return (
      <VisitedProfile
        reviews={props.reviews}
        favorites={props.favorites}
        user={props.user}
      />
    )
  } else {
    return (
      <CurrentProfile
        reviews={props.reviews}
        favorites={props.favorites}
        user={props.user}
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
    const isVisited =
      context?.params?.id !== JSON.stringify(session?.user?.userId)
    const client = await clientPromise
    const db = client.db('gameFevr')

    if (isVisited) {
      user = await db
        .collection('users')
        .findOne({ _id: new ObjectId(context?.params?.id) })
      reviews = await db
        .collection('reviews')
        .find({ userId: context?.params?.id })
        .toArray()
      favorites = await db
        .collection('favorites')
        .find({ userId: context?.params?.id })
        .toArray()
    } else {
      user = await db
        .collection('users')
        .findOne({ _id: new ObjectId(session?.user?.userId) })
      reviews = await db
        .collection('reviews')
        .find({ userId: session?.user?.userId })
        .toArray()
      favorites = await db
        .collection('favorites')
        .find({ userId: session?.user?.userId })
        .toArray()
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
        favorites: JSON.parse(JSON.stringify(favorites)),
        reviews: JSON.parse(JSON.stringify(reviews)),
        visited: isVisited,
      },
    }
  } catch (e) {
    console.log(e)
    return {
      props: {
        user: null,
      },
    }
  }
}
