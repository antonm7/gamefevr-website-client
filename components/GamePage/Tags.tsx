import { memo } from 'react'
import { ElementDescription } from '../../types'

interface Props {
  tags: ElementDescription[]
}

const Tags: React.FC<Props> = ({ tags }) => {
  if (tags.length === 0) return null
  return (
    <div className="flex flex-row flex-wrap pt-2 max-w-lg pr-12">
      <h2 className="text-white font-normal text-1xl opacity-70">Tags:</h2>
      {tags.map((tag: ElementDescription, index: number) => (
        <h2
          key={index}
          className="px-1 pb-1 text-white font-semibold text-1xl opacity-60"
        >
          {tag.name}
          {index !== tags.length - 1 ? ',' : ''}
        </h2>
      ))}
    </div>
  )
}

export default memo(Tags)
