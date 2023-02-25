import { games_data } from "../../../types/schema";
import clientPromise from "../mongodb";

//function that checks if the game document is exists
//on the games_data collection
//if it isnt exists it creates base document
export default async function games_data_document(gameId: string) {
  const document: games_data = {
    gameId,
    waste_of_time: 0,
    nuh: 0,
    good: 0,
    must: 0,
    visited: 0,
    reviews: 0,
    favorite: 0,
    twitter_share: 0,
    facebook_share: 0,
  };

  try {
    const client = await clientPromise;
    const db = client.db();

    const isExists = await db.collection("games_data").findOne({ gameId });
    if (!isExists) {
      await db.collection("games_data").insertOne(document);
    }
  } catch (e) {
    console.log("error on creating games_data");
  }
}
