import { memo } from 'react'
interface Props {
  desc: string
}

const Description: React.FC<Props> = ({ desc }) => {
  return (
    <div
      id="game_page_description_wrapper"
      className="max-w-2xl leading-8 text-base py-20 text-white font-light"
      dangerouslySetInnerHTML={{
        __html: desc,
      }}
    />
  )
}

export default memo(Description)
