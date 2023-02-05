import axios from 'axios'
import { ObjectId } from 'bson'
import { NextApiRequest, NextApiResponse } from 'next'
import authorize from '../../../../../backend-middlewares/authorize'
import generateErrorBackend from '../../../../../backend-middlewares/generateErrorBackend'
import games_data_document from '../../../../../lib/functions/create/games_data'
import generateTime from '../../../../../lib/functions/generateTime'
import clientPromise from '../../../../../lib/functions/mongodb'
import updateHype from '../../../../../lib/functions/updateHype'
import { Review_Type } from '../../../../../types/schema'

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    body: {
      userId: string
      gameId: string
      rank: string
      text: string
    }
  }
}

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    let db = null
    const { userId, gameId, rank, text } = req.body.body
    let savedReview
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
      await games_data_document(gameId)
    } catch (e) {
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on games_data_document', e)
    }
    //checks if user already reviewed the game
    try {
      const isReviewd = await db
        .collection('reviews')
        .findOne({ userId: userId, gameId: gameId })
      if (isReviewd) {
        res.status(200).send({ error: 'You already reviewed this game' })
        return
      }
    } catch (e) {
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on checkinf if user commented', e)
    }
    //saves the reviews inside own ranks collection
    try {
      const getData = await axios.get(
        `https://api.rawg.io/api/games/${gameId}?key=0ffbdb925caf4b20987cd068aa43fd75`
      )
      const gameData = getData.data

      const generateRank = (rank: string) => {
        switch (rank) {
          case 'waste_of_time':
            return 'Waste Of Time'
          case 'nuh':
            return 'Nuh'
          case 'good':
            return 'Good'
          case 'must':
            return 'Must'
          default:
            return 'Good'
        }
      }
      let user_name

      try {
        const userName: any = await db
          .collection('users')
          .findOne({ _id: new ObjectId(userId) })
        user_name = userName.username
      } catch (e) {
        await generateErrorBackend({
          error:
            'Error on checking if user commented on writeReview action api',
          status: 500,
          e,
        })
        res.status(500).send({ error: 'Unexpected error' })
        return console.log('error on checkinf if user commenteds', e)
      }

      const review: Review_Type = {
        userId: userId,
        gameId: gameId,
        user_name,
        game_name: gameData.name,
        game_image: gameData.background_image,
        created_at: generateTime(new Date()),
        rank: generateRank(rank),
        text: text,
        likes: [],
        dislikes: [],
      }

      savedReview = await db.collection('reviews').insertOne(review)
    } catch (e) {
      await generateErrorBackend({
        error: 'Error saving the review on writeReview action api',
        status: 500,
        e,
      })
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error saving the review', e)
    }
    //updates user's document
    try {
      await db
        .collection('users')
        .updateOne(
          { _id: new ObjectId(userId) },
          { $push: { reviews: savedReview?.insertedId } }
        )
    } catch (e) {
      await generateErrorBackend({
        error: 'Error on updating user ranks field on writeReview action api',
        status: 500,
        e,
      })
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on updating user ranks field')
    }
    //updates game data document
    try {
      await db.collection('games_data').updateOne(
        { gameId: gameId },
        {
          $inc: { reviews: 1 },
        }
      )
    } catch (e) {
      await generateErrorBackend({
        error:
          'error on updating games_data document on writeReview action api',
        status: 500,
        e,
      })
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error on updating games_data document', e)
    }
    //updating the rank
    try {
      await db
        .collection('ranks')
        .updateOne(
          { gameId: gameId, userId: userId },
          { $set: { rank: rank } }
        )
    } catch (e) {
      await generateErrorBackend({
        error:
          'error on updating games_data document on writeReview action api',
        status: 500,
        e,
      })
      res.status(500).send({ error: 'Unexpected error' })
      return console.log(
        'error updating the game review after posting the review',
        e
      )
    }

    try {
      const review = await db
        .collection('reviews')
        .findOne({ _id: savedReview?.insertedId })
      await updateHype(
        'writeReview',
        new ObjectId(userId)
      )

      res.status(201).send({ error: null, review })

    } catch (e) {
      await generateErrorBackend({
        error: 'error fetching new review on writeReview action api',
        status: 500,
        e,
      })
      res.status(500).send({ error: 'Unexpected error' })
      return console.log('error fetching new review ', e)
    }
  }
}

export default authorize(handler)
