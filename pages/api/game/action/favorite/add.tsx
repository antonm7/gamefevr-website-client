import { ObjectId } from 'bson';
import { Favorite_Type } from '../../../../../types/schema'
import clientPromise from '../../../../../lib/functions/mongodb'
import games_data_document from '../../../../../lib/functions/create/games_data';
import { NextApiRequest, NextApiResponse } from 'next';

interface ExtendedNextApiRequest extends NextApiRequest {
    body: {
        gameId:string;
        userId:string;
    };
}

export default async function handler(req:ExtendedNextApiRequest, res:NextApiResponse) {
    if(req.method === 'POST') {
        let db = null
        let savedFavorite;
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
        //saves the favorite inside own favorites collection
        try {
            const getData = await fetch(`https://api.rawg.io/api/games/${req.body.gameId}?key=e996863ffbd04374ac0586ec2bcadd55`)
            const gameData = await getData.json()
            const favorite:Favorite_Type = {
                userId: req.body.userId,
                gameId: req.body.gameId,
                created_at: 'time',
                game_name: gameData.name,
                game_image: gameData.background_image
            }
            savedFavorite = await db.collection('favorites').insertOne(favorite)
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})
            return console.log('error saving the favorite',e)
        }
        //updates user's document
        try {
           await db.collection('users')
           .updateOne({_id:new ObjectId(req.body.userId)},
           {$push:{favorites:savedFavorite?.insertedId}}) 
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})
            return console.log('error on updating user ranks field')
        }
        //updates game data document
        try {
            await db.collection('games_data').
            updateOne({gameId:req.body.gameId},
            {$inc:{favorites:1}})
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})    
            return console.log('error on updating games_data document',e)
        }
        res.status(200).send({error:null, favoriteId:savedFavorite.insertedId})
    }
}

