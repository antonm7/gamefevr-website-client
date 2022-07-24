import { genres, parentConsoles } from "../lib/staticData";
import { ElementDescription } from "../types";
import SelectBox from "./common/SelectBox";
import { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useStore } from "../store";
import YellowButton from "./common/YellowButton";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";

export default function Filters() {
  const [yearRange, changeYearRange] = useState<number[]>([1990, 2022]);
  const [selectedGenres, changeSelectedGenres] = useState<number[]>([]);
  const [selectedConsoles, changeSelectedConsoles] = useState<number[]>([]);
  const store = useStore();
  const router = useRouter();

  const updateGenres = (index: number): void => {
    if (selectedGenres.includes(index)) {
      //removes
      changeSelectedGenres(selectedGenres.filter((genre) => genre !== index));
    } else {
      //adds
      changeSelectedGenres([...selectedGenres, index]);
    }
  };

  const updatedConsoles = (index: number): void => {
    if (selectedConsoles.includes(index)) {
      //removes
      changeSelectedConsoles(selectedConsoles.filter((i) => i !== index));
    } else {
      //adds
      changeSelectedConsoles([...selectedConsoles, index]);
    }
  };

  const search = () => {
    setCookie("prevRoute", "/");
    store.clearGames();
    store.clearPage();
    router.push({
      pathname: "/search",
      query: {
        yearRange:
          yearRange[0] === 1990 && yearRange[1] === 2022
            ? undefined
            : yearRange,
        genres: selectedGenres,
        consoles: selectedConsoles,
        search: store.gameName
      },
    });
    store.changeFilterVisibility(false);
  };

  useEffect(() => {
    if (!router.isReady && !router.query) return;
    //trick to add type for router query, otherwise its yelling at me
    let q: any = router.query;
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
        for (let key in q.genres) {
          changeSelectedGenres((v) => [...v, parseInt(q.genres[key])]);
        }
      }
    }
    if (q.consoles?.length > 0) {
      if (typeof q.consoles === "string") {
        changeSelectedConsoles([parseInt(q.consoles)]);
      } else {
        for (let key in q.consoles) {
          changeSelectedConsoles((v) => [...v, parseInt(q.consoles[key])]);
        }
      }
    }
  }, [router.isReady]);

  return (
    <div className="fixed z-40 rounded-lg p-6 w-4/6 h-5/6 bg-filtersBg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <FontAwesomeIcon
        icon={faXmark}
        className="h-8 float-right cursor-pointer"
        onClick={() => store.changeFilterVisibility(false)}
      />
      <h1 className="text-3xl truncate font-semibold text-center">Genres</h1>
      <div className="px-6">
        <div className="bg-white p-4 w-5/6 mt-6 mx-auto rounded-md filters-column-shadow">
          <div className="flex h-auto items-center justify-center flex-row flex-wrap">
            {genres.map((genre: ElementDescription, index: number) => {
              return (
                <SelectBox
                  isSelected={selectedGenres.includes(genre.id)}
                  onClick={() => updateGenres(genre.id)}
                  key={index}
                  title={genre.name}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex justify-between w-5/6">
          <div className="py-6 w-2/4 px-6">
            <h1 className="text-3xl truncate font-semibold text-center">
              Consoles
            </h1>
            <div className="bg-white p-4 mt-6 mx-auto h-auto rounded-md filters-column-shadow">
              <div className="flex h-auto items-center justify-center flex-row flex-wrap ">
                {parentConsoles.map(
                  (console: ElementDescription, index: number) => {
                    return (
                      <SelectBox
                        isSelected={selectedConsoles.includes(console.id)}
                        coolBlue={true}
                        onClick={() => updatedConsoles(console.id)}
                        key={index}
                        title={console.name}
                      />
                    );
                  }
                )}
              </div>
            </div>
          </div>
          <div className="w-2/4 ml-12 px-6">
            <h1 className="text-3xl truncate font-semibold text-center py-6">
              Release Date
            </h1>
            <div className="bg-white h-52 flex flex-col items-center justify-center rounded-md filters-column-shadow">
              <div className="flex flex-row justify-between pb-8 w-5/6">
                <div
                  className="w-16 h-10 border flex items-center justify-center rounded-lg"
                  style={{ border: "1px solid #c9c9c9" }}
                >
                  <p className="text-black text-sm" style={{ paddingTop: 1 }}>
                    {yearRange[0]}
                  </p>
                </div>
                <div
                  className="w-16 h-10 border flex items-center justify-center rounded-lg"
                  style={{ border: "1px solid #c9c9c9" }}
                >
                  <p className="text-black text-sm" style={{ paddingTop: 1 }}>
                    {yearRange[1]}
                  </p>
                </div>
              </div>
              <Range
                style={{ width: "83%" }}
                min={1990}
                max={2022}
                value={yearRange}
                onChange={changeYearRange}
              />
            </div>
          </div>
        </div>
        <div className="w-44 h-16 mt-12">
          <YellowButton
            active={true}
            onClick={() => search()}
            title={"search"}
          />
        </div>
      </div>
    </div>
  );
}
