import { Review_Type } from '../../types/schema'

export default function Reviews(props:Review_Type) {
    const slicedParagrap = (text:string):string => {
        if(text.length > 180) { 
            return text.slice(0,180) + '...'
        }
        return text
    }
    console.log(props)
    return (
       <div className='h-72 rounded-lg p-6' style={{backgroundColor:'#0e3462',width:'28rem'}}>
            <div className='flex items-center'>
                <div className="h-8 w-8 bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url(${props.game_image})`}} />
                <h1 style={{lineBreak:'anywhere'}} className="font-semibold text-lg cursor-pointer text-white whitespace-pre-wrap hover:text-gray-300 px-6 py-3">{props.game_name}</h1>
            </div>
            <h1 className="inline font-semibold text-lg cursor-pointer text-white opacity-70 whitespace-pre-wrap hover:text-gray-300 py-1">{props.rank}</h1>
            <p className='leading-6 text-base text-white opacity-60' style={{height:'8.5rem', maxHeight:'8.5rem',lineBreak:'anywhere'}}>
                {slicedParagrap(props.text)}
            </p>
            <p style={{lineBreak:'anywhere'}} className="text-base text-white opacity-60">Sep 12,2022</p>
       </div>
    )
}