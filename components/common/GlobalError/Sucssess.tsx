import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import TimerBar from "../TimerBar"

interface Props {
    visibility: boolean
    text: string
}

export default function Sucssess({ visibility, text }: Props) {
    if (!visibility) return null

    return (
        <div
            id="global_error"
            className={`${visibility ? 'global_animation_enabled' : 'global_animation_disabled'
                } fixed flex z-50 w-96 h-20 pl-4 rounded-lg rounded-r-none`}
            style={{ backgroundColor: '#faeeeb' }}
        >
            <div className="flex w-full items-center">
                <div className="flex items-center nowrap whitespace-nowrap w-full">
                    <div
                        className="rounded-full flex items-center justify-center mr-4 nowrap whitespace-nowrap"
                        style={{
                            height: '2.2rem',
                            width: '2.2rem',
                            backgroundColor: '#50c878',
                        }}
                    >
                        <div
                            style={{
                                height: '1.7rem',
                                width: '1.7rem',
                                backgroundColor: 'white',
                            }}
                            className="rounded-full flex items-center justify-center nowrap whitespace-nowrap"
                        >
                            <FontAwesomeIcon
                                style={{ color: '#50c878' }}
                                className="h-5"
                                icon={faCheck}
                            />
                        </div>
                    </div>
                    <div>
                        <p className=" text-lg font- leading-6" style={{ color: 'black' }}>
                            {text ? 'Nice!' : 'Completed!'}
                        </p>
                        <p
                            className="text-white text-md font-medium "
                            style={{ color: '#645f5d' }}
                        >
                            {text ? text : 'completed'}
                        </p>
                    </div>
                </div>
                <FontAwesomeIcon
                    style={{ color: 'gray' }}
                    className="h-5 mr-4 opacity-60 cursor-pointer hover:opacity-90"
                    icon={faXmark}
                />
            </div>
            <TimerBar start={visibility} color="#50c878" />
        </div>
    )
}