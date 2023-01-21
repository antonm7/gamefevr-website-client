import { ObjectId } from 'bson'
import { Favorite_Type } from '../../../../../types/schema'
import clientPromise from '../../../../../lib/functions/mongodb'
import games_data_document from '../../../../../lib/functions/create/games_data'
import { NextApiRequest, NextApiResponse } from 'next'
import authorize from '../../../../../backend-middlewares/authorize'
import GenerateError from '../../../../../backend-middlewares/generateErrorBackend'
import updateHype from '../../../../../lib/functions/updateHype'
import axios from 'axios'
import generateTime from '../../../../../lib/functions/generateTime'

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    gameId: string
    userId: string
  }
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    let db = null
    let savedFavorite
    const { body }: any = req.body
    //initializing database
    try {
      const client = await clientPromise
      db = client.db()
    } catch (e) {
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on initializing database', e)
    }
    //checks if game document exists
    try {
      await games_data_document(body.gameId)
    } catch (e) {
      await GenerateError({
        error: 'error on games_data_document on add/action favorite api',
        status: 500,
        e,
      })
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on games_data_document', e)
    }
    //checking if user already added this game to favorites
    try {
      const is_already_favorite = await db.collection('favorites').findOne({ userId: body.userId, gameId: body.gameId })
      if (is_already_favorite) {
        throw new Error('You already saved this game')
      }
    } catch (e) {
      res.status(500).send({ error: 'You already saved this game' })
      return
    }
    //saves the favorite inside own favorites collection
    try {
      const getData = await axios.get(
        `https://api.rawg.io/api/games/${body.gameId}?key=39a2bd3750804b5a82669025ed9986a8`
      )
      const gameData = getData.data

      const favorite: Favorite_Type = {
        userId: body.userId,
        gameId: body.gameId,
        created_at: generateTime(new Date()),
        game_name: gameData.name,
        game_image: gameData.background_image,
      }

      savedFavorite = await db.collection('favorites').insertOne(favorite)
    } catch (e) {
      await GenerateError({
        error: 'error saving the favorite on add/action favorite api',
        status: 500,
        e,
      })
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error saving the favorite', e)
    }
    //updates user's document
    try {
      await db
        .collection('users')
        .updateOne(
          { _id: new ObjectId(body.userId) },
          { $push: { favorites: savedFavorite?.insertedId } }
        )
    } catch (e) {
      await GenerateError({
        error: 'error on updating user ranks field on add/action favorite api',
        status: 500,
        e,
      })
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on updating user ranks field')
    }
    //updates game data document
    try {
      await db
        .collection('games_data')
        .updateOne({ gameId: body.gameId }, { $inc: { favorites: 1 } })
    } catch (e) {
      await GenerateError({
        error: 'error on updating user ranks field on add/action favorite api',
        status: 500,
        e,
      })
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on updating games_data document', e)
    }
    try {
      const update_hype = await updateHype(
        'addToFavorite',
        new ObjectId(body.userId)
      )

      if (update_hype.ok) {
        res
          .status(200)
          .send({ error: null, favoriteId: savedFavorite.insertedId })
      } else {
        throw new Error('error updating hype')
      }
    } catch (e) {
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on rankGame', e)
    }
  }
}

export default authorize(handler)
