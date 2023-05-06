import { useEffect, useState } from 'react'
import SearchLayout from '../../components/layout'
import { DetailedGame } from '../../types'
import WriteReview from '../../components/GamePage/WriteReview'
import { Review_Type } from '../../types/schema'
import Filters from '../../components/Filters'
import { useStore } from '../../store'
import { useRouter } from 'next/router'
import ErrorComponent from '../../components/ErrorComponent'
import { wretchWrapper } from '../../lib/functions/fetchLogic'
import Upper from '../../components/GamePage/Responsive/Upper'
import Footer from '../../components/GamePage/Responsive/Footer'
import clientPromise from '../../lib/functions/mongodb'

type Props = {
  game: DetailedGame
}

export default function GamePage(props: Props) {
  const store = useStore()
  const router = useRouter()
  const [game, setGame] = useState<DetailedGame | null>(null)
  const [writeReviewVisibility, setWriteReviewVisibility] = useState<boolean>(false)
  const [isUserRated, setIsUserRated] = useState<string | null>(null)
  const [reviews, setReviews] = useState<Review_Type[]>([])

  const loadAgain = async (): Promise<void> => {
    console.log('running')
    try {
      const gameData = await
        wretchWrapper(`/api/game/get/getGame?gameId=${router.query.id}`)
      if (gameData.game) {
        setGame(gameData.game)
      } else {
        throw new Error
      }
    } catch (e) {
      console.log('error', e)
    }
  }

  return (
    <SearchLayout>
      <>
        {store.isFilterOn ? <Filters /> : null}
        {!props.game && !game ?
          <ErrorComponent onLoad={() => loadAgain()} />
          :
          <>
            <main className="responsive_wrapper py-10" >
              <WriteReview
                isUserRated={isUserRated}
                onClose={() => setWriteReviewVisibility(false)}
                visible={writeReviewVisibility}
                insertNewReview={(review: Review_Type) =>
                  setReviews([...reviews, review])
                }
              />
              <Upper
                reviews={reviews}
                game={props.game ? props.game : game as DetailedGame}
                setIsUserRated={value => setIsUserRated(value)} />
            </main>
            <Footer
              reviews_state={reviews}
              update_reviews={(arr: Review_Type[]) => null}
              game={props.game}
              updateReviewsVisibility={(value) => setWriteReviewVisibility(value)}
            />
          </>
        }
      </>
    </SearchLayout>
  )
}

interface Context {
  params: {
    id: number
  }
}

export async function getStaticPaths() {
  if (process.env.NODE_ENV === 'development') return { paths: [], fallback: 'blocking' }

  try {
    const ids: number[] = []
    const client = await clientPromise
    const db = client.db()

    for (let i = 0; i <= 1500; i++) {
      const game = await db.collection('games').find({}).limit(1).skip(i).toArray()
      ids.push(game[0].id)
    }

    const paths = ids.map((id) => ({
      params: { id: JSON.stringify(id) },
    }))

    return { paths, fallback: 'blocking' }

  } catch (e) {
    console.log('error....', e)
    return { paths: [], fallback: 'blocking' }
  }
}

export async function getStaticProps(context: Context) {
  try {
    const client = await clientPromise
    const db = client.db()
    const gameData = await db.collection('games').
      findOne({ id: parseInt(context.params.id as unknown as string) })

    if (!gameData) {
      return {
        props: {
          game: null
        }
      }
    }

    const finalData: DetailedGame = {
      id: gameData.id,
      name: gameData.name,
      released: gameData.released,
      background_image: gameData.background_image,
      description: gameData.description,
      genres: gameData.genres,
      developers: gameData.developers,
      parent_platforms: gameData.parent_platforms,
      platforms: gameData.platforms,
      stores: gameData.stores,
      publishers: gameData.publishers,
      tags: gameData.tags,
      website: gameData.website,
      same_series: null,
    }

    return {
      props: {
        game: finalData
      }
    }
  } catch (e) {
    console.log(e)
    return {
      props: {
        game: null
      }
    }
  }
}
