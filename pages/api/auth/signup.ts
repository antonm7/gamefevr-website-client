import { Request, Response } from 'express'
import clientPromise from '../../../lib/functions/mongodb'
import { hash } from 'bcrypt'

interface ReqBody {
  email: string
  password: string
  username: string
}

async function handler(req: Request, res: Response) {
  if (req.method === 'POST') {
    try {
      const { email, password, username }: ReqBody = req.body

      const client = await clientPromise
      const db = client.db()

      const validateEmail = (email: string) => {
        const re =
          // eslint-disable-next-line no-useless-escape
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email)
      }
      console.log(req.body)
      if (!validateEmail(email))
        return res.status(200).send({ error: 'Please enter valid email' })

      const passw = /^[A-Za-z]\w{7,14}$/
      if (!password.match(passw))
        return res.status(200).send({ error: 'Please enter valid password' })

      if (username.length < 6)
        return res
          .status(200)
          .send({ error: 'Username must be at least 6 letters' })

      const isEmailExists = await db.collection('users').findOne({ email })
      if (isEmailExists)
        return res.status(200).send({ error: 'Email is already in use' })

      const isUsernameExists = await db
        .collection('users')
        .findOne({ username })
      if (isUsernameExists)
        return res.status(200).send({ error: 'Username is already in use' })

      const hashedPassword = await hash(password, 8)

      await db.collection('users').insertOne({
        email,
        username,
        password: hashedPassword,
        created_at: '',
        favorite: [],
        reviews: [],
        ranks: [],
        visited_games: [],
      })

      res.status(201).send({ error: null })
    } catch (e) {
      console.log('error on signup', e)
      res.status(500).send()
    }
  }
}

export default handler
