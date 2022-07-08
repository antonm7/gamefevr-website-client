import { ObjectId } from 'bson';
import {Request, Response} from 'express';
import clientPromise from '../../../../../lib/functions/mongodb';

interface Query {
    userId:string;
    gameId:string;
    favoriteId:string;
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
        //saves the favorites inside own ranks collection
        console.log(query)
        try {
            await db.collection('favorites').deleteOne({_id:new ObjectId(query.favoriteId)})
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})
            return console.log('error deleting the review',e)
        }
        //updates user's document
        console.log(query)
        try {
           await db.collection('users')
           .updateOne({_id:new ObjectId(query.userId)},
           {$pull:{favorites:new ObjectId(query.favoriteId)}}) 
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})
            return console.log('error on updating user ranks field')
        }
        //updates game data document
        try {
            await db.collection('games_data').updateOne({gameId:query.gameId}, {
                $inc:{favorites:-1}
            })
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})    
            return console.log('error on updating games_data document',e)
        }
        console.log('deleted')
        res.status(200).send({error:null})
    }
}

