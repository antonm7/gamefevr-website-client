import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../../lib/functions/mongodb'
import checkJWT from '../../../../lib/functions/checkJWT'
import { hash, compare } from 'bcrypt'
import authorize from '../../../../backend-middlewares/authorize'
import GenerateError from '../../../../backend-middlewares/generateErrorBackend'

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    email: string
    oldPassword: string
    newPassword: string
  }
}

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const auth = await checkJWT(req)
      if (!auth) throw new Error('No token')
    } catch (e) {
      console.log(e)
      return res.status(401)
    }
    let db = null
    const body = req.body
    //initializing database
    try {
      const client = await clientPromise
      db = client.db('gameFevr')
    } catch (e) {
      throw new Error('Unexpected error')
    }
    //comparing password
    try {
      const user = await db.collection('users').findOne({ email: body.email })
      if (!user) {
        res.status(404).send({ error: 'User not found' })
        throw new Error('User not found')
      }
      const isValid = await compare(body.oldPassword, user.password)
      if (!isValid) {
        return res
          .status(200)
          .send({ error: 'Please enter the corect password' })
      }
    } catch (e) {
      await GenerateError({
        error: 'error on comparing password on user/settings/changePassword',
        status: 500,
        e,
      })
      console.log('error on comparing password', e)
      return res.status(401).send({ error: 'Please enter the corect password' })
    }

    try {
      const hashedPassword = await hash(body.newPassword, 8)
      await db
        .collection('users')
        .updateOne(
          { email: body.email },
          { $set: { password: hashedPassword } }
        )
      res.status(200).send({ error: null })
    } catch (e) {
      await GenerateError({
        error:
          'error on hashing password and updating user password on user/settings/changePassword',
        status: 500,
        e,
      })
      console.log(
        'error on hashing password and updating user password on user/settings/changePassword',
        e
      )
      res.status(500).send({ error: 'Unexpected error' })
    }
  }
}

export default authorize(handler)
