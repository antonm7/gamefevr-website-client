export default function YellowButton(props:any) {
    return (
        <button className="w-full h-16 bg-specialYellow rounded-lg text-white text-lg font-normal" onClick={props.onClick} title={props.title}>
            {props.title}
        </button>
    )
}