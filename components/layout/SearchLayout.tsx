import Navbar from "../Navbar";

export default function SearchLayout({children}:any) {
    return (
        <div className="flex flex-col">
            <Navbar />
            <main className="pt-20">{children}</main>
        </div>
    )
}