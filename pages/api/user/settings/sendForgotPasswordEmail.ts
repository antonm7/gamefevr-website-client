import { Request, Response } from "express";
import clientPromise from "../../../../lib/functions/mongodb";

interface Body {
    email: string
}

export default async function handler(req: Request, res: Response) {
    if (req.method === "POST") {
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
            const findingUser = await db.collection('users')
                .findOne({ email })
            if (!findingUser) {
                throw new Error('No user found with the email')
            } else {
                const generateLink = (userId: string): string => {
                    const link = `${JSON.stringify(userId)}`
                    return `${Math.random() * 300}_${link}`
                }

                await db.collection('users').updateOne({
                    email: email
                }, {
                    forgot_password_link: generateLink(JSON.stringify(findingUser._id))
                })
            }
        } catch (e) {
            res.status(404).send({ error: e })
        }

    }
}
