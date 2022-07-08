import { ObjectId } from 'bson';
import games_data_document from '../../../../lib/functions/create/games_data';
import clientPromise from '../../../../lib/functions/mongodb'
import { NextApiRequest, NextApiResponse } from 'next';

type ExtendedRequest = NextApiRequest & {
    query: {
      gameId:string;
      userId:ObjectId;
    };
}

export default async function handler(req:ExtendedRequest, res:NextApiResponse) {
    if(req.method === 'GET') {
        try {
            const query = req.query
            const client = await clientPromise
            const db = client.db('gameFevr')

            await games_data_document(query.gameId)
            await db.collection('games_data').updateOne({gameId:query.gameId},{$inc:{visited:1}})
            await db.collection('users').updateOne({_id:new ObjectId(query.userId)},{$push:{visited_games:query.gameId}})

            res.status(200).send({error:null})

        } catch (e) {
            console.log('error on visited',e)
            return res.status(500).send({error:'Unexpected Error'})
        }
    }
}

