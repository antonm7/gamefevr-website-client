import { Request, Response } from "express";

interface BodyReq {
  page: number;
  query: {
    yearRange: string[] | string | undefined;
    genres: string[] | string | undefined;
    consoles: string[] | string | undefined;
    search: string | undefined
  };
}
//TODO:change for get method
export default async function handler(req: Request, res: Response) {
  if (req.method === "POST") {
    try {
      const body: BodyReq = req.body;
      const { yearRange, genres, consoles, search } = body.query;
      let games = [];
      let count = 0;
      let filteredString = "";
      //checking if i got some filter
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
        const getData = await fetch(
          `https://api.rawg.io/api/games?key=0ffbdb925caf4b20987cd068aa43fd75&ordering=-released&page=${body.page}&page_size=30${filteredString}`
        );
        games = await getData.json();
        count = games.count;
      } else {
        const getData = await fetch(
          `https://api.rawg.io/api/games?key=0ffbdb925caf4b20987cd068aa43fd75&ordering=-released&dates=1990-01-01,2022-12-31&page=${body.page}&page_size=30`
        );
        games = await getData.json();
        count = games.count
      }
      const isNextPage = (page: number) => {
        if (page * 30 < count) {
          return true
        } else {
          return false
        }
      }
      res.status(200).send({ games: games.results, nextPage: isNextPage(body.page) });
    } catch (e) {
      console.log(e);
    }
  }
}
