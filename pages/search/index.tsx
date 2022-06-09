import SearchLayout from "../../components/layout/SearchLayout";
import SmallGameBox from "../../components/SmallGameBox";
import SearchButton from "../../components/common/SearchButton"
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useStore } from "../../store";
import Filters from "../../components/Filters";
import SmallLoader from '../../components/common/SmallLoader'

export default function Index(props:any) {
  const [loading, setLoading] = useState<boolean>(false)
  const [games, setGames] = useState<any[]>([])
  const [page, setPage] = useState<number>(1)
  const router = useRouter()
  const store = useStore()

  const loadGames = async (cur:number) => {
    try {
      setLoading(true)
      const getData = await axios.post('/api/query/search', {
        page:cur,
        query:router.query
      })
      setPage(v => v += 1)
      setGames(v => [...v,...getData.data.games])
      setLoading(false)
    } catch (e) {
      console.log('ERROR',e)
    }
  }

  useEffect(() => {
    if(!router.isReady && games.length === 0) return;
    setLoading(true)
    setPage(1)
    setGames([])
    loadGames(1)
  },[router.query,router.isReady])

  return (
      <SearchLayout>
        {store.isFilterOn ? <Filters /> : null}
        {
          !games.length ? <SmallLoader big={true} screenCentered={true}/>
          :
          <div className="py-10">
            <div className="flex flex-wrap justify-center">
              {games.map((game:any,index:number) => <SmallGameBox key={index} game={game}/>)}
            </div>
            <div className='w-24 h-16 rounded-lg m-auto mt-8'>
              {loading ? <SmallLoader big={false} xCentered={true}/> : <SearchButton text="Load More" onClick={() => loadGames(page)}/>}
            </div>
          </div>
        }
      </SearchLayout>
    )
}
