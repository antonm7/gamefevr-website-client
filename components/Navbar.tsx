import Link from "next/link";
import Image from 'next/image'
export default function Navbar() {
    return (
        <div className="absolute h-20 w-full">
            <div className="h-full w-full flex justify-between pt-6 px-36">
                <div >
                    <Image src={'/images/Logo.svg'} height={32} width={130} alt="Logo"/>
                </div>
                <div className="flex pt-0">
                    <Link href="/">
                        <p className="text-white font-regular text-sm">Home</p>
                    </Link>
                    <Link href="/">
                        <p className="text-white mx-8 font-regular text-sm">Explore</p>
                    </Link>
                    <Link href="/">
                        <p className="text-white font-regular text-sm">Reviews</p>
                    </Link>
                </div>
                <div style={{width:130}}>
                    <Link href="/">
                        <p className="text-white font-semibold text-lg float-right">Profile</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}