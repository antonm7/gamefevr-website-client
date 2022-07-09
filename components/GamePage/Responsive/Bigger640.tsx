import { DetailedGame, ElementDescription, Platform } from "../../../types";
import RateGame from "../RateGame";
import Image from "next/image";
import AddFavorite from "../AddFavorite";

interface Props {
    game: DetailedGame;
    changeIsUserRated: (value: string) => void;
}

export default function Bigger640({game, changeIsUserRated}:Props){
    return (
        <div id="game_page_header" className="flex flex-row justify-between">
            <div className="pr-16">
                <h3 className="text-white font-normal text-1xl opacity-40"> {game?.released?.slice(0,4)}</h3>
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
                    <div className="w-8 h-8 rounded-sm flex items-center justify-center cursor-pointer mr-4" style={{backgroundColor:'#38b6cc'}}>
                        <Image  id="brand" src={"/icons/facebook.svg"} height={14} width={14}/>
                    </div>
                    <AddFavorite gameId={game.id}/>
                </div>
            </div>
            <div id="game_page_background_image_wrapper" className="flex flex-col items-center" style={{minWidth:'24rem'}}>
                <div id="game_page_background_image" className="h-60 w-96 bg-cover rounded-xl bg-center bg-no-repeat" style={{height:'19rem',backgroundImage: `url(${game.background_image})`}} />
                <RateGame updateIsUserRated={(value:string) => changeIsUserRated(value)}/>                                </div>
        </div> 
    )
}