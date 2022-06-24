import Link from "next/link";
import Image from 'next/image'
import { useRouter } from "next/router";
import SmallSearchInput from "./common/SmallSearchInput";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Navbar() {
    const router = useRouter()
    const session:any = useSession()
    const [auth, setAuth] = useState<boolean>(false)



    useEffect(() => {
        if(session.status === 'authenticated') {
            setAuth(true)
            console.log(session.data?.user?.userId)
        } else {
            setAuth(false)
        }
    },[session.status])


    const DynamicSession = () => {
        if(auth) {
            return (
                <div style={{width:130,cursor:'pointer'}} className="hover:bg-[#ef626d] rounded-lg">
                    <Link href={`/profile/${session?.data?.user?.userId}`}>
                        <div style={{borderWidth:0.5,borderColor:'#ef626d'}} className="cursor-pointer rounded-lg w-full h-11 overflow-hidden">
                            <p style={{lineHeight:'2.75rem'}} className="text-white font-regular text-sm text-center cursor-pointer">Profile</p>
                        </div>
                    </Link>
                </div>
        )}
        else {
            return (
                <div style={{width:130,cursor:'pointer'}} className="hover:bg-[#ef626d] rounded-lg">
                    <Link href="/register/login">
                        <div style={{borderWidth:0.5,borderColor:'#ef626d'}} className="cursor-pointer rounded-lg w-full h-11 overflow-hidden">
                            <p style={{lineHeight:'2.75rem'}} className="text-white font-regular text-sm text-center cursor-pointer">Register</p>
                        </div>
                    </Link>
                </div>
            )}
    }   

    if(router.route === '/') {
        return (
            <div className="absolute h-20 w-full" style={{zIndex:99}}>
                <div className="h-full w-full flex justify-between pt-4 px-44 items-center">
                    <div style={{marginTop:3}}>
                        <Image src={'/images/Logo.svg'} height={32} width={130} alt="Logo"/>
                    </div>
                    <div className="flex pt-0">
                        <Link href="/">
                            <p className={`text-white font-semibold cursor-pointer text-sm ${router.pathname === '/' ? 'active-link ' : ''}`}>Home</p>
                        </Link>
                        <Link href="/">
                            <p className={`text-white mx-8 font-semibold cursor-pointer text-sm ${router.pathname === '/search' ? 'active-link ' : ''}`}>Explore</p>
                        </Link>
                        <Link href="/">
                            <p className={`text-white font-semibold cursor-pointer text-sm ${router.pathname === '/reviews' ? 'active-link ' : ''}`}>Reviews</p>
                        </Link>
                    </div>
                    <DynamicSession />
                </div>
            </div>
        )
    } else {
        return (
            <div className="absolute h-20 w-full bg-main-blue z-50">
                <div className="h-full w-full flex justify-between pt-4 px-44 items-center">
                    <div className="flex items-center">
                        <div style={{marginTop:3}}>
                            <Image src={'/images/Logo.svg'} height={32} width={130} alt="Logo"/>
                        </div> 
                        <div className="flex pl-16">
                            <Link href="/">
                                <p className={`text-white font-semibold cursor-pointer text-sm ${router.pathname === '/' ? 'active-link ' : ''}`}>Home</p>
                            </Link>
                            <Link href="/">
                                <p className={`text-white mx-8 font-semibold cursor-pointer text-sm ${router.pathname === '/search' ? 'active-link ' : ''}`}>Explore</p>
                            </Link>
                            <Link href="/">
                                <p className={`text-white font-semibold cursor-pointer text-sm ${router.pathname === '/reviews' ? 'active-link ' : ''}`}>Reviews</p>
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="mr-10">
                            <SmallSearchInput />
                        </div>
                        <DynamicSession />
                    </div>
                </div>
            </div>
        )
    }
}