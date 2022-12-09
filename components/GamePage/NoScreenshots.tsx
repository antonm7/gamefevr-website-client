import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ObjectId } from 'bson'
import { Review_Type } from '../../types/schema'
import ReviewsSlider from './ReviewsSlider'

interface Props {
  reviewsAnimation: boolean
  reviews: Review_Type[]
  navigateAuth: () => void
  deleteReview: (reviewId: ObjectId | undefined) => void
  isUserCommented: boolean
}

export default function NoScreenShots({
  reviewsAnimation,
  reviews,
  navigateAuth,
  deleteReview,
}: Props) {
  return (
    <div
      id="game_page_screenshots_controller"
      className="relative overflow-hidden bg-main-blue"
      style={{
        height:
          !reviewsAnimation && !reviews.length
            ? '150px'
            : reviewsAnimation && !reviews.length
              ? '150px'
              : '700px',
      }}
    >
      {reviews.length ? (
        <div className="h-full flex items-center overflow-hidden">
          <div
            className={`px-20 ${!reviewsAnimation
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
            isAnimated={true}
            reviews={reviews}
            deleteReview={(id) => deleteReview(id)}
            isUserCommented={false}
          />
        </div>
      ) : (
        <div className="h-ful  flex justify-center overflow-hidden">
          <div
            className={`px-20 ${!reviewsAnimation
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
  )
}
