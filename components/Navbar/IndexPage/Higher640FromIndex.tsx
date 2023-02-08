import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import DynamicSession from '../DynamicSession'

export default function Higher640() {
    const router = useRouter()

    return (
        <div className="pt-4 overflow-hidden relative w-full z-30 responsive_wrapper">
            <div
                className="w-full flex justify-between items-center">
                    <Image
                        src={'/images/Logo.svg'}
                        height={32}
                        width={130}
                        alt="Logo"
                    />
                <div className="flex">
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