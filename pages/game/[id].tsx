import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import SmallLoader from "../../components/common/SmallLoader"
import Screenshots from "../../components/GamePage/Screenshots"
import SearchLayout from "../../components/layout/SearchLayout"
import useQuery from "../../lib/functions/useQuery"
import { DetailedGame, ElementDescription, Platform } from "../../types"
import Image from 'next/image'
import Review from "../../components/GamePage/Review"
import RateGame from "../../components/GamePage/RateGame"
import useWindowSize from "../../lib/functions/useWindowSize"
import YellowButton from "../../components/common/YellowButton"
import ReviewsSlider from "../../components/GamePage/ReviewsSlider"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { useSession } from "next-auth/react"
import WriteReview from "../../components/GamePage/WriteReview"

type Props = {
    game:DetailedGame
}

export default function GamePage(props:Props) {
    const [game, setGame] = useState<DetailedGame | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [width, height] = useWindowSize();
    const [screenshotsAnimtion, setScreenshotsAnimtion] = useState<boolean>(false)
    const [reviewsAnimation, setReviewsAnimation] = useState<boolean>(false)
    const [writeReviewVisibility, setWriteReviewVisibility] = useState<boolean>(false)
    const [isUserRated, setIsUserRated] = useState<string | null>(null)
    const query:any = useQuery();
    const session:any = useSession()

    const toggleAnimation = () => {
        if(reviewsAnimation) {
            setReviewsAnimation(false)
            setTimeout(() => {
                setScreenshotsAnimtion(false)
            },300)
        } else {
            setScreenshotsAnimtion(true)
            setTimeout(() => {
                setReviewsAnimation(true)
            },300)
        }
    }

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
                screenshots,
                tags:gameData.tags,
                website:gameData.website,
            }
            setGame(finalData)
        }
        fetchGame()
        setLoading(false)
    },[query?.id])

    useEffect(() => {
        if(!query?.id) return;
        if(session.status === 'authenticated') {
            fetch(`/api/game/visited?gameId=${query.id}`, {
                headers:{
                    userId:session.data?.user?.userId
                }
            })
        }
    },[query?.id,session.status])

    //TODO:add additional data for the website, like the game stores.
    //maybe trying accessing another api's like twitch/steam/epicgames.

    return (
        // TODO: add design shapes on the backgorund
        <SearchLayout>
            {
                loading || !game ? <SmallLoader big={true} screenCentered={true}/> :
                <div>
                    <main className="px-44 py-10" id="game_page">
                    <WriteReview isUserRated={isUserRated} onClose={() => setWriteReviewVisibility(false)} visible={writeReviewVisibility}/>
                        {width > 640 ? 
                            <div id="game_page_header" className="flex flex-row justify-between">
                                <div className="pr-16">
                                    <h3 className="text-white font-normal text-1xl opacity-40"> {game.released.slice(0,4)}</h3>
                                    <h1 id="game_page_game_name" className="text-white text-8xl font-bold overflow-hidden h-auto">{game.name}</h1>
                                    <div className="pt-8 ">
                                        <div className="flex flex-row flex-no-wrap">
                                            <h2 id="game_page_detail" className="text-white font-normal text-1xl opacity-70">Publisher:</h2> 
                                            {game.publishers.map((publisher:ElementDescription,index:number) => <h2 key={index} id="game_page_detail" className="pl-1 text-white font-semibold text-1xl">{publisher.name}{index !== game.publishers.length - 1 ? ',' : ''}</h2>)}
                                        </div>
                                        <div className="flex flex-row flex-no-wrap pt-2">
                                            <h2 id="game_page_detail" className="text-white font-normal text-1xl opacity-70">Genres:</h2> 
                                            {game.genres.map((genre:ElementDescription,index:number) => <h2 key={index} id="game_page_detail" className="pl-1 text-white font-semibold text-1xl">{genre.name}{index !== game.genres.length - 1 ? ',' : ''}</h2>)}
                                        </div>
                                        <div className="flex flex-wrap w-42 pt-2" style={{width:'50%'}} id="platforms_row">
                                            <h2 id="game_page_detail" className="text-white font-normal text-1xl opacity-70">Platforms:</h2> 
                                            {game.platforms.map((platform:Platform,index:number) => <h2 key={index} id="game_page_detail" className="pl-1 text-white font-semibold text-1xl whitespace-nowrap">{platform.platform.name}{index !== game.platforms.length - 1 ? ',' : ''}</h2>)}
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
                                <div id="game_page_background_image_wrapper" className="flex flex-col items-center" style={{minWidth:'24rem'}}>
                                    <div id="game_page_background_image" className="h-60 w-96 bg-cover rounded-xl bg-center bg-no-repeat" style={{height:'19rem',backgroundImage: `url(${game.background_image})`}} />
                                    <RateGame updateIsUserRated={(value:string) => setIsUserRated(value)}/>                                </div>
                            </div> :
                            // responsive > order change
                            <div id="game_page_header" className="flex flex-row justify-between">
                                <div>
                                    <h3 className="text-white font-normal text-1xl opacity-40"> {game.released.slice(0,4)}</h3>
                                    <h1 id="game_page_game_name" className="text-white text-8xl font-bold overflow-hidden h-auto">{game.name}</h1>
                                    <div id="game_page_background_image_wrapper" className="flex flex-col items-center" style={{minWidth:'24rem'}}>
                                        <div id="game_page_background_image" className="h-60 w-96 bg-cover rounded-xl bg-center bg-no-repeat" style={{height:'19rem',backgroundImage: `url(${game.background_image})`}} />
                                    </div>
                                    <div className="pt-8 ">
                                        <div className="flex flex-row flex-no-wrap">
                                            <h2 id="game_page_detail" className="text-white font-normal text-1xl opacity-70">Publisher:</h2> 
                                            {game.publishers.map((publisher:ElementDescription,index:number) => <h2 key={index} id="game_page_detail" className="pl-1 text-white font-semibold text-1xl">{publisher.name}{index !== game.publishers.length - 1 ? ',' : ''}</h2>)}
                                        </div>
                                        <div className="flex flex-row flex-no-wrap pt-2">
                                            <h2 id="game_page_detail" className="text-white font-normal text-1xl opacity-70">Genres:</h2> 
                                            {game.genres.map((genre:ElementDescription,index:number) => <h2 key={index} id="game_page_detail" className="pl-1 text-white font-semibold text-1xl">{genre.name}{index !== game.genres.length - 1 ? ',' : ''}</h2>)}
                                        </div>
                                        <div className="flex flex-wrap w-42 pt-2" style={{width:'50%'}} id="platforms_row">
                                            <h2 id="game_page_detail" className="text-white font-normal text-1xl opacity-70">Platforms:</h2> 
                                            {game.platforms.map((platform:Platform,index:number) => <h2 key={index} id="game_page_detail" className="pl-1 text-white font-semibold text-1xl whitespace-nowrap">{platform.platform.name}{index !== game.platforms.length - 1 ? ',' : ''}</h2>)}
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
                                    <div className="relative h-48 pt-5 overflow-hidden">
                                        <RateGame updateIsUserRated={(value:string) => setIsUserRated(value)}/>
                                    </div>
                                </div>
                            </div>
                        }
                        <div id="game_page_description_wrapper" className="max-w-2xl leading-8 text-base py-20 text-white font-light"
                        dangerouslySetInnerHTML={{
                            __html: game.description
                        }}></div>
                        <div className="flex flex-row flex-wrap pt-2 max-w-lg">
                            <h2 className="text-white font-normal text-1xl opacity-70">Tags:</h2> 
                            {game.tags.map((tag:ElementDescription,index:number) => <h2 key={index} className="px-1 pb-1 text-white font-semibold text-1xl opacity-60">{tag.name}{index !== game.tags.length - 1 ? ',' : ''}</h2>)}
                        </div>
                    </main>
                    {/* TODO:finish adding a review on backend and client + user authorization*/}
                    {width > 1200 ?
                        <div id="game_page_screenshots_controller" className="relative overflow-hidden" style={{height:'700px'}}>
                            <div id="controller" className={`${screenshotsAnimtion ? 'controller_animation' : ''}`}/>
                            <Screenshots isAnimated={screenshotsAnimtion } images={game.screenshots.results}/> 
                            <div className="flex items-center overflow-hidden" style={{marginTop:width > 1400 ?'-28.45rem' : '-20rem'}}>
                                <div className={`px-20 ${reviewsAnimation ? 'write_review_animation_enabled' : 'write_review_animation_disabled'}`}>
                                    <FontAwesomeIcon icon={faPlus} className="h-16 text-white cursor-pointer opacity-40 hover:opacity-100 simple-transition" onClick={() => setWriteReviewVisibility(true)}/>
                                </div>
                                <ReviewsSlider isAnimated={reviewsAnimation}/>
                            </div>
                        </div> :
                        <div >
                            <div id="game_page_screenshots_controller" className="relative overflow-hidden" style={{height:'700px'}}>
                                <div id="controller" className={`${screenshotsAnimtion ? 'controller_animation' : ''}`}/>
                                <Screenshots isAnimated={screenshotsAnimtion } images={game.screenshots.results}/> 
                            </div>
                            <div id="game_page_reviews_container" className="flex flex-col items-center">
                                <div className="w-72 p-6 flex items-center justify-center rounded-xl mb-8 cursor-pointer opacity-80 hover:opacity-100" style={{backgroundColor:'rgba(21,21,21,0.6)'}}>
                                    <div className="flex items-center justify-center" onClick={() => setWriteReviewVisibility(true)}>
                                        <FontAwesomeIcon icon={faPlus} className="h-6 text-white pr-4" onClick={() => setWriteReviewVisibility(true)}/>
                                        <h1 className="text-white text-xl flex items-center">Add A Review</h1>
                                    </div>
                                </div>
                                <div className="my-4">
                                    <Review/>
                                </div>
                                <div className="my-4">
                                    <Review/>
                                </div>
                                <div className="my-4">
                                    <Review/>
                                </div>
                            </div>
                        </div>
                    }
                    {width > 1200 ? 
                        <div className={`w-full flex justify-center ${reviewsAnimation ? 'button_animation_enabled' : 'button_animation_disabled'}`}>
                            <div className="w-52" id="show_comments_wrapper">
                                <YellowButton title="Show Comments" onClick={() => toggleAnimation()} />          
                            </div>
                        </div>
                    : null}
                </div>
            }
        </SearchLayout>
    )
}
