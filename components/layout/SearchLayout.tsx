import React, { ReactChildren, ReactChild } from 'react';
import useWindowSize from "../../lib/functions/useWindowSize";
import Navbar from "../Navbar";

interface AuxProps {
  children: ReactChild | ReactChildren;
}

export default function SearchLayout({children}:AuxProps) {
    const [width,height] = useWindowSize()

    return (
        <div >
            <Navbar />
            <main id="search_layout_page" className={`h-screen ${width > 1024 ?'py-20': 'py-32'}`}>{children}</main>
        </div>
    )
}