import { ElementDescription } from '../../types'

interface Props {
  tags: ElementDescription[]
}

export default function Tags({ tags }: Props) {
  return (
    <div className="flex flex-row flex-wrap pt-2 max-w-lg">
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
