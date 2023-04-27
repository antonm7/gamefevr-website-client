import { Request, Response } from "express";
import { wretchWrapper } from "../../../lib/functions/fetchLogic";
import { NamedGame } from "../../../types";
import clientPromise from "../../../lib/functions/mongodb";

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }
  try {
    const query = req.query;
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('short_games');

    const data = await collection.find({
      name: { $regex: new RegExp(query.search as string), $options: 'i' }
    })
      .limit(5).skip(0).toArray()


    res.status(200).send({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
