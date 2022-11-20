import { memo } from 'react'

interface Props {
  stores: {
    id: number
    store: {
      domain: string
      games_count: number
      id: number
      image_background: string
      name: string
      slug: string
    }
    url: string
  }[]
}

const WhereToBuy: React.FC<Props> = ({ stores }) => {
  const navigate = (url: string) => (document.location.href = `https://${url}`)

  if (!stores.length) return null

  return (
    <div id="where_to_buy" className="flex flex-wrap mr-4">
      {stores.map((store) => (
        <div onClick={() => navigate(store.store.domain)} key={store.id}>
          <h2
            id="game_page_detail"
            className="text-white underline font-normal text-1xl opacity-70 pt-2 mr-3 cursor-pointer whitespace-nowrap inline-block"
          >
            {store.store.name}
          </h2>
        </div>
      ))}
    </div>
  )
}

export default memo(WhereToBuy)
