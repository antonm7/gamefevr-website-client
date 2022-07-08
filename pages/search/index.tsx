import SearchLayout from "../../components/layout/SearchLayout";
import SmallGameBox from "../../components/SmallGameBox";
import SearchButton from "../../components/common/SearchButton"
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useStore } from "../../store";
import Filters from "../../components/Filters";
import SmallLoader from '../../components/common/SmallLoader'
import { ShortGame } from "../../types";

interface Props {
  games: ShortGame[];
}

export default function Index(props:Props) {
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

  // useEffect(() => {
  //   if(!router.isReady) return;
  //   if(store.games.length === 0) {
  //     setLoading(true)
  //     store.clearPage()
  //     store.clearGames()
  //     loadGames(1)
  //   }
  // },[router.query,router.isReady])

  useEffect(() => {
    if(store.games.length === 0) {
      store.addPage()
      store.addGames(props.games)
    }
  },[props])

  return (
      <SearchLayout>
        <div>
        {store.isFilterOn ? <Filters /> : null}
          <div className="py-10">
            <div className="flex flex-wrap justify-center">
              {store.games.map((game:ShortGame,index:number) => <SmallGameBox key={index} game={game}/>)}
            </div>
            <div className='w-24 h-16 rounded-lg m-auto mt-8'>
              {loading ? <SmallLoader big={false} xCentered={true}/> : <SearchButton text="Load More" onClick={() => loadGames(store.page)}/>}
            </div>
          </div>
        </div>
      </SearchLayout>
    )
}

interface Context {
  query: {
    yearRange: string[] | string | undefined;
    genres: string[] | string | undefined;
    consoles: string[] | string | undefined;
  }
}

export async function getServerSideProps(context:Context) {
  const {yearRange, genres, consoles } = context.query
  let games = []
  let filteredString:string = ''
  if(yearRange || genres || consoles) {
      if(yearRange) {
          filteredString = filteredString.concat('', `&dates=${yearRange[0]}-01-01,${yearRange[1]}-12-31`);
      }
    //simetimes from the client i get consoles as string, but i need an array
    //thats why i am checkinf the type of the consoles
      if(consoles) {
          if(typeof consoles === 'string') {
              filteredString = filteredString.concat(`&parent_platforms=${consoles}`)
          } else {
              let consolesString:string = ''
              for(let key in consoles) {
                  if(parseInt(key) !== consoles.length - 1) {
                      consolesString = consolesString.concat(`${consoles[key]}`,',')
                  } else {
                      consolesString = consolesString.concat(`${consoles[key]}`,'') 
                  }
              }   
              filteredString = filteredString.concat(`&platforms=${consolesString}`)
          }
      }
      if(genres) {
          if(typeof genres === 'string') {
              filteredString = filteredString.concat(`&genres=${genres}`)
          } else {
              let genresString:string = ''
              for(let key in genres) {
                  if(parseInt(key) !== genres.length - 1) {
                      genresString = genresString.concat(`${genres[key]}`,',')
                  } else {
                      genresString = genresString.concat(`${genres[key]}`,'') 
                  }
              }   
              filteredString = filteredString.concat(`&genres=${genresString}`)
          }
      } 
      const getData = await fetch(`https://api.rawg.io/api/games?key=e996863ffbd04374ac0586ec2bcadd55&ordering=-released&page=1&page_size=20${filteredString}`)
      games = await getData.json()
  } else {
      const getData = await fetch(`https://api.rawg.io/api/games?key=e996863ffbd04374ac0586ec2bcadd55&ordering=-released&page=1&page_size=20`)
      games = await getData.json()
  }
  return {
      props: {
          games: games.results,
      }
  }
}