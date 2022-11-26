import React from 'react'
import useWindowSize from '../../lib/functions/hooks/useWindowSize'
import Ball from './Seperate/Ball'
import Warrior from './Seperate/Warrior'

const ResponsiveAnimations = React.memo(() => {
    const [width, height] = useWindowSize()
    return (
        <div style={{ bottom: '-2rem' }} className={`${height > 680 ? 'absolute' : 'relative'} h-80 w-full overflow-hidden`}>
            <Ball />
            <Warrior />
        </div>
    )
})
export default ResponsiveAnimations
