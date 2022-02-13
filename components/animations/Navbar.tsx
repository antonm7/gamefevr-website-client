import Link from "next/link";

export default function Navbar() {
    return (
        <div className="h-full w-80 bg-main-blue p-12">
            <Link href="/">
                <p className="text-white font-semibold pb-8 text-2xl">Home</p>
            </Link>
            <Link href="/">
                <p className="text-white font-semibold pb-8 text-2xl">Home</p>
            </Link>
            <Link href="/">
                <p className="text-white font-semibold pb-8 text-2xl">Home</p>
            </Link>
            <Link href="/">
                <p className="text-white font-semibold pb-8 text-2xl">Home</p>
            </Link>
            <Link href="/">
                <p className="text-white font-semibold pb-8 text-2xl">Home</p>
            </Link>
        </div>
    )
}