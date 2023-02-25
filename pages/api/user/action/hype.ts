import { ObjectId } from 'bson'
import { NextApiRequest, NextApiResponse } from 'next'
import authorize from '../../../../backend-middlewares/authorize'
import clientPromise from '../../../../lib/functions/mongodb'
import updateHype from '../../../../lib/functions/updateHype'

interface ExtendedNextApiRequest extends NextApiRequest {
    body: {
        body: {
            gets_hype: string
            sends_hype: string
        }
    }
}

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { gets_hype, sends_hype } = req.body.body
        let db: any = null
        try {
            const client = await clientPromise
            db = client.db()
        } catch (e) {
            res.status(500).send({ error: 'Unexpected error' })
            return console.log('error on initializing database', e)
        }

        try {
            await db.collection('users').updateOne({ _id: new ObjectId(sends_hype) },
                { $push: { hyped_users: gets_hype } })

            await Promise.allSettled([updateHype(
                'userGetsHype',
                new ObjectId(gets_hype)
            ), updateHype(
                'userSendsHype',
                new ObjectId(sends_hype)
            )])
            res.status(201).send({ error: null })
        } catch (e) {
            console.log('error on user/action/hype', e)
            res.status(500).send({ error: 'Unexpected error' })
        }
    }
}

export default authorize(handler)
