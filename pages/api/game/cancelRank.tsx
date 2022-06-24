import { ObjectId } from 'bson';
import {Request, Response} from 'express';
import games_data_document from '../../../lib/functions/create/games_data'
import clientPromise from '../../../lib/functions/mongodb'
import { Rank } from '../../../types/schema';

export default async function handler(req:Request, res:Response) {
    if(req.method === 'POST') {
        let db = null
        let removedRank;
        //initializing database
        try {
            const client = await clientPromise
            db = client.db('gameFevr')
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})
            return console.log('error on initializing database',e)
        }
        //delete from ranks collection
        try {
            removedRank = await db.collection('ranks').findOne({userId:req.body.userId, gameId:req.body.gameId})
            await db.collection('ranks').deleteOne({userId:req.body.userId, gameId:req.body.gameId})
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})
            return console.log('error saving the rank',e)
        }
        //updates user's document
        try {
           await db.collection('users')
           .updateOne({_id:new ObjectId(req.body.userId)},
           {$pull:{ranks:removedRank?._id}}) 
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})
            return console.log('error on updating user ranks field')
        }
        //updates game data document
        try {
            if(req.body.value === 'waste_of_time') {
                await db.collection('games_data').
                updateOne({gameId:req.body.gameId},
                {$inc:{waste_of_time:-1}})
            }

            if(req.body.value === 'nuh') {
                await db.collection('games_data').
                updateOne({gameId:req.body.gameId},
                {$inc:{nuh:-1}})
            }

            if(req.body.value === 'good') {
                await db.collection('games_data').
                updateOne({gameId:req.body.gameId},
                {$inc:{good:-1}})
            }

            if(req.body.value === 'must') {
                await db.collection('games_data').
                updateOne({gameId:req.body.gameId},
                {$inc:{must:-1}})
            }
        } catch (e) {
            res.status(500).send({error:'Unexpected error'})    
            return console.log('error on updating games_data document',e)
        }
        res.status(200).send({error:null})
    }
}

