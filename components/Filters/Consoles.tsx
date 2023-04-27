import { useEffect, useState, useMemo } from "react";
import useWindowSize from "../../lib/functions/hooks/useWindowSize";
import { parentConsoles } from "../../lib/staticData";
import { ElementDescription } from "../../types";
import SelectBox from "../common/SelectBox";
import styles from './index.module.scss';
import { useFiltersStore } from "../../store";

type Props = {
    updateSelectedConsoles: (value: string[]) => void,
}

export default function Consoles({ updateSelectedConsoles }: Props) {
    const store = useFiltersStore(state => state)
    const [loadMore, setLoadMore] = useState<boolean>(false)
    const [selectedConsoles, changeSelectedConsoles] = useState<string[]>([])

    const updateConsoles = (index: string): void => {
        if (selectedConsoles.includes(index)) {
            //removes
            changeSelectedConsoles(selectedConsoles.
                filter((i) => i !== index))
        } else {
            //adds
            changeSelectedConsoles(old => [...old, index])
        }
    }

    useEffect(() => {
        updateSelectedConsoles(selectedConsoles)
    }, [selectedConsoles])

    useEffect(() => {
        changeSelectedConsoles(store.consoles)
    }, [store.consoles])

    const changeShowMore = (status: boolean): void => {
        if (status === false) {
            changeSelectedConsoles([])
        }
        setLoadMore(status)
    }

    const [width] = useWindowSize()

    if (width <= 900) {
        return (
            <div className={`${styles.container_padding} filters-column-shadow rounded-md bg-white py-12 h-auto w-full max-w-full`}>
                <div className="flex flex-col justify-center items-center">
                    {(loadMore ? parentConsoles : parentConsoles.slice(0, 5)).map(e => <SelectBox isSelected={selectedConsoles.includes(e.id)}
                        onClick={() => updateConsoles(e.id)}
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
            {parentConsoles.map(e => <SelectBox isSelected={selectedConsoles.includes(e.id)}
                onClick={() => updateConsoles(e.id)}
                key={e.id}
                title={e.name} />)}
        </div>
    )
}
