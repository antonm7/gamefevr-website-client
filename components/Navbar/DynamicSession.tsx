import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DynamicSession() {
    const [auth, setAuth] = useState<boolean>(false)
    const router = useRouter()
    const session = useSession()

    useEffect(() => {
        if (session.status === 'authenticated') {
            setAuth(true)
        } else {
            setAuth(false)
        }
    }, [session.status])

    const signOutMethod = (): void => {
        router.push('/')
        signOut()
    }

    if (auth) {
        if (router.pathname === '/profile/[id]' &&
            JSON.stringify(router.query.id) ===
            JSON.stringify(session.data?.user.userId)) {
            return (
                <div
                    style={{ width: 130, cursor: 'pointer' }}
                    className="hover:bg-[#38b6cc] rounded-lg"
                >
                    <div
                        onClick={() => signOutMethod()}
                        style={{ borderWidth: 0.5, borderColor: '#38b6cc' }}
                        className="cursor-pointer rounded-lg w-full h-11 overflow-hidden"
                    >
                        <p
                            style={{ lineHeight: '2.75rem' }}
                            className="text-white font-regular text-xs text-center cursor-pointer"
                        >
                            Logout
                        </p>
                    </div>
                </div>
            )
        } else {
            return (
                <div
                    style={{ width: 130, cursor: 'pointer' }}
                    className="hover:bg-[#ef626d] rounded-lg"
                >
                    <Link href={`/profile/${session?.data?.user?.userId}`}>
                        <div
                            style={{ borderWidth: 0.5, borderColor: '#ef626d' }}
                            className="cursor-pointer rounded-lg w-full h-11 overflow-hidden"
                        >
                            <p
                                style={{ lineHeight: '2.75rem' }}
                                className="text-white font-regular text-xs text-center cursor-pointer"
                            >
                                Profile
                            </p>
                        </div>
                    </Link>
                </div>
            )
        }
    } else {
        return (
            <div
                style={{ width: 130, cursor: 'pointer' }}
                className="hover:bg-[#ef626d] rounded-lg"
            >
                <Link href="/register/login">
                    <div
                        style={{ borderWidth: 0.5, borderColor: '#ef626d' }}
                        className="cursor-pointer rounded-lg w-full h-11 overflow-hidden"
                    >
                        <p
                            style={{ lineHeight: '2.75rem' }}
                            className="text-white font-regular text-xs text-center cursor-pointer"
                        >
                            Register
                        </p>
                    </div>
                </Link>
            </div>
        )
    }
}


