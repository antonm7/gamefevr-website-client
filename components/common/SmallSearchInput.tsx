import { faMagnifyingGlass, faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useStore } from "../../store";

export default function SmallSearchInput() {
  const store: any = useStore();
  const router: any = useRouter();
  const [yearRange, changeYearRange] = useState<number[]>([1990, 2022]);
  const [selectedGenres, changeSelectedGenres] = useState<number[]>([]);
  const [selectedConsoles, changeSelectedConsoles] = useState<number[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    if (!router.isReady && !router.query) return;
    //trick to add type for router query, otherwise its yelling at me
    const q: any = router.query;
    //typescript fires error 'object is possibly 'undefined, so checking' if it exists
    //always compare between query and state, to keep the state updated
    if (q.yearRange) {
      if (
        yearRange[0] !== parseInt(q.yearRange[0]) &&
        yearRange[1] !== parseInt(q.yearRange[1])
      ) {
        changeYearRange([parseInt(q.yearRange[0]), parseInt(q.yearRange[1])]);
      }
    }
    if (q.genres?.length) {
      if (typeof q.genres === "string") {
        changeSelectedGenres([parseInt(q.genres)]);
      } else {
        for (const key in q.genres) {
          changeSelectedGenres((v) => [...v, parseInt(q.genres[key])]);
        }
      }
    }
    if (q.consoles?.length > 0) {
      if (typeof q.consoles === "string") {
        changeSelectedConsoles([parseInt(q.consoles)]);
      } else {
        for (const key in q.consoles) {
          changeSelectedConsoles((v) => [...v, parseInt(q.consoles[key])]);
        }
      }
    }
    if (!router.query.search) {
      setSearch("");
    } else {
      setSearch(router.query.search);
    }
  }, [router.isReady])

  const changeGameName = (text: string) => {
    setSearch(text);
    store.changeGameName(text);
  }

  const navigate = () => {
    setCookie("prevRoute", "/");
    store.clearGames();
    store.clearPage();
    router.push({
      pathname: "/search",
      query: {
        yearRange:
          yearRange[0] === 1990 && yearRange[1] === 2022
            ? []
            : yearRange,
        genres: selectedGenres,
        consoles: selectedConsoles,
        search: store.gameName ? store.gameName : null,
      },
    });
    store.changeFilterVisibility(false);
  };

  return (
    <div id="small_search_input" className="flex items-center relative">
      <FontAwesomeIcon
        onClick={() => store.changeFilterVisibility(true)}
        icon={faSliders}
        className="absolute h-3 cursor-pointer right-4 text-gray-600"
      />
      <FontAwesomeIcon
        onClick={() => navigate()}
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
