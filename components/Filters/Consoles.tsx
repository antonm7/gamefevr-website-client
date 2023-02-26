import { useEffect, useState, useMemo } from "react";
import useWindowSize from "../../lib/functions/hooks/useWindowSize";
import { parentConsoles } from "../../lib/staticData";
import { ElementDescription } from "../../types";
import SelectBox from "../common/SelectBox";
import styles from './index.module.scss';

type Props = {
    updateSelectedConsoles: (value: number[]) => void
}

export default function Consoles({ updateSelectedConsoles }: Props) {
    const [selectedConsoles, changeSelectedConsoles] = useState<number[]>([])
    const [loadMore, setLoadMore] = useState<boolean>(false)

    const updateConsoles = (index: number): void => {
        if (selectedConsoles.includes(index)) {
            //removes
            changeSelectedConsoles(selectedConsoles.filter((i) => i !== index))
        } else {
            //adds
            changeSelectedConsoles(old => [...old, index])
        }
    }

    useEffect(() => {
        updateSelectedConsoles(selectedConsoles)
    }, [selectedConsoles])

    const [width] = useWindowSize()

    if (width <= 900) {
        return (
            <div className={`${styles.container_padding} filters-column-shadow rounded-md bg-white py-12 h-auto w-full max-w-full`}>
                <div className="flex flex-col justify-center items-center">
                    {(loadMore ? parentConsoles : parentConsoles.slice(0, 5)).map(e => <SelectBox isSelected={selectedConsoles.includes(parseInt(e.id))}
                        onClick={() => updateConsoles(parseInt(e.id))}
                        key={e.id}
                        title={e.name} />)}
                    <button
                        onClick={() => (loadMore ? setLoadMore(false) : setLoadMore(true))}
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
            {parentConsoles.map(e => <SelectBox isSelected={selectedConsoles.includes(parseInt(e.id))}
                onClick={() => updateConsoles(parseInt(e.id))}
                key={e.id}
                title={e.name} />)}
        </div>
    )
}
