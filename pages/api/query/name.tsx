import { Request, Response } from "express";
import { wretchWrapper } from "../../../lib/functions/fetchLogic";
import { NamedGame } from "../../../types";

export default async function handler(req: Request, res: Response) {
  if (req.method === "GET") {
    try {
      const query = req.query;
      const games: NamedGame[] = [];

      const data: any = await wretchWrapper(
        `https://api.rawg.io/api/games?key=${process.env.FETCH_GAMES_KEY_GENERAL2}&page=1&page_size=5&search=${query.search}`
        , 'getGamesData');

      for (const key in data.results) {
        games.push({
          name: data.results[key].name,
          id: data.results[key].id,
        });
      }

      res.status(200).send({ games });
    } catch (e) {
      console.log("error, e");
    }
  }
}
