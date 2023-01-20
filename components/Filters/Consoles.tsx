import { useEffect, useState } from "react";
import { parentConsoles } from "../../lib/staticData";
import SelectBox from "../common/SelectBox";
import styles from './index.module.scss';

type Props = {
    updateSelectedConsoles: (value: string[]) => void
}

export default function Consoles({ updateSelectedConsoles }: Props) {
    const [selectedConsoles, changeSelectedConsoles] = useState<string[]>([])

    const updateConsoles = (index: string): void => {
        if (selectedConsoles.includes(index)) {
            //removes
            changeSelectedConsoles(selectedConsoles.filter((i) => i !== index))
        } else {
            //adds
            changeSelectedConsoles((old) => [...old, index])
        }
    }

    useEffect(() => {
        updateSelectedConsoles(selectedConsoles)
    }, [selectedConsoles])

    return (
        <div className={`${styles.container_padding} filters-column-shadow rounded-md flex flex-wrap justify-center bg-white px-20 py-12 h-auto w-full max-w-full`}>
            {parentConsoles.map(e => <SelectBox isSelected={selectedConsoles.includes(e.id)}
                onClick={() => updateConsoles(e.id)}
                key={e.id}
                title={e.name} />)}
        </div>
    )
}