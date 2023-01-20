import { useEffect, useState } from "react";
import { genres } from "../../lib/staticData";
import SelectBox from "../common/SelectBox";

type Props = {
    updateSelectedGenres: (value: string[]) => void
}

export default function Genres({ updateSelectedGenres }: Props) {
    const [selectedGenres, changeSelectedGenres] = useState<string[]>([])

    const updateGenres = (index: string): void => {
        if (selectedGenres.includes(index)) {
            //removes
            changeSelectedGenres(selectedGenres.filter((genre) => genre !== index))
        } else {
            //adds
            changeSelectedGenres([...selectedGenres, index])
        }
    }

    useEffect(() => {
        updateSelectedGenres(selectedGenres)
    }, [selectedGenres])

    return (
        <div className='flex flex-wrap justify-center bg-white px-20 py-12 h-auto w-full max-w-full'>
            {genres.map(e => <SelectBox isSelected={selectedGenres.includes(e.id)}
                onClick={() => updateGenres(e.id)}
                key={e.id}
                title={e.name} />)}
        </div>
    )
}