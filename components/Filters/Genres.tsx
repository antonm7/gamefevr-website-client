import { useEffect, useState } from "react"
import useWindowSize from "../../lib/functions/hooks/useWindowSize"
import { genres } from "../../lib/staticData"
import { ElementDescription } from "../../types"
import SelectBox from "../common/SelectBox"

interface Props {
    selectedGenres: string[]
    updateGenres: (id: string) => void
}

interface ShowMoreProps extends Props {
    changeVisibility: () => void
}

const ShowMore = ({ selectedGenres, updateGenres, changeVisibility }: ShowMoreProps) => {
    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {genres.map((genre: ElementDescription, index: number) => {
                    return (
                        <SelectBox
                            isSelected={selectedGenres.includes(JSON.stringify(genre.id))}
                            onClick={() => updateGenres(JSON.stringify(genre.id))}
                            key={index}
                            title={genre.name}
                        />
                    )
                })
                }
                <button onClick={changeVisibility}>Show Less</button>
            </div>
        </div>
    )
}




export default function Genres({ selectedGenres, updateGenres }: Props) {
    const [width] = useWindowSize()
    const [first, setFirst] = useState<ElementDescription[]>([])
    const [showMore, setShowMore] = useState<boolean>(false)

    useEffect(() => {
        const f = genres.slice(0, 4)
        setFirst(f)
    }, [])

    if (width > 640) {
        return (
            <div className="flex h-auto items-center justify-center flex-row flex-wrap filters-category-flex">
                {genres.map((genre: ElementDescription, index: number) => {
                    return (
                        <SelectBox
                            isSelected={selectedGenres.includes(JSON.stringify(genre.id))}
                            onClick={() => updateGenres(JSON.stringify(genre.id))}
                            key={index}
                            title={genre.name}
                        />
                    )
                })}
            </div>
        )
    } else {

        if (!showMore) {
            return (
                <div className="flex h-auto items-center justify-center flex-row flex-wrap filters-category-flex">
                    {first.map((genre: ElementDescription, index: number) => {
                        return (
                            <SelectBox
                                isSelected={selectedGenres.includes(JSON.stringify(genre.id))}
                                onClick={() => updateGenres(JSON.stringify(genre.id))}
                                key={index}
                                title={genre.name}
                            />
                        )
                    })}
                    <button onClick={() => setShowMore(true)}>Show More</button>
                </div>
            )
        } else {
            return <ShowMore selectedGenres={selectedGenres} updateGenres={updateGenres} changeVisibility={() => setShowMore(false)} />
        }
    }

}