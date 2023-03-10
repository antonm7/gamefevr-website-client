import { Response } from 'express'
import clientPromise from '../../../../lib/functions/mongodb'
import { hash } from 'bcrypt'
import GenerateError from '../../../../backend-middlewares/generateErrorBackend'
import { NextApiRequest } from 'next'

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    body: {
      link: string
      newPassword: string
    }
  }
}

export default async function handler(req: ExtendedNextApiRequest, res: Response) {
  if (req.method === 'POST') {
    const { link, newPassword } = req.body.body

    let db: any = null
    //initializing database
    try {
      const client = await clientPromise
      db = client.db()
    } catch (e) {
      console.log('error on initializing database', e)
      res.status(200).send({ error: 'Unexpected error,please try again' })
      return
    }

    try {
      const passw = /^[A-Za-z]\w{7,14}$/
      if (!newPassword.match(passw))
        return res.status(200).send({ error: 'Please enter valid password' })

      const hashedPassword = await hash(newPassword, 8)

      await db.collection('users').updateOne(
        {
          forgot_password_link: link,
        },
        { $set: { password: hashedPassword, reset_password: '' } }
      )
      res.status(200).send({ ok: true })

    } catch (e) {
      await GenerateError({
        error:
          'error on confirmResetPassword on user/settings/confirmResetPassword',
        status: 500,
        e,
      })
      res.status(500).send({ error: 'Unexpected Error' })
    }
  }
}
