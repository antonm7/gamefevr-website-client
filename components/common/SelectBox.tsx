
type Props = {
    title:string
}
export default function SelectBox(props:Props) {
    return (
        <button id="selectBox" className="h-10 m-2 overflow-hidden bg-transparent border border-text-gray px-6 flex flex-row items-center justify-center rounded-xl">
            <p className="text-text-gray text-base font-extralight">{props.title}</p>
        </button>
    )
}