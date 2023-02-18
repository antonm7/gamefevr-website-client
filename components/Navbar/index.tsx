import { useRouter } from 'next/router'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'

import Higher640FromIndex from './IndexPage/Higher640FromIndex'
import Lower640FromIndex from './IndexPage/Lower640FromIndex'
import Higher1200FromCommon from './CommonPages/Higher1200FromCommon'
import Lower1200FromCommon from './CommonPages/Lower1200FromCommon'

export default function Navbar() {
  const router = useRouter()
  const [width] = useWindowSize()

  if (router.route === '/') {
    if (width > 640) return <Higher640FromIndex />
    return <Lower640FromIndex />
  } else {
    if (width > 1200) return <Higher1200FromCommon />
    return <Lower1200FromCommon />
  }
}
