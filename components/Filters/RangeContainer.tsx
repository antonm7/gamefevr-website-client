import { Range } from 'rc-slider'
import 'rc-slider/assets/index.css'
import { useEffect, useState } from 'react'

type Props = {
    updateYearRange: (val: number[]) => void
}

export default function RangeContainer({ updateYearRange }: Props) {
    const [yearRange, setYearRange] = useState<number[]>([1990, 2023])

    useEffect(() => {
        updateYearRange(yearRange)
    }, [yearRange])

    return (
        <div className="bg-white h-52 flex flex-col items-center justify-center rounded-md filters-column-shadow ">
            <div className="flex flex-row justify-between pb-8 w-5/6">
                <div
                    className="w-16 h-10 border flex items-center justify-center rounded-lg"
                    style={{ border: '1px solid #c9c9c9' }}
                >
                    <p className="text-black text-sm" style={{ paddingTop: 1 }}>
                        {yearRange[0]}
                    </p>
                </div>
                <div
                    className="w-16 h-10 border flex items-center justify-center rounded-lg"
                    style={{ border: '1px solid #c9c9c9' }}
                >
                    <p className="text-black text-sm" style={{ paddingTop: 1 }}>
                        {yearRange[1]}
                    </p>
                </div>
            </div>
            <Range
                trackStyle={[{ backgroundColor: '#dd5054' }]}
                activeDotStyle={{
                    backgroundColor: '#dd5054 ',
                    outline: 'none',
                }}
                handleStyle={[
                    {
                        backgroundColor: 'white',
                        borderColor: '#dd5054',
                        outline: 'none',
                    },
                    { backgroundColor: 'white', borderColor: '#dd5054' },
                ]}
                style={{ width: '83%', paddingTop: '1rem', marginTop: '-1rem', height: '2rem' }}
                min={1990}
                max={2023}
                value={yearRange}
                onChange={setYearRange}
            />
        </div>
    )
}