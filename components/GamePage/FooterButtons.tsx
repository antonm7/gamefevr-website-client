/* eslint-disable @typescript-eslint/no-extra-semi */
import useWindowSize from '../../lib/functions/hooks/useWindowSize'
import { Short_Screenshot } from '../../types'
import YellowButton from '../common/YellowButton'

interface Props {
  screenshots: { results: Short_Screenshot[] }
  reviewsAnimation: boolean
  toggleAnimation: () => void
}

export default function FooterButtons({
  screenshots,
  reviewsAnimation,
  toggleAnimation,
}: Props) {
  const [width] = useWindowSize()

  if (width < 1200) null

  if (screenshots.results.length >= 3) {
    return (
      <div
        className={`w-full flex justify-center ${
          reviewsAnimation
            ? 'button_animation_enabled'
            : 'button_animation_disabled'
        }`}
      >
        <div className="w-52" id="show_comments_wrapper">
          <YellowButton
            title="Show Comments"
            active={true}
            onClick={() => toggleAnimation()}
          />
        </div>
      </div>
    )
  }
  return null
}
