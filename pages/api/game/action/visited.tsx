import { ObjectId } from 'bson';

import {Request, Response} from 'express';
import games_data_document from '../../../../lib/functions/create/games_data';
import clientPromise from '../../../../lib/functions/mongodb'
import { getToken } from 'next-auth/jwt';

export default async function handler(req:Request, res:Response) {
    if(req.method === 'GET') {
        try {
            const query:any = req.query
            const headers:any = req.headers
            const client = await clientPromise
            const db = client.db('gameFevr')
            console.log()
            await games_data_document(query.gameId)
            await db.collection('games_data').updateOne({gameId:query.gameId},{$inc:{visited:1}})
            await db.collection('users').updateOne({_id:new ObjectId(headers.userid)},{$push:{visited_games:query.gameId}})

            res.status(200).send({error:null})

        } catch (e) {
            console.log('error on visited',e)
            return res.status(500).send({error:'Unexpected Error'})
        }
    }
}

