import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import DynamicSession from '../DynamicSession'

export default function Higher640() {
    const router = useRouter()

    return (
        <div id="navbar-wrapper" className="overflow-hidden relative h-20 w-full z-30 px-20">
            <div
                className="h-full w-full flex justify-between pt-4 px-20 items-center"
                id="navbar"
            >
                <div style={{ marginTop: 7 }}>
                    <Image
                        src={'/images/Logo.svg'}
                        height={32}
                        width={130}
                        alt="Logo"
                    />
                </div>
                <div className="flex pt-0">
                    <Link href="/">
                        <p
                            className={`text-white font-semibold cursor-pointer text-sm ${router.pathname === '/' ? 'active-link ' : ''
                                }`}
                        >
                            Home
                        </p>
                    </Link>
                    <Link href="/explore">
                        <p
                            className={`text-white mx-8 font-semibold cursor-pointer text-sm ${router.pathname === '/explore' ? 'active-link ' : ''
                                }`}
                        >
                            Explore
                        </p>
                    </Link>
                    <Link href="/">
                        <p
                            className={`text-white font-semibold cursor-pointer text-sm ${router.pathname === '/reviews' ? 'active-link ' : ''
                                }`}
                        >
                            Reviews
                        </p>
                    </Link>
                </div>
                <DynamicSession />
            </div>
        </div>
    )
}