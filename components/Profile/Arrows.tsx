import Image from 'next/image'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'

interface Props {
  componentRef: any
  count: number
}

export default function Arrows({ componentRef, count }: Props) {
  const [width] = useWindowSize()

  const show = () => {
    if (width > 1600 && count > 4) return true
    if (width <= 1600 && width >= 1200 && count > 3) return true
    if (width < 1200 && width >= 640 && count > 2) return true
    if (width < 640 && count > 1) return true
    return false
  }

  if (!show()) return null

  if (width < 380) return null

  return (
    <div className="mr-4 flex items-center justify-center cursor-pointer">
      <div className="mr-3 flex items-center">
        <Image
          onClick={() => componentRef?.current?.slickPrev()}
          src={'/icons/arrow_left.svg'}
          width={18}
          height={18}
          alt="arrow-left"
        />
      </div>
      <div className="brightness-125 flex items-center">
        <Image
          onClick={() => componentRef?.current?.slickNext()}
          src={'/icons/arrow_right.svg'}
          width={18}
          height={18}
          alt="arrow-left"
        />
      </div>
    </div>
  )
}
