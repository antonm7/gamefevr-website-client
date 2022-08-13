import React, { ReactChildren, ReactChild } from 'react'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'
import Navbar from '../Navbar'

interface AuxProps {
  children: ReactChild | ReactChildren
}

export default function SearchLayout({ children }: AuxProps) {
  const [width] = useWindowSize()

  return (
    <div id="header_bg">
      <main
        id="search_layout_page"
        className={`h-screen ${width > 1024 ? 'pb-20' : 'pb-32'}`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  )
}
