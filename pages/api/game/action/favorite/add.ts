import { ObjectId } from 'bson';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../../lib/functions/mongodb';
import gamesDataDocument from '../../../../../lib/functions/create/games_data';
import generateErrorBackend from '../../../../../backend-middlewares/generateErrorBackend';
import updateHype from '../../../../../lib/functions/updateHype';
import generateTime from '../../../../../lib/functions/generateTime';
import { Favorite_Type } from '../../../../../types/schema';

interface AddFavoriteRequestBody {
  gameId: string;
  userId: string;
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    body: AddFavoriteRequestBody;
  };
}

const ERROR_MESSAGES = {
  UNEXPECTED_ERROR: 'Unexpected error',
  GAME_ALREADY_SAVED: 'You already saved this game',
  ERROR_ON_GAMES_DATA_DOCUMENT: 'Error on games_data_document on add/action favorite api',
  ERROR_SAVING_FAVORITE: 'Error saving the favorite on add/action favorite api',
  ERROR_UPDATING_USER_RANKS_FIELD: 'Error on updating user ranks field on add/action favorite api',
  ERROR_UPDATING_GAMES_DATA_DOCUMENT: 'Error on updating games_data document on add/action favorite api',
  ERROR_ON_RANK_GAME: 'Error on rankGame',
};

export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { gameId, userId } = req.body.body;

    const client = await clientPromise;
    const db = client.db();

    await gamesDataDocument(gameId);

    const isAlreadyFavorite = await db.collection('favorites').findOne({ userId, gameId });
    if (isAlreadyFavorite) {
      return res.status(400).json({ error: ERROR_MESSAGES.GAME_ALREADY_SAVED });
    }

    const game = await db.collection('games').findOne({ id: gameId });

    if (!game) {
      return res.status(404).json({ error: ERROR_MESSAGES.ERROR_ON_RANK_GAME })
    }

    const favorite: Favorite_Type = {
      userId,
      gameId,
      created_at: generateTime(new Date()),
      game_name: game.name,
      game_image: game.background_image,
    };

    const savedFavorite = await db.collection('favorites').insertOne(favorite);

    await Promise.all([
      db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $push: { favorites: savedFavorite.insertedId } }),
      db.collection('games_data').updateOne({ gameId }, { $inc: { favorites: 1 } }),
      updateHype('addToFavorite', new ObjectId(userId)),
    ]);

    const favoriteId = savedFavorite.insertedId;

    return res.status(200).json({ error: null, favoriteId });
  } catch (e) {
    await generateErrorBackend({ error: ERROR_MESSAGES.UNEXPECTED_ERROR, status: 500, e });
    return res.status(500).send({ error: ERROR_MESSAGES.UNEXPECTED_ERROR });
  }
}
