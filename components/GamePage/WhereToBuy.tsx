import Link from 'next/link'
import { Store } from '../../types'

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

export default function WhereToBuy({ stores }: Props) {
  const navigate = (url: string) => {
    document.location.href = `https://${url}`
  }

  if (!stores.length) return null

  return (
    <div className="flex ">
      <h2
        id="game_page_detail"
        className="text-white font-normal text-1xl opacity-70 pt-2"
      >
        Where To Buy:
      </h2>
      {stores.map((store) => (
        <div
          onClick={() => navigate(store.store.domain)}
          key={store.id}
          className=" inline-block"
        >
          <h2
            id="game_page_detail"
            className="text-white underline font-normal text-1xl opacity-70 pt-2 mx-2 cursor-pointer"
          >
            {store.store.name}
          </h2>
        </div>
      ))}
    </div>
  )
}
