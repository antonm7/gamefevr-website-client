import type { AppProps } from 'next/app'
import 'tailwindcss/tailwind.css'
import '../styles/global.css'
import { SessionProvider } from "next-auth/react"


function MyApp({ Component, pageProps:{session,...pageProps} }: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className='bg-main-blue'>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  )
}

export default MyApp
