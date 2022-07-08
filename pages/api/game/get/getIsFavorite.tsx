import {Request, Response} from 'express';
import clientPromise from '../../../../lib/functions/mongodb'

export default async function handler(req:Request, res:Response) {
    if(req.method === 'GET') {
        try {
            const query:any = req.query
            const client = await clientPromise
            const db = client.db('gameFevr')
            
            const doc = await db.collection('favorites').findOne({userId:query.userId, gameId:parseInt(query.gameId)})
           
            if(!doc) {
                res.status(200).send({error:null,isFavorite:false})
            } else {
                res.status(200).send({error:null,isFavorite:doc._id})
            }

        } catch (e) {
            console.log('error on getRank',e)
            return res.status(500).send({erro:'Unexpected Error'})
        }
    }
}

