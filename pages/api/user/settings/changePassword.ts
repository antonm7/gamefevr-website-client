import { ObjectId } from 'bson';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../lib/functions/mongodb'
import checkJWT from '../../../../lib/functions/checkJWT';
import {hash,compare} from 'bcrypt'

interface ExtendedNextApiRequest extends NextApiRequest {
    body: {
      userId:string;
      oldPassword:string;
      newPassword:string;
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
            throw new Error('Unexpected error')
        }
        //comparing password
        try {
            const user = await db.collection('users').findOne({_id:new ObjectId(body.userId)})
            if(!user) {
                res.status(404).send({error:'User not found'})
                throw new Error('User not found')
            }
            const isValid = await compare(body.oldPassword,user.password)
            if(!isValid) {
                return res.status(200).send({error:'Wrong password'})
            }
        } catch (e) {
            console.log('error on comparing password',e)
            throw new Error('Unexpected error')
        }

        try {
            const hashedPassword = await hash(body.newPassword,8)
            await db.collection('users').updateOne({_id:new ObjectId(body.userId)},{$set:{password:hashedPassword}})
            res.status(200).send({error:null})
        } catch (e) {
            console.log(e)
            res.status(500).send({error:'Unexpected error'})
        }
    }
}

