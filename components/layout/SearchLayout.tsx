export default function SearchLayout({children}:any) {
    return (
        <div className="flex flex-row">
            <div className="h-screen w-72 bg-red-200">
                SideBar
            </div>
            <main>{children}</main>
        </div>
    )
}