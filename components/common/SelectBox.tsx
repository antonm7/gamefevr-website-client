
type Props = {
    title:string,
    onClick:() => void,
    isSelected:boolean
}

export default function SelectBox(props:Props) {
    return (
        <button id="selectBox" onClick={props.onClick} className={`h-10 m-2 overflow-hidden border border-text-gray px-6 flex flex-row items-center justify-center rounded-xl ${props.isSelected ? 'bg-main-blue' : 'bg-transparent'}`}>
            <p className={`${props.isSelected ? 'text-white' : 'text-text-gray'} text-base font-extralight`}>{props.title}</p>
        </button>
    )
}