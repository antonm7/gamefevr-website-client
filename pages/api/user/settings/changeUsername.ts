import { ObjectId } from 'bson';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../lib/functions/mongodb'
import checkJWT from '../../../../lib/functions/checkJWT';

interface ExtendedNextApiRequest extends NextApiRequest {
    body: {
      userId:string;
      newUsername:string;
    };
}

export default async function handler(req:ExtendedNextApiRequest, res:NextApiResponse) {
    if(req.method === 'POST') {
        try {
            const auth = await checkJWT(req)
            if(!auth) throw new Error('No token')
        } catch (e) {
            console.log(e)
            return res.status(401)
        }
        let db = null
        let body = req.body
        //initializing database
        try {
            const client = await clientPromise
            db = client.db('gameFevr')
        } catch (e) {
            console.log('error on initializing database',e)
            res.status(200).send({error:'Unexpected error'})
            return
        }
        //checkinf if username is already taken
        try {
            const user = await db.collection('users').findOne({username:body.newUsername})
            if(user) throw new Error('Username already taken')
        } catch (e) {
            console.log('error on checking if username is already taken',e)
            res.status(200).send({error:'username is already taken'})
            return 
        }
        //updating username
        try {
            await db.collection('users').updateOne({_id:new ObjectId(body.userId)},{$set:{username:body.newUsername}})
            res.status(200).send({error:null})
        } catch (e) {
            console.log(e)
            res.status(500).send({error:'undexpected error on updating username'})
        }
    }
}

