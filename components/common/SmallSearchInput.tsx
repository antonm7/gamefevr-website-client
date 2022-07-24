import { faMagnifyingGlass, faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useStore } from "../../store";

export default function SmallSearchInput() {
  const store: any = useStore();
  const router: any = useRouter();
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    if (!router.query.search) {
      setSearch("");
    } else {
      setSearch(router.query.search);
    }
  }, [])

  const changeGameName = (text: string) => {
    setSearch(text);
    store.changeGameName(text);
  }

  return (
    <div id="small_search_input" className="flex items-center relative">
      <FontAwesomeIcon
        onClick={() => store.changeFilterVisibility(true)}
        icon={faSliders}
        className="absolute h-3 cursor-pointer right-4 text-gray-600"
      />
      <FontAwesomeIcon
        onClick={() => store.changeFilterVisibility(true)}
        icon={faMagnifyingGlass}
        className="absolute h-3 cursor-pointer right-10 text-gray-600"
      />
      <input
        id="small_search_input_input"
        value={search}
        autoSave="true"
        placeholder="Search..."
        className="w-500 text-white text-xs placeholder-slate-400 outline-0 p-4 h-10 bg-inputBg rounded-lg"
        onChange={(e) => changeGameName(e.target.value)}
      />
    </div>
  );
}
