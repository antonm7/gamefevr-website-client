import {Request, Response} from 'express';
import { NamedGame } from '../../../types';

export default async function handler(req:Request, res:Response) {
    if(req.method === 'GET') {
        try {
            const query = req.query;
            let games:NamedGame[] = []
            let data = []

            const getData = await fetch(`https://api.rawg.io/api/games?key=e996863ffbd04374ac0586ec2bcadd55&page=1&page_size=5&search=${query.search}`)
            data = await getData.json()

            for(let key in data.results) {
                games.push({
                    name:data.results[key].name,
                    id:data.results[key].id
                })
            }
            
            res.status(200).send({games})
        } catch (e) {
            console.log('error, e')
        }
    }
}