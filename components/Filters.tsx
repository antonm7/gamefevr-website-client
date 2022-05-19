import { genres, parentConsoles } from "../lib/staticData";
import { ElementDescription } from "../types";
import SelectBox from "./common/SelectBox";
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useStore } from "../store";

export default function Filters() {
    const [yearRange, changeYearRange] = useState<number[]>([1900, 2020]);
    const [selectedGenres, changeSelectedGenres] = useState<number[]>([]);
    const [selectedConsoles, changeSelectedConsoles] = useState<number[]>([]);
    const store = useStore()
    
    const updateGenres = (index:number):void => {
        if(selectedGenres.includes(index)) {
            //removes
            changeSelectedGenres(selectedGenres.filter(genre => genre !== index))
        } else {
            //adds
            changeSelectedGenres([...selectedGenres, index])
        }
    }
    
    const updatedConsoles = (index:number):void => {
        if(selectedConsoles.includes(index)) {
            //removes
            changeSelectedConsoles(selectedConsoles.filter(i => i !== index))
        } else {
            //adds
            changeSelectedConsoles([...selectedConsoles, index])
        }
    }
    
    
    return (
        <div className="fixed z-50 rounded-lg p-6 w-4/6 h-5/6 bg-filtersBg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <FontAwesomeIcon icon={faXmark} className="h-8 float-right cursor-pointer" onClick={() => store.changeFilterVisibility(false)}/>
            <h1 className="text-3xl truncate font-semibold text-center">Genres</h1>
            <div className="bg-white p-4 w-5/6 mt-6 mx-auto">
                <div className="flex h-auto items-center justify-center flex-row flex-wrap">
                    {genres.map((genre:ElementDescription, index:number) => {
                        return <SelectBox isSelected={selectedGenres.includes(index)} onClick={() => updateGenres(index)} key={index} title={genre.name} />
                    })}
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="flex justify-between w-5/6 flex-wrap">
                    <div>
                        <h1 className="text-3xl truncate font-semibold text-center py-6">Game Publisher</h1>
                        <input className="w-full h-16 px-6 outline-none" placeholder="write publisher name..." style={{width:'30rem'}} ></input>
                    </div>
                    <div>
                        <h1 className="text-3xl truncate font-semibold text-center py-6">Release Date</h1>
                        <div className="bg-white h-60 flex flex-col items-center justify-center" style={{width:'30rem'}}>
                            <div style={{width:'23rem'}} className="flex flex-row justify-between pb-8">
                                <div className="w-16 h-10 border flex items-center justify-center rounded-lg">
                                    <p>{yearRange[0]}</p>
                                </div>
                                <div className="w-16 h-10 border flex items-center justify-center rounded-lg">
                                    <p>{yearRange[1]}</p>
                                </div>
                            </div>
                            <Range
                                style={{width:'90%'}}
                                min={1990}
                                max={2022}
                                value={yearRange}
                                onChange={changeYearRange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}