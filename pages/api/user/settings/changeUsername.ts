import { ObjectId } from 'bson'
import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../../lib/functions/mongodb'
import checkJWT from '../../../../lib/functions/checkJWT'
import authorize from '../../../../backend-middlewares/authorize'
import GenerateError from '../../../../backend-middlewares/generateErrorBackend'

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    email: string
    username: string
  }
}

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const auth = await checkJWT(req)
      if (!auth) throw new Error('No token, sending 401')
    } catch (e) {
      console.log('error on changing username', e)
      return res.status(401)
    }
    let db = null
    const body = req.body
    //initializing database
    try {
      const client = await clientPromise
      db = client.db('gameFevr')
    } catch (e) {
      console.log('error on initializing database', e)
      res.status(200).send({ error: 'Unexpected error' })
      return
    }
    //checkinf if username is already taken
    try {
      const user = await db
        .collection('users')
        .findOne({ username: body.username })
      if (user) throw new Error('Username already taken')
    } catch (e) {
      await GenerateError({
        error:
          'error on checking if username is already taken on user/settings/changeUsername',
        status: 500,
        e,
      })
      console.log('error on checking if username is already taken', e)
      res.status(200).send({ error: 'username is already taken' })
      return
    }
    //updating username
    try {
      await db
        .collection('users')
        .updateOne({ email: body.email }, { $set: { username: body.username } })
      console.log(body)
      res.status(200).send({ error: null })
    } catch (e) {
      await GenerateError({
        error:
          'error on changing username on user document on user/settings/changeUsername',
        status: 500,
        e,
      })
      console.log(e)
      res.status(500).send({ error: 'Unexpected Error' })
    }
  }
}

export default authorize(handler)
