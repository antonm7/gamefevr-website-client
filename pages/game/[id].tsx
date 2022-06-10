import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import SmallLoader from "../../components/common/SmallLoader"
import Screenshots from "../../components/GamePage/Screenshots"
import SearchLayout from "../../components/layout/SearchLayout"
import useQuery from "../../lib/functions/useQuery"
import { DetailedGame, ElementDescription, Platform } from "../../types"
import Image from 'next/image'
import YellowButton from "../../components/common/YellowButton"
import Reviews from "../../components/GamePage/Reviews"

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
                <div>
                    <main className="px-44 py-10">
                        <div className="flex flex-row justify-between">
                            <div>
                                <h3 className="text-white font-normal text-1xl opacity-40"> {game.released.slice(0,4)}</h3>
                                <h1 className="text-white text-8xl font-bold overflow-hidden h-28">{game.name}</h1>
                                <div className="pt-8">
                                    <div className="flex flex-row flex-no-wrap">
                                        <h2 className="text-white font-normal text-1xl opacity-70">Publisher:</h2> 
                                        {game.publishers.map((publisher:ElementDescription,index:number) => <h2 key={index} className="pl-1 text-white font-semibold text-1xl">{publisher.name}{index !== game.publishers.length - 1 ? ',' : ''}</h2>)}
                                    </div>
                                    <div className="flex flex-row flex-no-wrap pt-2">
                                        <h2 className="text-white font-normal text-1xl opacity-70">Genres:</h2> 
                                        {game.genres.map((genre:ElementDescription,index:number) => <h2 key={index} className="pl-1 text-white font-semibold text-1xl">{genre.name}{index !== game.genres.length - 1 ? ',' : ''}</h2>)}
                                    </div>
                                    <div className="flex flex-row flex-no-wrap pt-2">
                                        <h2 className="text-white font-normal text-1xl opacity-70">Platforms:</h2> 
                                        {game.platforms.map((platform:Platform,index:number) => <h2 key={index} className="pl-1 text-white font-semibold text-1xl">{platform.platform.name}{index !== game.platforms.length - 1 ? ',' : ''}</h2>)}
                                    </div>
                                </div>
                                <div className="flex items-center pt-6">
                                    <div className="w-8 h-8 rounded-sm flex items-center justify-center mr-4 cursor-pointer" style={{backgroundColor:'#38b6cc'}}>
                                        <Image  id="brand" src={"/icons/twitter.svg"} height={14} width={14}/>
                                    </div>
                                    <div className="w-8 h-8 rounded-sm flex items-center justify-center cursor-pointer" style={{backgroundColor:'#38b6cc'}}>
                                        <Image  id="brand" src={"/icons/facebook.svg"} height={14} width={14}/>
                                    </div>
                                </div>
                            </div>
                            <div className="h-60 w-96 bg-cover rounded-xl bg-center bg-no-repeat" style={{height:'19rem',backgroundImage: `url(${game.background_image})`}} />
                        </div>
                        <div className="max-w-2xl leading-8 text-base py-20 text-white font-light"
                        dangerouslySetInnerHTML={{
                            __html: game.description
                        }}></div>
                        <div className="flex flex-row flex-wrap pt-2 max-w-lg	">
                            <h2 className="text-white font-normal text-1xl opacity-70">Tags:</h2> 
                            {game.tags.map((tag:ElementDescription,index:number) => <h2 key={index} className="px-1 pb-1 text-white font-semibold text-1xl opacity-60">{tag.name}{index !== game.tags.length - 1 ? ',' : ''}</h2>)}
                        </div>
                    </main>
                    <div className="relative" style={{height:'700px'}}>
                        <div id="controller"/>
                        <Screenshots images={game.screenshots.results}/>             
                    </div>
                    <div className="flex flex-col items-center">
                        <Reviews />
                    </div>
                </div>
            }
        </SearchLayout>
    )
}