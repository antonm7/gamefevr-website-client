import { ObjectId } from 'bson'
import { NextApiRequest, NextApiResponse } from 'next'
import authorize from '../../../../backend-middlewares/authorize'
import clientPromise from '../../../../lib/functions/mongodb'
import updateHype from '../../../../lib/functions/updateHype'
import { type Db } from 'mongodb'

// Define the request body type
interface HypeRequestBody {
    gets_hype: string
    sends_hype: string
}

async function handleHype(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).send({ error: 'Method Not Allowed' })
        return
    }

    // Validate the request body
    const body = req.body as HypeRequestBody
    if (!body.gets_hype || !body.sends_hype) {
        res.status(400).send({ error: 'Invalid request body' })
        return
    }

    // Initialize the database
    let db: Db
    try {
        const client = await clientPromise
        db = client.db()
    } catch (e) {
        console.error('Error initializing database:', e)
        res.status(500).send({ error: 'Unexpected error' })
        return
    }

    // Add the gets_hype user to the hyped_users array of the sends_hype user
    try {
        await db.collection('users').updateOne(
            { _id: new ObjectId(body.sends_hype) },
            { $push: { hyped_users: body.gets_hype } }
        )
    } catch (e) {
        console.error('Error updating user:', e)
        res.status(500).send({ error: 'Unexpected error' })
        return
    }

    // Update the gets_hype and sends_hype users' hype counts
    try {
        await Promise.allSettled([
            updateHype('userGetsHype', new ObjectId(body.gets_hype)),
            updateHype('userSendsHype', new ObjectId(body.sends_hype)),
        ])
        res.status(201).send({ error: null })
    } catch (e) {
        console.error('Error updating hype counts:', e)
        res.status(500).send({ error: 'Unexpected error' })
    }
}

export default authorize(handleHype)
