export default function SearchLayout({children}:any) {
    return (
        <div className="flex flex-col">
            <div className="h-20 fixed w-full bg-red-200">
                SideBar
            </div>
            <main className="pt-20">{children}</main>
        </div>
    )
}