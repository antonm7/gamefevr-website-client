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
    const gameData = await
      wretchWrapper(`/api/game/get/getGame?gameId=${router.query.id}`, 'loadAgain')
    if (gameData.game) {
      setGame(gameData.game)
    }
  }

  useEffect(() => { console.log('reviews', reviews) }, [reviews])

  return (
    <SearchLayout>
      <>
        {store.isFilterOn ? <Filters /> : null}
        {!props.game ?
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
                game={props.game}
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
  const ids: number[] = []

  try {
    for (let i = 1; i < 5; i++) {
      const getGamesData = await wretchWrapper(
        `https://api.rawg.io/api/games?key=${process.env.BUILD_GAMES_API}&dates=1990-01-01,2023-12-31&page=${i}&page_size=${100}`
        , 'getGamesData')
      ids.push(
        ...getGamesData.results.map((game) => game.id)
      )
    }
    const paths = ids.map((id) => ({
      params: { id: JSON.stringify(id) },
    }))

    return { paths, fallback: 'blocking' }

  } catch (e) {
    return { paths: [], fallback: 'blocking' }
  }

}

export async function getStaticProps(context: Context) {
  // const fetchSameSeries = () => wretchWrapper(`https://api.rawg.io/api/games/${context.params.id}/game-series?key=${process.env.BUILD_GAMES_KEY}`, 'sameSeriesData')

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
      screenshots: null,
      tags: gameData.tags,
      website: gameData.website,
      same_series: null,
    }

    return {
      props: {
        game: finalData,
      }
    }
  } catch (e) {
    return {
      props: {
        game: null
      }
    }
  }

}
