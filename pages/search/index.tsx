import SearchLayout from "../../components/layout/SearchLayout";
import SmallGameBox from "../../components/SmallGameBox";
import SearchButton from "../../components/common/SearchButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useGlobalError, useStore } from "../../store";
import Filters from "../../components/Filters";
import SmallLoader from "../../components/common/SmallLoader";
import { ShortGame } from "../../types";
import LoadingError from "../../components/common/LoadingError";
import cookie from "cookie";

interface Props {
  games: ShortGame[];
  error: string | null;
}

export default function Index(props: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const changeGlobalErrorVisibility = useGlobalError(
    (store) => store.setIsVisible
  );
  //2 types of errors
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const [noResults, setNoResults] = useState<boolean>(false);

  const router = useRouter();
  const store = useStore();

  const loadGames = async (cur: number) => {
    if (loadingError) {
      setLoadingError(false);
    }
    try {
      setNoResults(false)
      setLoading(true);
      const getData = await axios.post("/api/query/search", {
        page: cur,
        query: router.query,
      });
      if (getData.data.games.length === 0) {
        setNoResults(true)
        setLoading(false)
      } else {
        store.addPage();
        store.addGames(getData.data.games);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      changeGlobalErrorVisibility(true);
      console.log("ERROR", e);
    }
  };

  useEffect(() => {
    store.clearGames()
    store.clearPage()
    if (props.games.length === 0) {
      setNoResults(true);
      return;
    }
    if (props.error) {
      setLoadingError(true);
      return;
    }
    // setLoading(false)
    setNoResults(false)
    setLoadingError(false);
    store.addPage();
    store.addGames(props.games);
    setLoading(false)
  }, [props]);

  return (
    <SearchLayout>
      <div>
        {store.isFilterOn ? <Filters /> : null}
        {loading && !loadingError && !noResults ? <div className="pt-12"><SmallLoader screenCentered={true} big={true} /></div> :
          loadingError ? (
            <div className="pt-32">
              <LoadingError
                mainTitle={"Unexpected Error"}
                description={"Oops...something went wrong"}
                button={true}
                onClick={() => loadGames(1)}
              />
            </div>
          ) : noResults ? (
            <div className="pt-32">
              <LoadingError
                mainTitle={"No Results Found"}
                description={"We couldnt find what you searched..."}
              />
            </div>
          ) : (
            <div className="py-10">
              <div className="flex flex-wrap justify-center">
                {store.games.map((game: ShortGame, index: number) => (
                  <SmallGameBox key={index} game={game} />
                ))}
              </div>
              <div className="w-24 h-16 rounded-lg m-auto mt-8">
                {loading ? (
                  <SmallLoader big={false} xCentered={true} />
                ) : (
                  <SearchButton
                    text="Load More"
                    onClick={() => loadGames(store.page)}
                  />
                )}
              </div>
            </div>
          )}
      </div>
    </SearchLayout>
  );
}

interface Context {
  query: {
    yearRange: string[] | string | undefined;
    genres: string[] | string | undefined;
    consoles: string[] | string | undefined;
    search: string | undefined
  };
}

export async function getServerSideProps(context: any) {
  function parseCookies(req: any) {
    return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
  }

  const cookies: any = parseCookies(context.req);

  if (cookies.prevRoute === "/game/[id]") {
    return {
      props: {
        games: [],
      },
    };
  }

  const { yearRange, genres, consoles, search } = context.query;
  let filteredString = "";
  let games = [];
  try {
    if (yearRange || genres || consoles || search) {
      if (search) {
        filteredString += `&search=${search}&`;
      }
      if (yearRange) {
        filteredString = filteredString.concat(
          "",
          `&dates=${yearRange[0]}-01-01,${yearRange[1]}-12-31`
        );
      }
      //simetimes from the client i get consoles as string, but i need an array
      //thats why i am checkinf the type of the consoles
      if (consoles) {
        if (typeof consoles === "string") {
          filteredString = filteredString.concat(
            `&parent_platforms=${consoles}`
          );
        } else {
          let consolesString = "";
          for (const key in consoles) {
            if (parseInt(key) !== consoles.length - 1) {
              consolesString = consolesString.concat(`${consoles[key]}`, ",");
            } else {
              consolesString = consolesString.concat(`${consoles[key]}`, "");
            }
          }
          filteredString = filteredString.concat(
            `&platforms=${consolesString}`
          );
        }
      }
      if (genres) {
        if (typeof genres === "string") {
          filteredString = filteredString.concat(`&genres=${genres}`);
        } else {
          let genresString = "";
          for (const key in genres) {
            if (parseInt(key) !== genres.length - 1) {
              genresString = genresString.concat(`${genres[key]}`, ",");
            } else {
              genresString = genresString.concat(`${genres[key]}`, "");
            }
          }
          filteredString = filteredString.concat(`&genres=${genresString}`);
        }
      }
      const getData: any = await axios(
        `https://api.rawg.io/api/games?key=0ffbdb925caf4b20987cd068aa43fd75&ordering=-released&page=1&page_size=20${filteredString}`
      );
      games = getData.data.results;
    } else {
      const getData: any = await axios(
        `https://api.rawg.io/api/games?key=0ffbdb925caf4b20987cd068aa43fd75&ordering=-released&dates=1990-01-01,2022-12-31&page=1&page_size=20`
      );
      games = getData.data.results;
    }
    return {
      props: {
        games,
        error: null,
      },
    };
  } catch (e) {
    return {
      props: {
        games: [],
        error: "Error Loading Games",
      },
    };
  }
}
