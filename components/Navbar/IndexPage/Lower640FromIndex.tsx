import { useStore } from "../../../store"
import Image from "next/image"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

export default function Lower640() {
    const changeMenuVisibility = useStore((store) =>
        store.changeMenuVisibility)

    return (
        <div className="relative overflow-hidden w-full pt-4 px-8" style={{ zIndex: '50' }}>
            <div className="flex items-center justify-between">
                <div style={{ marginTop: 7 }}>
                    <Image
                        src={'/images/gameFevr.svg'}
                        height={32}
                        width={130}
                        alt="Logo"
                    />
                </div>
                <FontAwesomeIcon
                    onClick={() => changeMenuVisibility(true)}
                    icon={faBars}
                    className="h-5 text-white cursor-pointer "
                />
            </div>
        </div>
    )
}