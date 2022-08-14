import Image from 'next/image'
import SearchLayout from '../components/layout/SearchLayout'

export default function FourOFour() {
  return (
    <SearchLayout>
      <div className="flex items-center justify-center">
        <Image src={'/illustrations/404.svg'} width={800} height={800} />
      </div>
    </SearchLayout>
  )
}
