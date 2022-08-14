import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import Screenshots from '../../components/GamePage/Screenshots'
import SearchLayout from '../../components/layout/SearchLayout'
import useQuery from '../../lib/functions/hooks/useQuery'
import { DetailedGame, ElementDescription, ShortGame } from '../../types'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'
import YellowButton from '../../components/common/YellowButton'
import ReviewsSlider from '../../components/GamePage/ReviewsSlider'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useSession } from 'next-auth/react'
import WriteReview from '../../components/GamePage/WriteReview'
import VerticalReviewsLoader from '../../components/GamePage/VerticalReviewsLoader'
import { Review_Type } from '../../types/schema'
import clientPromise from '../../lib/functions/mongodb'
import Bigger640 from '../../components/GamePage/Responsive/Bigger640'
import Lower640 from '../../components/GamePage/Responsive/Lower640'
import Filters from '../../components/Filters'
import { useGlobalError, useStore } from '../../store'
import { ObjectId } from 'bson'
import { useRouter } from 'next/router'
import NoScreenShots from '../../components/GamePage/NoScreenshots'
import Error from '../../components/Error'
import Tags from '../../components/GamePage/Tags'
import Description from '../../components/GamePage/Description'
import FooterButtons from '../../components/GamePage/FooterButtons'
import SmallLoader from '../../components/common/SmallLoader'

type Props = {
  game: DetailedGame
  reviews: Review_Type[]
}

