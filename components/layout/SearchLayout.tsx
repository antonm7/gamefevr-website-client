import React, { ReactChildren, ReactChild } from 'react'
import Navbar from '../Navbar'

interface AuxProps {
  children: ReactChild | ReactChildren
}

export default function SearchLayout({ children }: AuxProps) {
  return (
    <div id="header_bg">
      <main id="search_layout_page" className={`pb-20`}>
        <Navbar />
        {children}
      </main>
    </div>
  )
}
