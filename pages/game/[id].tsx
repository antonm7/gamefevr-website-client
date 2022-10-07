import { useEffect, useRef, useState } from 'react'
import SearchLayout from '../../components/layout/SearchLayout'
import { DetailedGame, ShortGame } from '../../types'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'
import { useSession } from 'next-auth/react'
import WriteReview from '../../components/GamePage/WriteReview'
import { Review_Type } from '../../types/schema'
import clientPromise from '../../lib/functions/mongodb'
import Bigger640 from '../../components/GamePage/Responsive/Bigger640'
import Lower640 from '../../components/GamePage/Responsive/Lower640'
import Filters from '../../components/Filters'
import { useGlobalError, useStore } from '../../store'
import { ObjectId } from 'bson'
import { useRouter } from 'next/router'
import ErrorComponent from '../../components/ErrorComponent'
import Tags from '../../components/GamePage/Tags'
import Description from '../../components/GamePage/Description'
import FooterButtons from '../../components/GamePage/FooterButtons'
import SmallLoader from '../../components/common/SmallLoader'
import axios from 'axios'
import Lower1200Footer from '../../components/GamePage/Responsive/Lower1200Footer'
import Bigger1200Footer from '../../components/GamePage/Responsive/Bigger1200Footer'
import SameSeries from '../../components/GamePage/SameSeries'

type Props = {
  game: DetailedGame
}

export default function GamePage(props: Props) {
  const [width] = useWindowSize()
  const store = useStore()
  const router = useRouter()
  const session = useSession()
  const changeGlobalErrorVisibility = useGlobalError(
    (store) => store.setIsVisible
  )
  const changeGlobalErrorType = useGlobalError((store) => store.setType)
  const changeText = useGlobalError((state) => state.setText)

  const [game, setGame] = useState<DetailedGame | null>(null)
  const [screenshotsAnimtion, setScreenshotsAnimtion] = useState<boolean>(false)
  const [reviewsAnimation, setReviewsAnimation] = useState<boolean>(false)
  const [writeReviewVisibility, setWriteReviewVisibility] =
    useState<boolean>(false)
  const [isUserRated, setIsUserRated] = useState<string | null>(null)
  const [reviews, setReviews] = useState<Review_Type[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(true)
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
    setReviewsLoading(false)
  }

  useEffect(() => {
    setReviewsAnimation(false)
    setScreenshotsAnimtion(false)
    setGame(props.game)
    setLoading(false)
    loadReviews()
  }, [router.query.id, props.game])

  const navigateAuth = () => {
    if (session.status !== 'authenticated') {
      return router.push('/register/login')
    }
    const isAlreadyCommented = reviews.filter(
      (r) =>
        JSON.stringify(r.userId) === JSON.stringify(session.data.user.userId)
    )
    if (isAlreadyCommented.length > 0) {
      changeText('You already commented this game')
      changeGlobalErrorVisibility(true)
      changeGlobalErrorType('warning')
      return
    }
    setWriteReviewVisibility(true)
  }

  const toggleAnimation = () => {
    if (reviewsAnimation) {
      setReviewsAnimation(false)
      setTimeout(() => {
        setScreenshotsAnimtion(false)
      }, 450)
    } else {
      setScreenshotsAnimtion(true)
      setTimeout(() => {
        setReviewsAnimation(true)
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
      setLoading(true)
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
    setLoading(false)
  }

  return (
    <SearchLayout>
      {loading ? (
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
                reviewsAnimation={reviewsAnimation}
                screenshotsAnimation={screenshotsAnimtion}
                sliderRef={sliderRef}
                deleteReview={(id) => deleteReview(id)}
                navigateAuth={() => navigateAuth()}
              />
            ) : (
              <Lower1200Footer
                reviewsLoading={reviewsLoading}
                screenshots={game.screenshots.results}
                navigateAuth={() => navigateAuth()}
                deleteReview={(id) => deleteReview(id)}
                sliderRef={sliderRef}
                reviews={reviews}
              />
            )}
            <FooterButtons
              reviewsLoading={reviewsLoading}
              screenshots={game.screenshots}
              reviewsAnimation={reviewsAnimation}
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
    const getData = await fetch(
      `https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&dates=1990-01-01,2023-12-31&page=${i}&page_size=${100}`
    )
    ids.push(
      ...(await getData.json()).results.map((game: ShortGame) => game.id)
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
    const getData = await fetch(
      `https://api.rawg.io/api/games/${context.params.id}?key=39a2bd3750804b5a82669025ed9986a8`
    )
    gameData = await getData.json()
  } catch (e) {
    console.log('error on getting gameData', e)
    gameData = null
  }

  try {
    const getScreenshots = await fetch(
      `https://api.rawg.io/api/games/${context.params.id}/screenshots?key=39a2bd3750804b5a82669025ed9986a8`
    )
    screenshots = await getScreenshots.json()
  } catch (e) {
    console.log('error on getting screenshots', e)
    screenshots = null
  }

  try {
    const getTrailers = await fetch(
      `https://api.rawg.io/api/games/${context.params.id}/movies?key=39a2bd3750804b5a82669025ed9986a8`
    )
    trailers = await getTrailers.json()
  } catch (e) {
    console.log('error on getting treilers', e)
    trailers = null
  }

  try {
    const getSeries = await fetch(
      `https://api.rawg.io/api/games/${context.params.id}/game-series?key=39a2bd3750804b5a82669025ed9986a8`
    )
    same_series = await getSeries.json()
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

  // const reviews = await db
  //   .collection('reviews')
  //   .find({ gameId: context.params.id })
  //   .toArray()
  // fetch(`/api/game/action/visited?gameId=${query.id}`, {
  //     //             headers:{
  //     //                 userId:session.data?.user?.userId
  //     //             }
  //     //         })

  return {
    props: {
      game: finalData,
    },
  }
}
