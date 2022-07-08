import {Request, Response} from 'express';
import { NextApiRequest } from 'next';
import clientPromise from '../../../../lib/functions/mongodb'

type ExtendedRequest = NextApiRequest & {
    query: {
      gameId:string;
      userId:string;
    };
}

export default async function handler(req:ExtendedRequest, res:Response) {
    if(req.method === 'GET') {
        try {
            const query = req.query
            const client = await clientPromise
            const db = client.db('gameFevr')
            
            const doc = await db.collection('ranks').findOne({userId:query.userId, gameId:query.gameId})
            
            if(!doc) {
                res.status(200).send({error:null,isUserRated:false})
            } else {
                res.status(200).send({error:null,isUserRated:doc.value})
            }

        } catch (e) {
            console.log('error on getRank',e)
            return res.status(500).send({erro:'Unexpected Error'})
        }
    }
}

