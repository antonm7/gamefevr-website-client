interface Props {
    title: string,
    onClick:() => void
}

export default function YellowButton(props:Props) {
    return (
        <button 
            className="w-full h-12 bg-specialYellow rounded-lg text-white text-lg font-normal" 
            onClick={props.onClick} 
            title={props.title}
        >
        {props.title}
        </button>
    )
}