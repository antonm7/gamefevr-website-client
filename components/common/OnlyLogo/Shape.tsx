import { memo } from 'react'

interface Props {
    size?: 'sm' | 'lg' | 'xl'
}

const Shape: React.FC<Props> = ({ size }) => {
    return (
        <div
            className={`relative w-auto h-12  overflow-hidden ${size === 'xl' ? 'ml-[6.5rem] mt-6' : size === 'lg' ? 'ml-14 mt-6' : ''
                }`}
            style={{
                transform:
                    size == 'sm' ? 'scale(1)' : size === 'lg' ? 'scale(1.4)' : 'scale(2)',
            }}
        >
            <div
                className="absolute w-4 bg-darkIndigo rounded-xl z-30"
                style={{
                    height: '0.2rem',
                    transform: 'rotate(-60deg)',
                    top: '11px',
                    left: '0px',
                }}
            ></div>
            <div
                className="w-full h-full"
                style={{ position: 'absolute', left: '7px' }}
            >
                <div
                    className="absolute w-4 bg-darkIndigo rounded-xl"
                    style={{
                        height: '0.2rem',
                        transform: 'rotate(-60deg)',
                        top: '6px',
                        left: '2px',
                    }}
                ></div>
                {/* top triangle */}
                <div
                    id="triangle"
                    className="bg-white w-2 h-2 absolute z-20"
                    style={{
                        transform: 'rotate(-90deg)',
                        left: '1.45px',
                        top: '8.9px',
                        width: '0.4rem',
                        height: '0.4rem',
                    }}
                ></div>
                {/* bottom triangle */}
                <div
                    id="triangle"
                    className="bg-white w-2 h-2 absolute z-20"
                    style={{
                        transform: 'rotate(90deg)',
                        left: '6.5px',
                        top: '14.6px',
                        width: '0.46rem',
                        height: '0.4rem',
                    }}
                ></div>
                {/* bottom shape */}
                <div
                    className="absolute w-4 bg-darkIndigo rounded-xl"
                    style={{
                        height: '0.2rem',
                        transform: 'rotate(-60deg)',
                        left: '-3.2px',
                        top: '21px',
                    }}
                ></div>
            </div>
            <div
                className="absolute w-4 bg-specialYellow rounded-xl z-30"
                style={{
                    height: '0.2rem',
                    transform: 'rotate(-60deg)',
                    top: '18px',
                    left: '12px',
                }}
            ></div>
        </div>
    )
}

export default memo(Shape)
