export default function SearchLayout({children}:any) {
    return (
        <div className="flex flex-row">
            <div className="h-screen fixed w-72 bg-red-200">
                SideBar
            </div>
            <main className="pl-72">{children}</main>
        </div>
    )
}