import { ObjectId } from 'bson';
import {Request, Response} from 'express';
import clientPromise from '../../../../../lib/functions/mongodb'

interface Query {
    reviewId:string;
    userId:string;
}

export default async function handler(req:Request, res:Response) {
    if(req.method === 'POST') {
        let db = null
        const query:Query = req.body
        //initializing database
        try {
            const client = await clientPromise
            db = client.db('gameFevr')
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})
            return console.log('error on initializing database',e)
        }
        try {
            //making sure user didn't like the review before
            await db.collection('reviews').updateOne({_id:new ObjectId(query.reviewId)}, {$pull:{likes:query.userId}})
            //pushing the like
            await db.collection('reviews').updateOne({_id:new ObjectId(query.reviewId)}, {$push:{likes:query.userId}})
            res.status(200).send({error:null})
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})
            return console.log('error on like review',e)
        }
        
    }
}

