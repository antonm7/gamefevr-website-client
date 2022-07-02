import { ObjectId } from 'bson';
import {Request, Response} from 'express';
import clientPromise from '../../../../../lib/functions/mongodb';

interface Query {
    userId:string;
    gameId:string;
    reviewId:string;
}

export default async function handler(req:Request, res:Response) {
    if(req.method === 'POST') {
        let db = null
        const query:Query = req.body
        let savedReview;
        //initializing database
        try {
            const client = await clientPromise
            db = client.db('gameFevr')
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})
            return console.log('error on initializing database',e)
        }
        //saves the reviews inside own ranks collection
        try {
            await db.collection('reviews').deleteOne({_id:new ObjectId(query.reviewId)})
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})
            return console.log('error deleting the review',e)
        }
        //updates user's document
        try {
           await db.collection('users')
           .updateOne({_id:new ObjectId(query.userId)},
           {$pull:{reviews:query.reviewId}}) 
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})
            return console.log('error on updating user ranks field')
        }
        //updates game data document
        try {
            await db.collection('games_data').updateOne({gameId:query.gameId}, {
                $inc:{reviews:-1}
            })
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})    
            return console.log('error on updating games_data document',e)
        }
        res.status(200).send({error:null})
    }
}

