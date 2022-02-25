import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
    onClick:any,
    text?:boolean
}

export default function SearchButton(props:Props) {
    if(props.text) {
        return (
            <button onClick={props.onClick} className="bg-specialYellow w-full h-full flex items-center justify-center">
               <p className="text-white font-semobild">Search</p>
            </button>
        )
    } else {
        return (
            <button onClick={props.onClick} className="bg-specialYellow w-full h-full flex items-center justify-center">
                <FontAwesomeIcon className="text-white h-4" icon={faMagnifyingGlass}/>
            </button>
        )
    }
}

