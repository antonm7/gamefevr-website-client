import { ObjectId } from 'bson'
import { Response } from 'express'
import clientPromise from '../../../../lib/functions/mongodb'
import sgMail from '@sendgrid/mail'
import { NextApiRequest } from 'next'

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    body: {
      email: string
    }
  }
}

export default async function handler(req: ExtendedNextApiRequest, res: Response) {
  if (req.method === 'POST') {
    const { email } = req.body.body
    let db: any = null

    try {
      const client = await clientPromise
      db = client.db()
    } catch (e) {
      console.log('error on initializing database', e)
      res.status(200).send({ error: 'Unexpected error,please try again' })
      return
    }

    let findingUser;
    let reset_link;

    try {
      findingUser = await db.collection('users').findOne({ email })
      if (!findingUser) {
        throw new Error('No user found with the email')
      }

    } catch (e) {
      return res.status(404).send({ error: 'No user with the provided email' })
    }

    try {
      const generateLink = (userId: ObjectId): string => {
        return `${Math.random() * 300}_${userId}`
      }
      reset_link = generateLink(new ObjectId(findingUser._id))
      await db.collection('users').updateOne(
        {
          email: email,
        },
        {
          $set: {
            forgot_password_link: reset_link,
          },
        }
      )
    } catch (e) {
      return res.status(500).send({ error: 'Unexpected Error, try again' })
    }

    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      try {
        const msg = {
          to: email,
          from: 'gameFevrr@gmail.com',
          subject: 'Reset your password!',
          templateId: 'd-c5a1a45c79f4405c99fd359269c394c0',
          dynamic_template_data: {
            Sender_Name: findingUser.username,
            reset_link: `${process.env.URI}/resetPassword/${reset_link}`,
          },
        }
        try {
          await sgMail.send(msg)
          res.status(200).send({ ok: true })
        } catch (e) {

        }
      } catch (e: any) {
        console.log('error sending email', e.response.body)
      }
    } else {
      return res.status(500).send({ error: 'Unexpected Error, try again' })
    }
  }
}
