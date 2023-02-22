import { useEffect, useReducer, useState } from 'react'
import SearchLayout from '../../components/layout'
import { DetailedGame, same_series_type, Screenshot, ShortGame } from '../../types'
import WriteReview from '../../components/GamePage/WriteReview'
import { Review_Type } from '../../types/schema'
import Filters from '../../components/Filters'
import { useStore } from '../../store'
import { useRouter } from 'next/router'
import ErrorComponent from '../../components/ErrorComponent'
import SmallLoader from '../../components/common/SmallLoader'
import { wretchWrapper, promiseHandler } from '../../lib/functions/fetchLogic'
import Upper from '../../components/GamePage/Responsive/Upper'
import Footer from '../../components/GamePage/Responsive/Footer'
import { PromiseHandlerProps } from '../../types/request'

type Props = {
  game: DetailedGame
}

type Loaders_State = {
  globalLoading: boolean
  reviewsLoading: boolean
}

type Loaders_Action = {
  type: 'global' | 'reviews' | 'none' | 'all',
  value: boolean
}

const loadersReducer = (state: Loaders_State, action: Loaders_Action) => {
  switch (action.type) {
    case 'global': {
      return {
        globalLoading: action.value,
        reviewsLoading: state.reviewsLoading
      }
    }
    case 'reviews': {
      return {
        globalLoading: state.globalLoading,
        reviewsLoading: action.value
      }
    }
    case 'none': {
      return {
        globalLoading: false,
        reviewsLoading: false
      }
    }
    case 'all': {
      return {
        globalLoading: true,
        reviewsLoading: true
      }
    }
  }
}

interface fetchReviewsType {
  error: null | string
  reviews: Review_Type[]
}

interface fetchGameData {
  game: DetailedGame
  reviews: Review_Type[]
}

export default function GamePage(props: Props) {
  const store = useStore()
  const router = useRouter()
  const [game, setGame] = useState<DetailedGame | null>(null)
  const [writeReviewVisibility, setWriteReviewVisibility] = useState<boolean>(false)
  const [isUserRated, setIsUserRated] = useState<string | null>(null)
  const [reviews, setReviews] = useState<Review_Type[]>([])
  const [loaders, setLoaders] = useReducer(loadersReducer, {
    globalLoading: true, reviewsLoading: true
  })

  const loadReviews = async () => {
    const fetchReviews =
      await wretchWrapper(`/api/game/get/getReviews?gameId=${router.query.id}`,
        'loadReviews') as fetchReviewsType
    setReviews(fetchReviews.reviews)
    setLoaders({ type: 'reviews', value: false })
  }

  useEffect(() => {
    setGame(props.game)
    loadReviews()
    setLoaders({ type: 'none', value: false })
    loadAgain()
  }, [router.query.id, props.game])

  const loadAgain = async (): Promise<void> => {
    setLoaders({ type: 'global', value: true })
    const gameData = await
      wretchWrapper(`/api/game/get/getGame?gameId=${router.query.id}`, 'loadAgain') as fetchGameData
    if (gameData.game) {
      setGame(gameData.game)
      setReviews(gameData.reviews)
    }
    setLoaders({ type: 'global', value: false })
  }

  return (
    <SearchLayout>
      {loaders.globalLoading ? (
        <SmallLoader screenCentered={true} />
      ) : !game ? (
        <ErrorComponent onLoad={() => loadAgain()} />
      ) : (
        <>
          {store.isFilterOn ? <Filters /> : null}
          <main className="responsive_wrapper py-10" >
            <WriteReview
              isUserRated={isUserRated}
              onClose={() => setWriteReviewVisibility(false)}
              visible={writeReviewVisibility}
              insertNewReview={(review: Review_Type) =>
                setReviews([...reviews, review])
              }
            />
            <Upper reviews={reviews}
              game={game}
              setIsUserRated={value => setIsUserRated(value)} />
          </main>
          <Footer
            game={game}
            reviews={reviews}
            updateReviewsVisibility={(value) => setWriteReviewVisibility(value)}
            updateReviewsState={arr => setReviews(arr)}
            loaders={loaders}
          />
        </>
      )}
    </SearchLayout>
  )
}

interface Context {
  params: {
    id: number
  }
}

interface gamesDataFromApi {
  results: ShortGame[]
}

export async function getStaticPaths() {
  const ids: number[] = []

  for (let i = 1; i < 5; i++) {
    const getGamesData = await wretchWrapper(
      `https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&dates=1990-01-01,2023-12-31&page=${i}&page_size=${100}`
      , 'getGamesData') as gamesDataFromApi
    ids.push(
      ...getGamesData.results.map((game) => game.id)
    )
  }

  const paths = ids.map((id) => ({
    params: { id: JSON.stringify(id) },
  }))

  return { paths, fallback: 'blocking' }
}

export async function getStaticProps(context: Context) {
  const fetchGameData = () => wretchWrapper(`https://api.rawg.io/api/games/${context.params.id}?key=39a2bd3750804b5a82669025ed9986a8`, 'gameData')
  const fetchScreenshots = () => wretchWrapper(`https://api.rawg.io/api/games/${context.params.id}/screenshots?key=39a2bd3750804b5a82669025ed9986a8`, 'screenshotsData')
  const fetchTreilers = () => wretchWrapper(`https://api.rawg.io/api/games/${context.params.id}/movies?key=39a2bd3750804b5a82669025ed9986a8`, 'treilersData')
  const fetchSameSeries = () => wretchWrapper(`https://api.rawg.io/api/games/${context.params.id}/game-series?key=39a2bd3750804b5a82669025ed9986a8`, 'sameSeriesData')

  try {
    const result = await Promise.allSettled([
      fetchGameData(),
      fetchScreenshots(),
      fetchTreilers(),
      fetchSameSeries()
    ]) as PromiseHandlerProps[]

    const [gameData, screenshots, trailers, same_series]
      = promiseHandler(result) as [DetailedGame, Screenshot, object, same_series_type]

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
      screenshots,
      tags: gameData.tags,
      website: gameData.website,
      trailers,
      same_series,
    }

    return {
      props: {
        game: finalData,
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
