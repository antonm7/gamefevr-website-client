import useWindowSize from '../../../lib/functions/hooks/useWindowSize'
import { Short_Screenshot } from '../../../types'
import YellowButton from '../../common/YellowButton'

type Props = {
  screenshots: { results: Short_Screenshot[] }
  reviewsAnimation: boolean
  reviewsLoading: boolean
  toggleAnimation: () => void
}

export default function FooterButtons({
  screenshots,
  reviewsAnimation,
  reviewsLoading,
  toggleAnimation,
}: Props) {
  const [width] = useWindowSize()

  if (width < 1200) return null

  if (screenshots.results.length >= 3) {
    return (
      <div
        className={`w-full flex justify-center ${reviewsAnimation
          ? 'button_animation_enabled'
          : 'button_animation_disabled'
          }`}
      >
        <div className="w-52" id="show_comments_wrapper">
          <YellowButton
            title={
              reviewsAnimation
                ? 'Show Screenshots'
                : reviewsLoading
                  ? 'Loading Reviews..'
                  : 'Show Reviews'
            }
            active={reviewsAnimation ? true : reviewsLoading ? false : true}
            onClick={() =>
              reviewsAnimation
                ? toggleAnimation()
                : reviewsLoading
                  ? null
                  : toggleAnimation()
            }
          />
        </div>
      </div>
    )
  }
  return null
}
