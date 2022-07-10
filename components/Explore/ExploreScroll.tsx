import { useEffect,useState } from "react"
import { useScrollDirection } from 'react-use-scroll-direction'
import { ShortGame } from "../../types"
import GameBox from "./GameBox"

export default function ExploreScroll(props:any) {

    const listen = (e:any) => {
        if(e < 0) {
            console.log('ree')
            const event = new KeyboardEvent("keydown", {
                keyCode: 116,
              } as KeyboardEventInit);
                document.dispatchEvent(event);
                document.dispatchEvent(event);
                document.dispatchEvent(event);
                document.dispatchEvent(event);
                document.dispatchEvent(event); 
        }
    }
    
    const scroll = (e:any) => {
        listen(e.nativeEvent.wheelDelta)
        // if (e.nativeEvent.wheelDelta > 0) {
        //     // console.log('scroll up');
        //     e.preventDefault();

        //   } else {
        //     listen()
        //     console.log('scroll down');
        //   }
    }

    return (
        <div id="explore_container" onWheel={(e:any) => scroll(e)}>
            {props?.games.map((game:ShortGame,index:number) =>  (
                <div className="h-full bg-red-200">
                    <GameBox game={game} key={index} />
                </div>
            ))}
        </div>
    )
}
