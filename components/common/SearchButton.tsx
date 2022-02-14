import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
    onClick:any
}

export default function SearchButton(props:Props) {
    return (
        <button onClick={props.onClick} className="bg-specialYellow w-full h-full flex items-center justify-center">
            <FontAwesomeIcon className="text-white h-4" icon={faMagnifyingGlass}/>
        </button>
    )
}