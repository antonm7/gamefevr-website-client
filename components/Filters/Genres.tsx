import { useEffect, useState } from "react";
import useWindowSize from "../../lib/functions/hooks/useWindowSize";
import { genres } from "../../lib/staticData";
import SelectBox from "../common/SelectBox";
import styles from './index.module.scss';
import { useFiltersStore } from "../../store";

type Props = {
    updateSelectedGenres: (value: string[]) => void
}

export default function Genres({ updateSelectedGenres }: Props) {
    const store = useFiltersStore(state => state)
    const [selectedGenres, changeSelectedGenres] = useState<string[]>([])
    const [loadMore, setLoadMore] = useState<boolean>(false)

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
        changeSelectedGenres(store.genres)
    }, [store.genres])

    useEffect(() => {
        updateSelectedGenres(selectedGenres)
    }, [selectedGenres])

    const [width] = useWindowSize()

    const changeShowMore = (status: boolean): void => {
        if (status === false) {
            changeSelectedGenres([])
        }
        setLoadMore(status)
    }

    if (width <= 900) {
        return (
            <div className={`${styles.container_padding} filters-column-shadow rounded-md bg-white py-12 h-auto w-full max-w-full`}>
                <div className="flex flex-col justify-center items-center">
                    {(loadMore ? genres : genres.slice(0, 5)).map(e => <SelectBox isSelected={selectedGenres.includes(e.id)}
                        onClick={() => updateGenres(e.id)}
                        key={e.id}
                        title={e.name} />)}
                    <button
                        onClick={() => (loadMore ? changeShowMore(false) : changeShowMore(true))}
                        className={`w-fit h-10 m-2 overflow-hidden border border-lighterBg px-6 flex flex-row items-center justify-center rounded-xl`}
                    >
                        <p
                            className={`text-text-gray
                         text-base whitespace-nowrap font-extralight`}
                        >
                            {loadMore ? 'Show Less' : 'Show More'}
                        </p>
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={`${styles.container_padding} filters-column-shadow rounded-md flex flex-wrap justify-center bg-white px-20 py-12 h-auto w-full max-w-full`}>
            {genres.map(e => <SelectBox isSelected={selectedGenres.includes(e.id)}
                onClick={() => updateGenres(e.id)}
                key={e.id}
                title={e.name} />)}
        </div>
    )
}