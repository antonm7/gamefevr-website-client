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

  const loadGames = async (page:number) => {
    try {
      const getData = await axios.post('/api/query/search', {
        page,
        query:router.query
      })
      return getData.data.games
    } catch (e) {
      console.log('ERROR',e)
    }
  }

  useEffect(() => {
    setLoading(true)
    Promise.resolve(loadGames(store.page)).then(games => {
      store.addGames(games)
      setLoading(false)
    })
  },[store.page])


  return (
      <SearchLayout>
        {store.isFilterOn ? <Filters /> : null}
        {
          !store.games.length ? <SmallLoader big={true} screenCentered={true}/>
          :
          <div>
            <div className="flex flex-wrap justify-center">
              {store.games.map((game:any,index:number) => <SmallGameBox key={index} game={game}/>)}
            </div>
            <div className='w-24 h-16 rounded-lg m-auto mb-8'>
              {loading ? <SmallLoader big={false} xCentered={true}/> : <SearchButton text="Load More" onClick={() => store.changePage(store.page += 1)}/>}
            </div>
          </div>
        }
      </SearchLayout>
    )
}