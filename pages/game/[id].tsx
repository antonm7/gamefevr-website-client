import { useEffect, useReducer, useRef, useState } from 'react'
import SearchLayout from '../../components/layout'
import { DetailedGame, ShortGame } from '../../types'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'
import { useSession } from 'next-auth/react'
import WriteReview from '../../components/GamePage/WriteReview'
import { Review_Type } from '../../types/schema'
import Bigger640 from '../../components/GamePage/Responsive/Bigger640'
import Lower640 from '../../components/GamePage/Responsive/lower640'
import Filters from '../../components/Filters'
import { useStore } from '../../store'
import { ObjectId } from 'bson'
import { useRouter } from 'next/router'
import ErrorComponent from '../../components/ErrorComponent'
import Tags from '../../components/GamePage/Tags'
import Description from '../../components/GamePage/Description'
import FooterButtons from '../../components/GamePage/FooterButtons'
import SmallLoader from '../../components/common/SmallLoader'
import axios from 'axios'
import Lower1200Footer from '../../components/GamePage/Responsive/lower1200Footer'
import Bigger1200Footer from '../../components/GamePage/Responsive/Bigger1200Footer'
import SameSeries from '../../components/GamePage/SameSeries'
import { faL } from '@fortawesome/free-solid-svg-icons'

type Props = {
  game: DetailedGame
}

type Animation_State = {
  screenshotsAnimation: boolean
  reviewsAnimation: boolean
}

type Animation_Action = {
  type: 'screenshots' | 'reviews' | 'none',
  value: boolean
}

type Loaders_State = {
  globalLoading: boolean
  reviewsLoading: boolean
}


type Loaders_Action = {
  type: 'global' | 'reviews' | 'none' | 'all',
  value: boolean
}



