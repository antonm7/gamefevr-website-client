import { parentConsoles } from "../../lib/staticData"
import { ElementDescription } from "../../types"
import SelectBox from "../common/SelectBox"

interface Props {
    selectedConsoles: string[]
    updateConsoles: (id: string) => void
}
export default function Consoles({ selectedConsoles, updateConsoles }: Props) {
    return (
        <div className="flex h-auto items-center justify-center flex-row flex-wrap ">
            {parentConsoles.map(
                (console: ElementDescription, index: number) => (
                    <SelectBox
                        isSelected={selectedConsoles.includes(
                            JSON.stringify(console.id)
                        )}
                        coolBlue={true}
                        onClick={() =>
                            updateConsoles(JSON.stringify(console.id))
                        }
                        key={JSON.stringify(index)}
                        title={console.name}
                    />
                )
            )}
        </div>
    )
}