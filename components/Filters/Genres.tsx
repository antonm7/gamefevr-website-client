import { memo, useEffect, useMemo } from "react"
import { genres } from "../../lib/staticData"
import { ElementDescription } from "../../types"
import SelectBox from "../common/SelectBox"

interface Props {
    selectedGenres: string[]
    updateGenres: (id: string) => void
}

export default function Genres({ selectedGenres, updateGenres }: Props) {
    return (
        <div className="flex h-auto items-center justify-center flex-row flex-wrap">
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
}