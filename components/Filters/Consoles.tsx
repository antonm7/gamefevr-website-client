import { useState, useEffect } from "react"
import useWindowSize from "../../lib/functions/hooks/useWindowSize"
import { parentConsoles } from "../../lib/staticData"
import { ElementDescription } from "../../types"
import SelectBox from "../common/SelectBox"

interface Props {
    selectedConsoles: string[]
    updateConsoles: (id: string) => void
}

interface ShowMoreProps extends Props {
    changeVisibility: () => void
}

const ShowMore = ({ selectedConsoles, updateConsoles, changeVisibility }: ShowMoreProps) => {
    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {parentConsoles.map((genre: ElementDescription, index: number) => {
                    return (
                        <SelectBox
                            isSelected={selectedConsoles.includes(JSON.stringify(genre.id))}
                            onClick={() => updateConsoles(JSON.stringify(genre.id))}
                            key={index}
                            title={genre.name}
                            coolBlue={true}
                        />
                    )
                })
                }
                <button onClick={changeVisibility} className="show-text">Show Less</button>
            </div>
        </div>
    )
}

export default function Consoles({ selectedConsoles, updateConsoles }: Props) {
    const [width] = useWindowSize()
    const [first, setFirst] = useState<ElementDescription[]>([])
    const [showMore, setShowMore] = useState<boolean>(false)

    useEffect(() => {
        const f = parentConsoles.slice(0, 4)
        setFirst(f)
    }, [])

    if (width > 640) {
        return (
            <div className="flex h-auto items-center justify-center flex-row flex-wrap filters-category-flex">
                {parentConsoles.map((genre: ElementDescription, index: number) => {
                    return (
                        <SelectBox
                            isSelected={selectedConsoles.includes(JSON.stringify(genre.id))}
                            onClick={() => updateConsoles(JSON.stringify(genre.id))}
                            key={index}
                            title={genre.name}
                            coolBlue={true}
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
                                isSelected={selectedConsoles.includes(JSON.stringify(genre.id))}
                                onClick={() => updateConsoles(JSON.stringify(genre.id))}
                                key={index}
                                title={genre.name}
                                coolBlue={true}
                            />
                        )
                    })}
                    <button onClick={() => setShowMore(true)} className="show-text">Show More</button>
                </div>
            )
        } else {
            return <ShowMore selectedConsoles={selectedConsoles} updateConsoles={updateConsoles} changeVisibility={() => setShowMore(false)} />
        }
    }
}