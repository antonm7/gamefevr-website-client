import { useEffect, useState } from "react";
import { genres } from "../../lib/staticData";
import SelectBox from "../common/SelectBox";
import styles from './index.module.scss';

type Props = {
    updateSelectedGenres: (value: number[]) => void
}

export default function Genres({ updateSelectedGenres }: Props) {
    const [selectedGenres, changeSelectedGenres] = useState<number[]>([])

    const updateGenres = (index: number): void => {
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
        <div className={`${styles.container_padding} filters-column-shadow rounded-md flex flex-wrap justify-center bg-white px-20 py-12 h-auto w-full max-w-full`}>
            {genres.map(e => <SelectBox isSelected={selectedGenres.includes(parseInt(e.id))}
                onClick={() => updateGenres(parseInt(e.id))}
                key={e.id}
                title={e.name} />)}
        </div>
    )
}