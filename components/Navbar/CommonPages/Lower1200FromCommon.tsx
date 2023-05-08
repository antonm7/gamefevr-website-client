import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import SmallSearchInput from "../../common/SmallSearchInput"
import Image from "next/image"
import { useStore } from "../../../store"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

export default function Lower1200FromCommon() {
    const changeMenuVisibility = useStore((store) => store.changeMenuVisibility)

    return (
        <div className="h-full w-full flex flex-col pt-4 responsive_wrapper">
            <div className="flex items-center justify-between overflow-hidden h-11">
                <div style={{ marginTop: 7 }}>
                    <Image
                        src={'/images/gameFevr.png'}
                        height={32}
                        width={130}
                        alt="Logo"
                    />
                </div>
                <FontAwesomeIcon
                    onClick={() => changeMenuVisibility(true)}
                    icon={faBars as IconProp}
                    className="h-5 text-white cursor-pointer"
                />
            </div>
            <div className="pt-4">
                <SmallSearchInput full={true} />
            </div>
        </div>
    )
}