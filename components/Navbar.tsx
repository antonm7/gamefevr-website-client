import Link from "next/link";
import Image from 'next/image'
import { useRouter } from "next/router";
import SmallSearchInput from "./common/SmallSearchInput";
import { useSession } from "next-auth/react";
export default function Navbar() {
    const router = useRouter()

    const {data:session} = useSession()

    const DynamicSession = () => {
        if(session) {
            return (
                <div style={{width:130,cursor:'pointer'}}>
                    <Link href="/">
                        <div style={{borderWidth:0.5,borderColor:'#ef626d'}} className="rounded-lg w-full h-11">
                            <p style={{lineHeight:'2.75rem'}} className="text-white font-regular text-sm text-center">Profile</p>
                        </div>
                    </Link>
                </div>
            )}
        else {
            return (
                <div style={{width:130,cursor:'pointer'}}>
                    <Link href="/">
                        <div style={{borderWidth:0.5,borderColor:'#ef626d'}} className="rounded-lg w-full h-11">
                            <p style={{lineHeight:'2.75rem'}} className="text-white font-regular text-sm text-center">Register</p>
                        </div>
                    </Link>
                </div>
            )}
    }   

    if(router.route === '/') {
        return (
            <div className="absolute h-20 w-full">
                <div className="h-full w-full flex justify-between pt-4 px-44 items-center">
                    <div style={{marginTop:3}}>
                        <Image src={'/images/Logo.svg'} height={32} width={130} alt="Logo"/>
                    </div>
                    <div className="flex pt-0">
                        <Link href="/">
                            <p className="text-white font-regular cursor-pointer text-xs">Home</p>
                        </Link>
                        <Link href="/">
                            <p className="text-white mx-8 font-regular cursor-pointer text-xs">Explore</p>
                        </Link>
                        <Link href="/">
                            <p className="text-white font-regular cursor-pointer text-xs">Reviews</p>
                        </Link>
                    </div>
                    <DynamicSession />
                </div>
            </div>
        )
    } else {
        return (
            <div className="absolute h-20 w-full">
                <div className="h-full w-full flex justify-between pt-4 px-44 items-center">
                    <div className="flex items-center">
                        <div style={{marginTop:3}}>
                            <Image src={'/images/Logo.svg'} height={32} width={130} alt="Logo"/>
                        </div>
                        <div className="flex pl-16">
                            <Link href="/">
                                <p className="text-white font-regular cursor-pointer text-xs">Home</p>
                            </Link>
                            <Link href="/">
                                <p className="text-white px-8 font-regular cursor-pointer text-xs">Explore</p>
                            </Link>
                            <Link href="/">
                                <p className="text-white font-regular cursor-pointer text-xs">Reviews</p>
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div>
                            <SmallSearchInput />
                        </div>
                        <DynamicSession />
                    </div>
                </div>
            </div>
        )
    }
}