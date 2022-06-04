import Image from 'next/image'

export default function Favorite(props:any) {
    return (
       <div className='w-80 h-56 rounded-lg bg-white'>
            <div id="favorite-image">
                <Image quality="1" loading="eager" objectPosition={'center center'} className="z-0" src={'/images/example.webp'} layout="fill" objectFit="cover" />
            </div>
            <h1 style={{lineBreak:'anywhere'}} className="font-semibold text-lg whitespace-pre-wrap hover:text-gray-500 px-6 py-3">Portal 2</h1>
       </div>
    )
}