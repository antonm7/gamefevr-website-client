import { genres } from "../lib/staticData";
import { ElementDescription } from "../types";
import SelectBox from "./common/SelectBox";
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useState } from "react";

export default function Filters() {
    const [yearRange, changeYearRange] = useState<number[]>([1900, 2020]);

    return (
        <div className="fixed z-50 rounded-lg p-6 w-4/6 h-5/6 bg-filtersBg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-3xl truncate font-semibold text-center">Genres</h1>
            <div className="bg-white p-4 w-2/3 mt-6 mx-auto">
                <div className="flex h-auto items-center justify-center flex-row flex-wrap">
                    {genres.map((genre:ElementDescription, index:number) => {
                        return <SelectBox key={index} title={genre.name} />
                    })}
                </div>
            </div>
            <div className="flex flex-col items-center">
                <h1 className="text-3xl truncate font-semibold text-center p-6">Release Date</h1>
                <div className="bg-white h-60 flex flex-col items-center justify-center" style={{width:'30rem'}}>
                    <div style={{width:'24rem'}} className="flex flex-row justify-between pb-8">
                        <div className="w-16 h-10 border flex items-center justify-center rounded-lg">
                            <p>{yearRange[0]}</p>
                        </div>
                        <div className="w-16 h-10 border flex items-center justify-center rounded-lg">
                            <p>{yearRange[1]}</p>
                        </div>
                    </div>
                    <Range
                        style={{width:'80%'}}
                        min={1990}
                        max={2022}
                        value={yearRange}
                        onChange={changeYearRange}
                    />
                </div>
            </div>
        </div>
    )
}