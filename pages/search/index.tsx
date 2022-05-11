import { GetServerSideProps } from "next";
import SearchLayout from "../../components/layout/SearchLayout";
import SmallGameBox from "../../components/SmallGameBox";
import SearchButton from "../../components/common/SearchButton"
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useStore } from "../../store";

export default function Index(props:any) {
  // const [games,setGames] = useState<any[]>([])
  const [page,setPage] = useState<number>(1)
  const router = useRouter()
  const store = useStore()

  const loadGames = async (page:number) => {
    try {
      const getData = await axios.post('/api/query/search', {
        page,
        query:router.query
      })
      return getData.data.games
      // setGames(old => [...old, ...getData.data.games])
    } catch (e) {
      console.log('ERROR',e)
    }
  }

  useEffect(() => {
    Promise.resolve(loadGames(page)).then(games => {
      store.addGames(games)
    })
  },[page])

  // const loadMore = async () => {
  //   const getData = await fetch(`https://api.rawg.io/api/games?key=e996863ffbd04374ac0586ec2bcadd55&page=${page}&page_size=20`)
  //   let data = await getData.json()
  //   setGames((old:any[]) => [...old, ...data.results])
  //   setPage(page => page += 1)
  // }

  return (
      <SearchLayout>
        {
          !store.games.length ? <div>Loading...</div> :
          <div>
            <div className="flex flex-wrap justify-center">
              {store.games.map((game:any,index:number) => <SmallGameBox key={index} game={game}/>)}
            </div>
            <div className='w-24 h-16 rounded-lg m-auto mb-8'>
              <SearchButton text="Load More" onClick={() => setPage((before:number) => before += 1)}/>
            </div>
          </div>
        }
      </SearchLayout>
    )
}