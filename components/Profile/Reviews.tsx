import Image from 'next/image'

export default function Reviews(props:any) {
    
    const slicedParagrap = (text:string):string => {
        if(text.length > 180) { 
            return text.slice(0,180) + '...'
        }
        return text
    }

    return (
       <div className='w-80 h-72  rounded-lg p-6' style={{backgroundColor:'#0e3462'}}>
            <div className='flex items-center'>
                <Image src={'/images/example.webp'} width={34} height={34} />
                <h1 style={{lineBreak:'anywhere'}} className="font-semibold text-lg cursor-pointer text-white whitespace-pre-wrap hover:text-gray-300 px-6 py-3">Portal 2</h1>
            </div>
            <p className='leading-6 text-base text-white opacity-60' style={{minHeight:'60%'}}>
                {slicedParagrap('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.')}
            </p>
            <div className='pt-4'>
                <p style={{lineBreak:'anywhere'}} className="text-base text-white opacity-60">Sep 12,2022</p>
            </div>
       </div>
    )
}