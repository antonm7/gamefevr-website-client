import { useState, useMemo } from 'react'
import { genres } from '../../lib/staticData'
import { ElementDescription } from '../../types'
import FilterBox from './FilterBox'

interface ElementExtends extends ElementDescription {
  type?: string
}

export default function FiltersRow({ genres, platforms }: any) {
  const [selectedYears, setSelectedYears] = useState<string[]>([])
  const [selected, setSelected] = useState<ElementExtends[]>([])

  const updatedSelected = (name: string, wholeObj: ElementExtends) => {
    if (selected.map((s) => s.name).includes(name)) {
      setSelected([...selected.filter((s) => s.name !== name)])
    } else {
      setSelected((s) => [...s, wholeObj])
    }
  }

  function shuffleMethod(array: ElementDescription[]) {
    console.log('running')
    let currentIndex = array.length,
      randomIndex

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      ;[array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ]
    }

    return array
  }

  const memo = useMemo(
    () => shuffleMethod([...genres, ...platforms]),
    [genres, platforms]
  )

  return (
    <div className="flex flex-wrap pt-4 ">
      {memo.map((a) => (
        <FilterBox
          name={a.name}
          key={a.name}
          onClick={() => updatedSelected(a.name, a)}
          isSelected={selected.includes(a)}
        />
      ))}
      <FilterBox
        name="New Games"
        onClick={() =>
          selectedYears.includes('new_games')
            ? setSelectedYears(selectedYears.filter((y) => y !== 'new_games'))
            : setSelectedYears([...selectedYears, 'new_games'])
        }
        isSelected={selectedYears.includes('new_games')}
      />
    </div>
  )
}
