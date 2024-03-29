import { useStore } from "../../../store"
import Image from "next/image"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from "@fortawesome/fontawesome-svg-core"

export default function Lower640() {
    const changeMenuVisibility = useStore((store) =>
        store.changeMenuVisibility)

    return (
        <div className="relative overflow-hidden w-full pt-4 px-8" style={{ zIndex: '50' }}>
            <div className="flex items-center justify-between">
                <div style={{ marginTop: 7 }}>
                    <Image
                        src={'/images/logo-dark.webp'}
                        height={32}
                        width={130}
                        alt="Logo"
                    />
                </div>
                <FontAwesomeIcon
                    onClick={() => changeMenuVisibility(true)}
                    icon={faBars as IconProp}
                    className="h-5 text-white cursor-pointer "
                />
            </div>
        </div>
    )
}