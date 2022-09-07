import React, { ReactChildren, ReactChild } from 'react'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'
import Navbar from '../Navbar'

interface AuxProps {
  children: ReactChild | ReactChildren
}

export default function SearchLayout({ children }: AuxProps) {
  return (
    <div id="header_bg">
      <main id="search_layout_page" className={`h-screen pb-20`}>
        <Navbar />
        {children}
      </main>
    </div>
  )
}
