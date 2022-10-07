import { Request, Response } from 'express'
import { NextApiRequest } from 'next'
import clientPromise from '../../../../lib/functions/mongodb'

type ExtendedRequest = NextApiRequest & {
  query: {
    gameId: string
  }
}

export default async function handler(req: ExtendedRequest, res: Response) {
  if (req.method === 'GET') {
    try {
      const query = req.query
      const client = await clientPromise
      const db = client.db('gameFevr')

      const docs = await db
        .collection('reviews')
        .find({ gameId: query.gameId })
        .toArray()
      if (!docs.length) {
        res.status(200).send({ error: null, reviews: [] })
      } else {
        res.status(200).send({ error: null, reviews: docs })
      }
    } catch (e) {
      console.log('error on getReviews', e)
      return res.status(500).send({ erro: 'Unexpected Error' })
    }
  }
}
