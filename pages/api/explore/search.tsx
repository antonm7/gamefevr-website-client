import { NextApiRequest, NextApiResponse } from "next";
import getRandomInt from "../../../lib/functions/generateRandom";
import { genres, parentConsoles } from "../../../lib/staticData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const limit = 5;
    const page = Math.round(getRandomInt(0, 760000) / limit);
    let filteredString: string = "";

    const useOrNot = () => {
      let num = Math.round(Math.random());
      if (num === 0) {
        return false;
      }
      return true;
    };
    //consoles
    if (useOrNot()) {
      const consoles = parentConsoles;
      let consolesString: string = "";
      const item = consoles[Math.floor(Math.random() * consoles.length)];
      consolesString = consolesString.concat(`${item.id}`, "");
      filteredString = filteredString.concat(`&platforms=${consolesString}`);
    }

    //genres
    if (useOrNot()) {
      const genresData = genres;
      let genresString: string = "";
      const item = genresData[Math.floor(Math.random() * genresData.length)];
      genresString = genresString.concat(`${item.id}`, "");
      filteredString = filteredString.concat(`&platforms=${genresString}`);
    }
    const getData = await fetch(
      `https://api.rawg.io/api/games?key=0ffbdb925caf4b20987cd068aa43fd75&page=${page}&page_size=${limit}`
    );
    const games = await getData.json();
    res.status(200).json(games);
  }
}
