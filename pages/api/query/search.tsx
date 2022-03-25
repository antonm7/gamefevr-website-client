import express, {Request, Response} from 'express';

export default async function handler(req:Request, res:Response) {
    if(req.method === 'POST') { 
        const query:any = req.body
        console.log('got request,',query)
        //filters
        //dates:2010-01-01,2012-01-01
        //genres:action,indie
        //platforms:1-pc,2-playstations,3XBOX,4IOS,8Android,5Mac,6LINUX,7Nintendo,Atari9,Commodore / Amiga10,11SEGA,12-3DO,13NEOGEO,14Web
        let games:any = []
        let filteredString:string = ''
        if(Object.keys(query).length === 0){
            const getData = await fetch(`https://api.rawg.io/api/games?key=e996863ffbd04374ac0586ec2bcadd55&page_size=20`)
            games = await getData.json()
        } else {
            if(query.dates) filteredString.concat(`&dates=${query.dates[0]}-1-1,${query.dates[1]}-1-1`)
            if(query.genres) {
            let genresString:string = ''
            query.genres.map((g:string,i:number) => i === query.genres.length - 1 ? genresString.concat(g) : genresString.concat(`g,`))
            filteredString.concat(`&genres=${genresString}`)
            } 
            if(query.publishers) {
            let publishersString:string = ''
            query.publishers.map((p:string,i:number) => i === query.publishers.length - 1 ? publishersString.concat(p) : publishersString.concat(`${p},`))
            filteredString.concat(`&genres=${publishersString}`)
            }
            const getData = await fetch(`https://api.rawg.io/api/games?key=e996863ffbd04374ac0586ec2bcadd55&page_size=20${filteredString}`)
            games = await getData.json()
        } 
        res.status(200).send({games:games.results})
    }
}