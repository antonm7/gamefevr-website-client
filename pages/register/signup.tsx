import { NextPage } from "next"
import { signIn } from "next-auth/react"
import Image from 'next/image'
import Link from "next/link"
import { useState } from "react"
import LoginAnimation from "../../components/animations/Login"
import SignupAnimation from "../../components/animations/Signup"
import YellowButton from "../../components/common/YellowButton"
import StyledInput from "../../components/Register/StyledInput"

const Signup:NextPage = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const signup = () => {
        //inputs verify
        //use signIn with 'credentials',
        //.then((res) => {
        // setLoading(false)
        // if(res.error) {
        //   setLoading(false)
        //   return setLoginerror('Email or password is invalid')
    }
    return (
        <main className="flex h-screen bg-white">
            <div style={{zIndex:2}} className="px-32 pt-16">
                <Image src={'/images/dLogo.svg'} height={32} width={130} alt="Logo"/>
                <p className="text-darkIndigo font-black text-5xl overflow-hidden pt-12 pb-4">Sign Up</p>
                <p className="text-darkIndigo opacity-60 font-normal text-base">
                    Welcome!<br />
                    Please create your account
                </p>
                <div className="pt-9 w-80">
                    <StyledInput title="Username" placeholder="Enter your username" type="text" />
                    <div className="pt-6">
                        <StyledInput title="Email" placeholder="Enter your email" type="email" />
                    </div>
                    <div className="pt-6">
                        <StyledInput forgot={false} title="Password" placeholder="Enter password" type="password"/>
                    </div>
                    <div className="pt-12">
                        <YellowButton onClick={signup} title="Signup"/>
                    </div>
                    <p className="text-darkIndigo font-semibold text-base pt-4 flex items-center">
                        Already have an account? 
                        <Link href={"/register/login"}>
                            <p style={{color:'#38b6cc'}} className="cursor-pointer pl-1 font-semibold text-base">Log In</p>
                        </Link>
                    </p>
                </div>
            </div>
            <SignupAnimation />
        </main>
    )
}
export default Signup