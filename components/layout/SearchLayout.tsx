import Navbar from "../Navbar";

export default function SearchLayout({children}:any) {
    return (
        <div>
            <Navbar />
            <main className="pt-20">{children}</main>
        </div>
    )
}