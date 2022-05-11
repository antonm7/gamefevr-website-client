import express, {Request, Response} from 'express';
import Prisma from '../../../lib/functions/initiPrisma'

interface ReqBody {
    email: string,
    password: string,
    username: string
}

async function handler(req:Request, res:Response) {
    //Only POST mothod is accepted
    if (req.method === 'POST') {
      try {
        const { email, password, username }:ReqBody = req.body;
        console.log('request:',req.body)
        // const validateEmail = (email:string) => {
        //     const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //     return re.test(email)
        // }
        
        // if(!validateEmail(email)) return res.status(500).send({error:'Please enter valid email'})
        
        // const passw =  /^[A-Za-z]\w{7,14}$/;
        // if(!password.match(passw)) return res.status(500).send({error:'Please enter valid password'})

        // if(username.length < 6) return res.status(500).send({error:'Username must be at least 6 letters'})
        const newUser = await Prisma.user.create({
          data: {
            email,
            username,
            password,
            bookmarked_games:[],
            reviews:{}
          }
        })
        console.log('saved', newUser)
        
        //with prisma
        //check if email isExists
        //check if username isExists
        //create validation email link
        //work with nodemailer to send email verify link
        //save user to database
        // res.status(201).send({error:null})
      } catch (e) {
        console.log('error on signup', e)
        res.status(500).send()
      }
    }
}

export default handler;