import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import SmallSearchInput from '../../common/SmallSearchInput'
import DynamicSession from '../DynamicSession'

export default function Higher1200FromCommon() {
    const router = useRouter()

    return (
        <div className="pt-4 flex items-center justify-between responsive_wrapper">
            <div className='flex items-center'>
                <Image
                    className='pr-8'
                    src={'/images/gameFevr.png'}
                    height={32}
                    width={130}
                    alt="Logo"
                />
                <Link href="/">
                    <span className={`text-white font-semibold cursor-pointer pl-16 pr-10 text-sm ${router.pathname === '/' ? 'active-link ' : ''}`}>
                        Home
                    </span>
                </Link>
                <Link href="/">
                    <span className={`text-white font-semibold opacity-50 pr-10 text-sm ${router.pathname === '/' ? 'active-link ' : ''}`}>
                        Reviews - Coming Soon
                    </span>
                </Link>
                {/* <Link href="/">
                    <span className={`text-white font-semibold cursor-pointer text-sm ${router.pathname === '/' ? 'active-link ' : ''}`}>
                        Explore
                    </span>
                </Link> */}
            </div>
            <div className="flex items-center">
                <div id="small_search_input_wrapper" className="mr-10">
                    <SmallSearchInput full={false} />
                </div>
                <DynamicSession />
            </div>
        </div>
    )
}