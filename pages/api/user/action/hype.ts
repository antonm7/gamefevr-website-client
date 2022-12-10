import { ObjectId } from 'bson'
import { NextApiRequest, NextApiResponse } from 'next'
import authorize from '../../../../backend-middlewares/authorize'
import clientPromise from '../../../../lib/functions/mongodb'
import updateHype from '../../../../lib/functions/updateHype'

interface Body {
    gets_hype: string
    sends_hype: string
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const body: Body = req.body
        let db = null

        try {
            const client = await clientPromise
            db = client.db()
        } catch (e) {
            res.status(500).send({ error: 'Unexpected error' })
            return console.log('error on initializing database', e)
        }

        try {
            await db.collection('users').updateOne({ _id: new ObjectId(body.sends_hype) },
                { $push: { hyped_users: body.gets_hype } })

            const update_gets = await updateHype(
                'userGetsHype',
                new ObjectId(body.gets_hype)
            )

            const update_sends = await updateHype(
                'userSendsHype',
                new ObjectId(body.sends_hype)
            )

            if (update_gets.ok && update_sends) {
                res.status(201).send({ error: null })
            } else {
                throw new Error('error updating hype')
            }
        } catch (e) {
            console.log('error on user/action/hype', e)
            res.status(500).send({ error: 'Unexpected error' })
        }
    }
}

export default authorize(handler)
