import { getGames } from "../../lib/functions/dataGames"

export default function SearchInput() {
    getGames()
    return (
        <input autoSave="true" autoFocus={true} placeholder="Search..." className="w-700 text-white placeholder-slate-400 outline-0 p-4 h-16 bg-inputBg rounded-lg">

        </input>
    )
}