import type { AppProps } from 'next/app'
import 'tailwindcss/tailwind.css'
import '../styles/global.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className='bg-main-blue'>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
