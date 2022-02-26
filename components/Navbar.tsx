import Link from "next/link";

export default function Navbar() {
    return (
        <div className="fixed h-20 w-full bg-main-blue flex bg-red-200">
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