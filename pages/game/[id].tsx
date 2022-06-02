import { useEffect, useState } from "react"
import SmallLoader from "../../components/common/SmallLoader"
import Screenshots from "../../components/GamePage/Screenshots"
import SearchLayout from "../../components/layout/SearchLayout"
import useQuery from "../../lib/functions/useQuery"
import { DetailedGame, ElementDescription } from "../../types"

type Props = {
    game:DetailedGame
}

export default function GamePage(props:Props) {
    const [game, setGame] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const query:any = useQuery();

    useEffect(() => {
        if(!query?.id) return;
        const fetchGame = async () => {
            console.log(query.id)
            const getData = await fetch(`https://api.rawg.io/api/games/${query.id}?key=e996863ffbd04374ac0586ec2bcadd55`)
            const getScreenshots = await fetch(`https://api.rawg.io/api/games/${query.id}/screenshots?key=e996863ffbd04374ac0586ec2bcadd55`)
            const gameData = await getData.json()
            const screenshots = await getScreenshots.json()
            
            let finalData:DetailedGame = {
                id:gameData.id,
                name:gameData.name,
                released:gameData.released,
                background_image:gameData.background_image,
                description:gameData.description,
                genres:gameData.genres,
                developers:gameData.developers,
                parent_platforms:gameData.parent_platforms,
                platforms:gameData.platforms,
                stores:gameData.stores,
                publishers:gameData.publishers,
                screenshots:screenshots,
                tags:gameData.tags,
                website:gameData.website,
            }
            setGame(finalData)
        }
        fetchGame()
        setLoading(false)
    },[query])



    return (
        <SearchLayout>
            {
                loading || !game ? <SmallLoader big={true} screenCentered={true}/> :
                <main className="px-44 py-10">
                    <div className="flex flex-row justify-between">
                        <div>
                            <h3 className="text-white font-normal text-1xl opacity-40"> {game.released.slice(0,4)}</h3>
                            <h1 className="text-white text-8xl font-bold overflow-hidden">{game.name}</h1>
                            <div className="pt-8">
                                <div className="flex flex-row flex-no-wrap">
                                    <h2 className="text-white font-normal text-1xl opacity-70">Publisher:</h2> 
                                    {game.publishers.map((publisher:ElementDescription,index:number) => <h2 key={index} className="pl-1 text-white font-semibold text-1xl">{publisher.name}{index !== game.publishers.length - 1 ? ',' : ''}</h2>)}
                                </div>
                                <div className="flex flex-row flex-no-wrap">
                                    <h2 className="text-white font-normal text-1xl opacity-70">Genres:</h2> 
                                    {game.genres.map((genre:ElementDescription,index:number) => <h2 key={index} className="pl-1 text-white font-semibold text-1xl">{genre.name}{index !== game.genres.length - 1 ? ',' : ''}</h2>)}
                                </div>
                            </div>
                        </div>
                        <div className="h-60 w-96 bg-cover rounded-xl bg-center bg-no-repeat" style={{height:'14rem',backgroundImage: `url(${game.background_image})`}} />
                    </div>
                    <div className="max-w-2xl leading-8 text-base py-44 text-white font-light"
                    dangerouslySetInnerHTML={{
                        __html: game.description
                    }}></div> 
                    <Screenshots images={game.screenshots.results}/>             
                </main>
            }
        </SearchLayout>
    )
}