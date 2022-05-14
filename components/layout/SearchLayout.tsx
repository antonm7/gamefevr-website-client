import Navbar from "../Navbar";

export default function SearchLayout({children}:any) {
    return (
        <div >
            <Navbar />
            <main id="search_layout_page" className="h-screen py-20">{children}</main>
        </div>
    )
}