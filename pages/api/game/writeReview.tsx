import { ObjectId } from 'bson';
import {Request, Response} from 'express';
import games_data_document from '../../../lib/functions/create/games_data'
import clientPromise from '../../../lib/functions/mongodb'
import { Rank, Review } from '../../../types/schema';

export default async function handler(req:Request, res:Response) {
    if(req.method === 'POST') {
        let db = null
        const query = req.body
        let savedReview;
        //initializing database
        try {
            const client = await clientPromise
            db = client.db('gameFevr')
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})
            return console.log('error on initializing database',e)
        }
        //checks if game document exists
        try {
            await games_data_document(req.body.gameId)
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})
            return console.log('error on games_data_document', e)
        }
        //saves the reviews inside own ranks collection
        try {
            const review:Review = {
                userId: query.userId,
                gameId: query.gameId,
                created_at: 'time',
                rank:query.rank,
                text: query.text
            }
           
            savedReview = await db.collection('reviews').insertOne(review)
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})
            return console.log('error saving the review',e)
        }
        //updates user's document
        try {
           await db.collection('users')
           .updateOne({_id:new ObjectId(query.userId)},
           {$push:{reviews:savedReview?.insertedId}}) 
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})
            return console.log('error on updating user ranks field')
        }
        //updates game data document
        try {
            await db.collection('games_data').updateOne({gameId:query.gameId}, {
                $inc:{reviews:1}
            })
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})    
            return console.log('error on updating games_data document',e)
        }
        res.status(201).send({error:null})
    }
}