export default function GamePage(props: Props) {
  const [width, height] = useWindowSize()
  const store = useStore()
  const query = useQuery()
  const router = useRouter()
  const session = useSession()
  const changeGlobalErrorVisibility = useGlobalError(
    (store) => store.setIsVisible
  )
  const changeText = useGlobalError((state) => state.setText)

  const [game, setGame] = useState<DetailedGame | null>(null)
  const [screenshotsAnimtion, setScreenshotsAnimtion] = useState<boolean>(false)
  const [reviewsAnimation, setReviewsAnimation] = useState<boolean>(false)
  const [writeReviewVisibility, setWriteReviewVisibility] =
    useState<boolean>(false)
  const [isUserRated, setIsUserRated] = useState<string | null>(null)
  const [reviews, setReviews] = useState<Review_Type[]>([])
  const [loading, setLoading] = useState<boolean>(true)

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

  useEffect(() => {
    setGame(props.game)
    setReviews(props.reviews)
    setLoading(false)
  }, [query?.id])

  const deleteReview = (id: ObjectId | undefined) => {
    if (id) {
      const newReviews = reviews.filter(
        (review: Review_Type) => review._id !== id
      )
      setReviews(newReviews)
    }
  }

  const loadAgain = async () => {
    console.log('ree')
  }

  return (
    <SearchLayout>
      {loading ? (
        <SmallLoader screenCentered={true} />
      ) : !game ? (
        <Error onLoad={loadAgain} />
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
                game={game}
                changeIsUserRated={(value) => setIsUserRated(value)}
              />
            ) : (
              <Lower640
                game={game}
                changeIsUserRated={(value) => setIsUserRated(value)}
              />
            )}
            <Description desc={game.description} />
            <Tags tags={game.tags} />
          </main>
          <div>
            {width > 1200 ? (
              game.screenshots.results.length >= 3 ? (
                <div
                  id="game_page_screenshots_controller"
                  className="relative overflow-hidden"
                  style={{
                    height:
                      width > 1400
                        ? reviewsAnimation && !reviews.length
                          ? '150px'
                          : '700px'
                        : reviewsAnimation && !reviews.length
                        ? '150px'
                        : '410px',
                  }}
                >
                  <div
                    id="controller"
                    className={`${
                      screenshotsAnimtion ? 'controller_animation' : ''
                    }`}
                  />
                  <Screenshots
                    isAnimated={screenshotsAnimtion}
                    images={game.screenshots.results}
                  />
                  {reviews.length ? (
                    <div
                      className="h-full flex items-center overflow-hidden"
                      style={{ marginTop: width > 1400 ? '-34rem' : '-20rem' }}
                    >
                      <div
                        className={`px-20 ${
                          reviewsAnimation
                            ? 'write_review_animation_enabled'
                            : 'write_review_animation_disabled'
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="h-16 text-white cursor-pointer opacity-40 hover:opacity-100 simple-transition"
                          onClick={() => navigateAuth()}
                        />
                      </div>
                      <ReviewsSlider
                        isAnimated={reviewsAnimation}
                        reviews={reviews}
                        deleteReview={(id) => deleteReview(id)}
                      />
                    </div>
                  ) : (
                    <div
                      className="h-ful  flex justify-center overflow-hidden"
                      style={{ marginTop: width > 1400 ? '-34rem' : '-20rem' }}
                    >
                      <div
                        className={`px-20 ${
                          reviewsAnimation
                            ? 'write_review_animation_enabled'
                            : 'write_review_animation_disabled'
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="h-16 text-white cursor-pointer opacity-40 hover:opacity-100 simple-transition"
                          onClick={() => navigateAuth()}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NoScreenShots
                  reviewsAnimation={reviewsAnimation}
                  reviews={reviews}
                  navigateAuth={navigateAuth}
                  deleteReview={(id) => deleteReview(id)}
                />
              )
            ) : (
              <div>
                <div
                  id="game_page_screenshots_controller"
                  className="relative overflow-hidden"
                  style={{ height: '400px' }}
                >
                  <div id="controller" />
                  <Screenshots
                    isAnimated={false}
                    images={game.screenshots.results}
                  />
                </div>
                <div
                  id="game_page_reviews_container"
                  className="flex flex-col items-center"
                >
                  <div
                    className="w-72 p-6 flex items-center justify-center rounded-xl mb-8 
                    cursor-pointer opacity-80 hover:opacity-100"
                    style={{ backgroundColor: 'rgba(21,21,21,0.6)' }}
                  >
                    <div
                      className="flex items-center justify-center"
                      onClick={() => navigateAuth()}
                    >
                      <FontAwesomeIcon
                        icon={faPlus}
                        className="h-6 text-white pr-4"
                        onClick={() => navigateAuth()}
                      />
                      <h1 className="text-white text-xl flex items-center">
                        Add A Review
                      </h1>
                    </div>
                  </div>
                  {reviews.length ? (
                    <VerticalReviewsLoader
                      reviews={reviews}
                      deleteReview={(id) => deleteReview(id)}
                    />
                  ) : null}
                </div>
              </div>
            )}
            <FooterButtons
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
      `https://api.rawg.io/api/games?key=0ffbdb925caf4b20987cd068aa43fd75&ordering=-released&dates=1990-01-01,2022-12-31&page=${i}&page_size=${100}`
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
  try {
    const getData = await fetch(
      `https://api.rawg.io/api/games/${context.params.id}?key=0ffbdb925caf4b20987cd068aa43fd75`
    )
    const getScreenshots = await fetch(
      `https://api.rawg.io/api/games/${context.params.id}/screenshots?key=0ffbdb925caf4b20987cd068aa43fd75`
    )
    const gameData = await getData.json()
    const screenshots = await getScreenshots.json()

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
    }

    const client = await clientPromise
    const db = client.db('gameFevr')
    const reviews = await db
      .collection('reviews')
      .find({ gameId: context.params.id })
      .toArray()

    // fetch(`/api/game/action/visited?gameId=${query.id}`, {
    //     //             headers:{
    //     //                 userId:session.data?.user?.userId
    //     //             }
    //     //         })
    return {
      props: {
        game: finalData,
        reviews: JSON.parse(JSON.stringify(reviews)),
      },
    }
  } catch (e) {
    return {
      props: {
        game: null,
        reviews: null,
      },
    }
  }
}