const animationReducer = (state: Animation_State, action: Animation_Action) => {
  switch (action.type) {
    case 'screenshots': {
      return { screenshotsAnimation: action.value, reviewsAnimation: state.reviewsAnimation }
    }
    case 'reviews': {
      return { screenshotsAnimation: state.screenshotsAnimation, reviewsAnimation: action.value }
    }
    case 'none': {
      return { ...state }
    }
  }
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

export default function GamePage(props: Props) {
  const [width] = useWindowSize()
  const store = useStore()
  const router = useRouter()
  const session = useSession()
  const [game, setGame] = useState<DetailedGame | null>(null)
  const [writeReviewVisibility, setWriteReviewVisibility] = useState<boolean>(false)
  const [isUserRated, setIsUserRated] = useState<string | null>(null)
  const [reviews, setReviews] = useState<Review_Type[]>([])
  const [animations, setAnimations] = useReducer(animationReducer, { screenshotsAnimation: false, reviewsAnimation: false })
  const [loaders, setLoaders] = useReducer(loadersReducer, { globalLoading: true, reviewsLoading: true })

  const sliderRef = useRef(null)

  const loadReviews = async () => {
    try {
      const req = await axios.get(`/api/game/get/getReviews?gameId=${router.query.id}`)
      if (req.status === 200) {
        if (req.data.error) throw new Error(req.data.error)
        setReviews(req.data.reviews)
      } else {
        throw new Error()
      }
    } catch (e) {
      console.log('error loading game reviews', e)
    }
    setLoaders({ type: 'reviews', value: false })
  }

  useEffect(() => {
    setAnimations({ type: 'none', value: false })
    setGame(props.game)
    loadReviews()
    setLoaders({ type: 'none', value: false })
  }, [router.query.id, props.game])

  const navigateAuth = () => {
    if (session.status !== 'authenticated') {
      return router.push(`/register/login?back=${router.asPath}`)
    }
    const isAlreadyCommented = reviews.filter(
      (r) =>
        JSON.stringify(r.userId) === JSON.stringify(session.data.user.userId)
    )
    if (isAlreadyCommented.length > 0) {
      PubSub.publish('OPEN_ALERT', {
        type: 'warning',
        msg: 'You already commented this game'
      })
    } else {
      setWriteReviewVisibility(true)
    }
  }

  const toggleAnimation = () => {
    if (animations.reviewsAnimation) {
      setAnimations({ type: 'reviews', value: false })
      setTimeout(() => {
        setAnimations({ type: 'screenshots', value: false })
      }, 450)
    } else {
      setAnimations({ type: 'screenshots', value: true })
      setTimeout(() => {
        setAnimations({ type: 'reviews', value: true })
      }, 450)
    }
  }

  const deleteReview = (id: ObjectId | undefined): void => {
    if (id) {
      const newReviews = reviews.filter(
        (review: Review_Type) => review._id !== id
      )
      setReviews(newReviews)
    }
  }

  const loadAgain = async (): Promise<void> => {
    try {
      setLoaders({ type: 'global', value: true })
      const req = await axios.get(
        `/api/game/get/getGame?gameId=${router.query.id}`
      )
      if (req.status === 200) {
        setGame(req.data.game)
        setReviews(req.data.reviews)
      } else {
        throw new Error()
      }
    } catch (e) {
      setGame(null)
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
        <div>
          {store.isFilterOn ? <Filters /> : null}
          <main className="px-44 py-10" id="game_page">
            <WriteReview
              isUserRated={isUserRated}
              onClose={() => setWriteReviewVisibility(false)}
              visible={writeReviewVisibility}
              insertNewReview={(review: Review_Type) =>
                setReviews([...reviews, review])
              }
            />
            {width > 640 ? (
              <Bigger640
                reviews={reviews}
                game={game}
                changeIsUserRated={(value) => setIsUserRated(value)}
              />
            ) : (
              <Lower640
                reviews={reviews}
                game={game}
                changeIsUserRated={(value) => setIsUserRated(value)}
              />
            )}
            <div className="flex justify-between" id="game_description_row">
              <Description desc={game.description} />
              <SameSeries games={game.same_series} />
            </div>
            <Tags tags={game.tags} />
          </main>
          <div>
            {width > 1200 ? (
              <Bigger1200Footer
                screenshots={game.screenshots.results}
                reviews={reviews}
                reviewsAnimation={animations.reviewsAnimation}
                screenshotsAnimation={animations.screenshotsAnimation}
                sliderRef={sliderRef}
                deleteReview={(id) => deleteReview(id)}
                navigateAuth={() => navigateAuth()}
              />
            ) : (
              <Lower1200Footer
                reviewsLoading={loaders.reviewsLoading}
                screenshots={game.screenshots.results}
                navigateAuth={() => navigateAuth()}
                deleteReview={(id) => deleteReview(id)}
                sliderRef={sliderRef}
                reviews={reviews}
              />
            )}
            <FooterButtons
              reviewsLoading={loaders.reviewsLoading}
              screenshots={game.screenshots}
              reviewsAnimation={animations.reviewsAnimation}
              toggleAnimation={toggleAnimation}
            />
          </div>
        </div>
      )}
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

  for (let i = 1; i < 5; i++) {
    const getData = await axios.get(
      `https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&dates=1990-01-01,2023-12-31&page=${i}&page_size=${100}`
    )
    ids.push(
      ...(getData.data).results.map((game: ShortGame) => game.id)
    )
  }

  const paths = ids.map((id) => ({
    params: { id: JSON.stringify(id) },
  }))

  return { paths, fallback: 'blocking' }
}

export async function getStaticProps(context: Context) {
  let gameData, screenshots, trailers, same_series

  try {
    const getData = await axios.get(
      `https://api.rawg.io/api/games/${context.params.id}?key=39a2bd3750804b5a82669025ed9986a8`
    )
    gameData = getData.data
  } catch (e) {
    console.log('error on getting gameData', e)
    gameData = null
  }

  try {
    const getScreenshots = await axios.get(
      `https://api.rawg.io/api/games/${context.params.id}/screenshots?key=39a2bd3750804b5a82669025ed9986a8`
    )
    screenshots = getScreenshots.data
  } catch (e) {
    console.log('error on getting screenshots', e)
    screenshots = null
  }

  try {
    const getTrailers = await axios.get(
      `https://api.rawg.io/api/games/${context.params.id}/movies?key=39a2bd3750804b5a82669025ed9986a8`
    )
    trailers = getTrailers.data
  } catch (e) {
    console.log('error on getting treilers', e)
    trailers = null
  }

  try {
    const getSeries = await axios.get(
      `https://api.rawg.io/api/games/${context.params.id}/game-series?key=39a2bd3750804b5a82669025ed9986a8`
    )
    same_series = getSeries.data
  } catch (e) {
    console.log('error on getting same_series', e)
    same_series = null
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
    screenshots,
    tags: gameData.tags,
    website: gameData.website,
    trailers,
    same_series,
  }

  return {
    props: {
      game: finalData,
    },
  }
}
