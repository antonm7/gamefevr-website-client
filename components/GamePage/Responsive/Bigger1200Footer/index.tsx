import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useWindowSize from '../../../../lib/functions/hooks/useWindowSize'
import { Short_Screenshot } from '../../../../types'
import { Review_Type } from '../../../../types/schema'
import NoScreenShots from '../../NoScreenshots'
import ReviewsSlider from '../../ReviewsSlider'
import Screenshots from '../../Screenshots'
import Image from 'next/image'
import { ObjectId } from 'bson'
import { useSession } from 'next-auth/react'

interface Props {
  screenshots: Short_Screenshot[]
  reviews: Review_Type[]
  reviewsAnimation: boolean
  screenshotsAnimation: boolean
  sliderRef: any
  deleteReview: (id: ObjectId | undefined) => void
  navigateAuth: () => void
}

export default function Bigger1200Footer({
  screenshots,
  reviewsAnimation,
  reviews,
  screenshotsAnimation,
  sliderRef,
  navigateAuth,
  deleteReview,
}: Props) {
  const [width] = useWindowSize()
  const session = useSession()

  const isUserCommented = (): boolean => {
    const filtered: Review_Type[] = reviews.filter(
      (r) =>
        JSON.stringify(r.userId) === JSON.stringify(session.data?.user.userId)
    )
    if (filtered.length) return true
    return false
  }

  const RenderAddButton = (): JSX.Element | null => {
    const filtered: Review_Type[] = reviews.filter(
      (r) =>
        JSON.stringify(r.userId) === JSON.stringify(session.data?.user.userId)
    )
    if (filtered.length) return null
    return (
      <div
        className={`px-20 ${reviewsAnimation
          ? 'write_review_animation_enabled'
          : 'write_review_animation_disabled'
          }`}
      >
        <FontAwesomeIcon
          icon={faPlus}
          className="h-16 text-white cursor-pointer opacity-40 hover:opacity-100 simple-transition"
          onClick={navigateAuth}
        />
      </div>
    )
  }

  return (
    <div>
      {screenshots.length >= 3 ? (
        <div
          id="game_page_screenshots_controller"
          className="relative overflow-hidden bg-main-blue"
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
            className={`${screenshotsAnimation ? 'controller_animation' : ''}`}
          >
            {width > 1400 ? (
              <div
                className="flex items-center absolute"
                style={{ bottom: 45, right: 125 }}
              >
                <div
                  onClick={() => sliderRef?.current?.slickPrev()}
                  className="mr-4 flex items-center justify-center cursor-pointer">
                  <Image
                    src={'/icons/arrow_left.svg'}
                    width={25}
                    height={18}
                    alt="arrow-left"
                  />
                </div>
                <div
                  onClick={() => sliderRef?.current?.slickNext()}
                  className="cursor-pointer bg-white py-3 px-4 flex items-center justify-center rounded-lg">
                  <Image
                    src={'/icons/arrow_right.svg'}
                    width={25}
                    height={18}
                    alt="arrow-right"
                  />
                </div>
              </div>
            ) : (
              <div
                className="flex items-center absolute"
                style={{ bottom: 30, right: 125 }}
              >
                <div
                  className="mr-4 flex items-center justify-center cursor-pointer"
                  onClick={() => sliderRef?.current?.slickPrev()}
                >
                  <Image
                    src={'/icons/arrow_left.svg'}
                    width={18}
                    height={16}
                    alt="arrow-left"
                  />
                </div>
                <div
                  className="cursor-pointer bg-white py-2 px-3 flex items-center justify-center rounded-lg"
                  onClick={() => sliderRef?.current?.slickNext()}
                >
                  <Image
                    src={'/icons/arrow_right.svg'}
                    width={18}
                    height={16}
                    alt="arrow-right"
                  />
                </div>
              </div>
            )}
          </div>
          <Screenshots
            setRef={sliderRef}
            isAnimated={screenshotsAnimation}
            images={screenshots}
          />
          {reviews.length ? (
            <div
              className="h-full flex items-center overflow-hidden"
              style={{ marginTop: width > 1400 ? '-34rem' : '-20rem' }}
            >
              {RenderAddButton()}
              <ReviewsSlider
                isUserCommented={isUserCommented()}
                isAnimated={reviewsAnimation}
                reviews={reviews}
                deleteReview={(id) => deleteReview(id)}
              />
            </div>
          ) : (
            <div
              className="h-ful  flex justify-center overflow-hidden"
              style={{ marginTop: width > 1400 ? '-32rem' : '-16rem' }}
            >
              <div
                className={`px-20 flex flex-col items-center text-center opacity-40
                hover:opacity-100  ${reviewsAnimation
                    ? 'write_review_animation_enabled '
                    : 'write_review_animation_disabled'
                  }`}
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  className="h-16 text-white  simple-transition cursor-pointer"
                  onClick={() => navigateAuth()}
                />
                <h1 className="text-center text-white  simple-transition cursor-pointer">
                  Write Review
                </h1>
              </div>
            </div>
          )}
        </div>
      ) : (
        <NoScreenShots
          isUserCommented={isUserCommented()}
          reviewsAnimation={reviewsAnimation}
          reviews={reviews}
          navigateAuth={navigateAuth}
          deleteReview={(id) => deleteReview(id)}
        />
      )}
    </div>
  )
}
