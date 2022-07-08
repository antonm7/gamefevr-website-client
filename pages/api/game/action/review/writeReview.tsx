import { ObjectId } from 'bson';
import { NextApiRequest, NextApiResponse } from 'next';
import games_data_document from '../../../../../lib/functions/create/games_data'
import clientPromise from '../../../../../lib/functions/mongodb'
import { Review_Type } from '../../../../../types/schema';

interface ExtendedNextApiRequest extends NextApiRequest {
    body: {
        userId:string;
        gameId:string;
        rank:string;
        text:string;
    };
}

export default async function handler(req:ExtendedNextApiRequest, res:NextApiResponse) {
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
            const getData = await fetch(`https://api.rawg.io/api/games/${query.gameId}?key=e996863ffbd04374ac0586ec2bcadd55`)
            const gameData = await getData.json()
            
            const review:Review_Type = {
                userId: query.userId,
                gameId: query.gameId,
                game_name:gameData.name,
                game_image:gameData.background_image,
                created_at: 'time',
                rank:query.rank,
                text: query.text,
                likes:[],
                dislikes:[]
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
        try {
            const review = await db.collection('reviews').findOne({_id:savedReview?.insertedId})
            res.status(201).send({error:null,review})
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})    
            return console.log('error on updating games_data document',e)
        }
    }
}

