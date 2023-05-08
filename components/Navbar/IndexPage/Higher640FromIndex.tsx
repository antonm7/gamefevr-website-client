import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import DynamicSession from '../DynamicSession'
import styles from '../index.module.scss'

export default function Higher640() {
    const router = useRouter()

    return (
        <div className="pt-4 overflow-hidden relative w-full z-30 responsive_wrapper">
            <div
                className="w-full flex justify-between items-center">
                <Image
                    src={'/images/gameFevr.png'}
                    height={32}
                    width={130}
                    alt="Logo"
                />
                <div className="flex">
                    <Link href="/">
                        <p
                            className={`text-white mr-8 font-semibold cursor-pointer text-sm ${router.pathname === '/' ? 'active-link ' : ''
                                }`}
                        >
                            Home
                        </p>
                    </Link>
                    {/* <p
                        className={`${styles.coming_soon} text-white mx-8 font-semibold opacity-50 text-sm ${router.pathname === '/explore' ? 'active-link ' : ''
                            }`}
                    >
                        Explore
                    </p> */}
                    <p
                        className={`${styles.coming_soon} text-white font-semibold opacity-50 text-sm ${router.pathname === '/reviews' ? 'active-link ' : ''
                            }`}
                    >
                        Reviews - Coming Soon
                    </p>
                </div>
                <DynamicSession />
            </div>
        </div>
    )
}