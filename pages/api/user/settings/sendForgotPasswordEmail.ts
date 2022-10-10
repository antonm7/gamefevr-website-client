import { ObjectId } from 'bson'
import { Request, Response } from 'express'
import clientPromise from '../../../../lib/functions/mongodb'
import sgMail from '@sendgrid/mail'

interface Body {
  email: string
}

export default async function handler(req: Request, res: Response) {
  if (req.method === 'POST') {
    const { email }: Body = req.body
    let db = null
    //initializing database
    try {
      const client = await clientPromise
      db = client.db('gameFevr')
    } catch (e) {
      console.log('error on initializing database', e)
      res.status(200).send({ error: 'Unexpected error,please try again' })
      return
    }

    try {
      const findingUser = await db.collection('users').findOne({ email })
      if (!findingUser) {
        throw new Error('No user found with the email')
      } else {
        const generateLink = (userId: ObjectId): string => {
          return `${Math.random() * 300}_${userId}`
        }

        const reset_link = generateLink(new ObjectId(findingUser._id))

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

        if (process.env.SENDGRID_API_KEY) {
          sgMail.setApiKey(process.env.SENDGRID_API_KEY)
          try {
            const msg = {
              to: 'migolkoanton@gmail.com',
              from: 'gameFevrr@gmail.com',
              subject: 'Welcome To GameFevrr!',
              templateId: 'd-c5a1a45c79f4405c99fd359269c394c0',
              dynamic_template_data: {
                Sender_Name: 'Anton Migolko',
                reset_link: `http://localhost:3000/resetPassword/${reset_link}`,
              },
            }
            const send = await sgMail.send(msg)
            console.log('seded', send)
          } catch (e: any) {
            console.log('error sending email', e.response.body)
          }
        }

        res.status(200).send({ ok: true })
      }
    } catch (e) {
      res.status(404).send({ error: e })
    }
  }
}
