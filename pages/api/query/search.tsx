import express, {Request, Response} from 'express';

export default async function handler(req:Request, res:Response) {
    if(req.method === 'POST') { 
        try {
            const body:any = req.body
            const {yearRange, genres, consoles, publishers } = body.query
            let games:any = []
            let filteredString:string = ''
            console.log(body)
            if(yearRange || genres || consoles || publishers) {
                if(yearRange) {
                    filteredString = filteredString.concat('', `&dates=${yearRange[0]}-1-1,${yearRange[1]}-1-1`);
                }
                if(genres) {
                    let genresString:string = ''
                    genres.map((g:string,i:number) => i === genres.length - 1 ? genresString.concat(g) : genresString.concat(`g,`))
                    filteredString = filteredString.concat(`&genres=${genresString}`)
                } 
                if(publishers) {
                    let publishersString:string = ''
                    publishers.map((p:string,i:number) => i === publishers.length - 1 ? publishersString.concat(p) : publishersString.concat(`${p},`))
                    filteredString = filteredString.concat(`&genres=${publishersString}`)
                }
                const getData = await fetch(`https://api.rawg.io/api/games?key=e996863ffbd04374ac0586ec2bcadd55&page=${body.page}&page_size=20&dates=${yearRange[0]}-01-01,${yearRange[1]}-01-01`)
                games = await getData.json()
            } else {
                const getData = await fetch(`https://api.rawg.io/api/games?key=e996863ffbd04374ac0586ec2bcadd55&page=${body.page}&page_size=20`)
                games = await getData.json()
            }
            res.status(200).send({games:games.results})
            //filters
            //dates:2010-01-01,2012-01-01
            //genres:action,indie
            //platforms:1-pc,2-playstations,3XBOX,4IOS,8Android,5Mac,6LINUX,7Nintendo,Atari9,Commodore / Amiga10,11SEGA,12-3DO,13NEOGEO,14Web
        } catch (e) {
            console.log(e)
        }
    }
}