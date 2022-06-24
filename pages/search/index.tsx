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
  const router = useRouter()
  const store = useStore()

  const loadGames = async (cur:number) => {
    try {
      setLoading(true)
      const getData = await axios.post('/api/query/search', {
        page:cur,
        query:router.query
      })
      store.addPage()
      store.addGames(getData.data.games)
      setLoading(false)
    } catch (e) {
      console.log('ERROR',e)
    }
  }

  useEffect(() => {
    if(!router.isReady) return;
    if(store.games.length === 0) {
      setLoading(true)
      store.clearPage()
      store.clearGames()
      loadGames(1)
    }
  },[router.query,router.isReady])

  return (
      <SearchLayout>
        {store.isFilterOn ? <Filters /> : null}
        {
          !store.games.length ? <SmallLoader big={true} screenCentered={true}/>
          :
          <div className="py-10">
            <div className="flex flex-wrap justify-center">
              {store.games.map((game:any,index:number) => <SmallGameBox key={index} game={game}/>)}
            </div>
            <div className='w-24 h-16 rounded-lg m-auto mt-8'>
              {loading ? <SmallLoader big={false} xCentered={true}/> : <SearchButton text="Load More" onClick={() => loadGames(store.page)}/>}
            </div>
          </div>
        }
      </SearchLayout>
    )
}
