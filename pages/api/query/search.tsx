import {Request, Response} from 'express';

interface BodyReq {
    page:number,
    query: {
        yearRange:number[],
        consoles:string | string[],
        genres:string | string[]
    }
}

export default async function handler(req:Request, res:Response) {
    if(req.method === 'POST') { 
        try {
            const body:BodyReq = req.body
            const {yearRange, genres, consoles } = body.query
            let games = []
            let filteredString:string = ''
            //checking if i got some filter
            if(yearRange || genres || consoles) {
                if(yearRange) {
                    filteredString = filteredString.concat('', `&dates=${yearRange[0]}-01-01,${yearRange[1]}-12-31`);
                }
                //simetimes from the client i get consoles as string, but i need an array
                //thats why i am checkinf the type of the consoles
                if(consoles) {
                    if(typeof consoles === 'string') {
                        filteredString = filteredString.concat(`&parent_platforms=${consoles}`)
                    } else {
                        let consolesString:string = ''
                        for(let key in consoles) {
                            if(parseInt(key) !== consoles.length - 1) {
                                consolesString = consolesString.concat(`${consoles[key]}`,',')
                            } else {
                                consolesString = consolesString.concat(`${consoles[key]}`,'') 
                            }
                        }   
                        filteredString = filteredString.concat(`&platforms=${consolesString}`)
                    }
                }
                if(genres) {
                    if(typeof genres === 'string') {
                        filteredString = filteredString.concat(`&genres=${genres}`)
                    } else {
                        let genresString:string = ''
                        for(let key in genres) {
                            if(parseInt(key) !== genres.length - 1) {
                                genresString = genresString.concat(`${genres[key]}`,',')
                            } else {
                                genresString = genresString.concat(`${genres[key]}`,'') 
                            }
                        }   
                        filteredString = filteredString.concat(`&genres=${genresString}`)
                    }
                } 
                const getData = await fetch(`https://api.rawg.io/api/games?key=e996863ffbd04374ac0586ec2bcadd55&ordering=-released&page=${body.page}&page_size=20${filteredString}`)
                games = await getData.json()
            } else {
                const getData = await fetch(`https://api.rawg.io/api/games?key=e996863ffbd04374ac0586ec2bcadd55&ordering=-released&page=${body.page}&page_size=20`)
                games = await getData.json()
            }
            console.log(games)
            res.status(200).send({games:games.results})
        } catch (e) {
            console.log(e)
        }
    }
}