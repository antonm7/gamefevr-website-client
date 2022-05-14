import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStore } from "../../store";

export default function SmallSearchInput() {
    const store = useStore()
    return (
        <div className="flex items-center relative">
            <FontAwesomeIcon onClick={() => store.changeFilterVisibility(true)} icon={faSliders} className="absolute h-3 cursor-pointer right-4 text-gray-600"/>
            <input autoSave="true" placeholder="Search..." className="w-500 text-white text-xs placeholder-slate-400 outline-0 p-4 h-10 bg-inputBg rounded-lg" />
        </div>
    )
}