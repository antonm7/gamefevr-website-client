import { useState } from "react"
import { wretchAction } from "../../../lib/functions/fetchLogic"
import SmallLoader from "../../common/SmallLoader"
import YellowButton from "../../common/YellowButton"
import StyledInput from "../StyledInput"

interface Props {
    goBack: () => void
}

const validateEmail = (email: string): boolean => {
    const re =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}

export default function ForgotPassword({ goBack }: Props) {
    const [loading, setLoading] = useState<boolean>(false)
    const [emailForgot, setEmailForgot] = useState<string>('')
    const [forgotError, setForgotError] = useState<string>('')
    const [startedSending, setStartSending] = useState<boolean>(false)

    const sendForgotPasswordEmail = async (): Promise<void> => {
        if (!validateEmail(emailForgot)) {
            setForgotError('Please Enter A Valid Email')
        } else {
            try {
                await wretchAction(
                    '/api/user/settings/sendForgotPasswordEmail',
                    {
                        email: emailForgot
                    }
                )
                setForgotError('')
                setStartSending(true)
                setTimeout(() => { setStartSending(false) }, 1500)
            } catch (e) {
                setForgotError('Unexpected Error, try again')
                setLoading(false)
            }
        }
    }

    return (
        <>
            <StyledInput
                title="Email"
                placeholder="Enter your email"
                type="email"
                onChange={(e) => setEmailForgot(e.target.value)}
            />
            <div className="pt-6">
                {loading ? (
                    <SmallLoader xCentered={true} />
                ) : startedSending ? (
                    <YellowButton
                        onClick={() => null}
                        complete={true}
                        title="Check Your Email"
                        completeTitle='Check Your Email'
                    />
                ) : (
                    <YellowButton
                        onClick={() => sendForgotPasswordEmail()}
                        complete={false}
                        title="Send Email"
                    />
                )}
            </div>
            <p
                style={{ color: '#38b6cc' }}
                className="inline-block cursor-pointer pl-1 font-semibold text-base pt-2"
                onClick={goBack}
            >
                back to login
            </p>
            <p className="text-xl pt-2 font-semibold text-red-600">
                {forgotError}
            </p>
        </>
    )
}