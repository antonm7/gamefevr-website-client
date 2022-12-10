import { SpinnerCircular } from "spinners-react";
import { memo } from 'react'

const Spinner: React.FC = () => {
    return (
        <SpinnerCircular
            className="mx-auto"
            size={16}
            thickness={117}
            speed={85}
            color="#0c203a"
        />
    )
}

export default memo(Spinner)