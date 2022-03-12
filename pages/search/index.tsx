import { GetServerSideProps } from "next";
import SearchLayout from "../../components/layout/SearchLayout";
import SmallGameBox from "../../components/SmallGameBox";
import SearchButton from "../../components/common/SearchButton"
import { useEffect, useState } from "react";

export default function Index(props:any) {
  const [games,setGames] = useState<any[]>([])
  const [page,setPage] = useState<number>(2)
  
  useEffect(() => {
    setGames(props.games)
  },[])

  const loadMore = async () => {
    const getData = await fetch(`https://api.rawg.io/api/games?key=e996863ffbd04374ac0586ec2bcadd55&page=${page}&page_size=20`)
    let data = await getData.json()
    setGames((old:any[]) => [...old, ...data.results])
    setPage(page => page += 1)
  }

  return (
      <SearchLayout>
        <div className="flex flex-wrap justify-center">
          {games.map((game:any,index:number) => <SmallGameBox key={index} game={game}/>)}
        </div>
        <div className='w-24 h-16 rounded-lg m-auto mb-8'>
          <SearchButton text="Load More" onClick={() => loadMore()}/>
        </div>
      </SearchLayout>
    )
}

export const getServerSideProps:GetServerSideProps = async (context) => {
  const query:any = context.query
  //filters
  //dates:2010-01-01,2012-01-01
  //genres:action,indie
  //platforms:1-pc,2-playstations,3XBOX,4IOS,8Android,5Mac,6LINUX,7Nintendo,Atari9,Commodore / Amiga10,11SEGA,12-3DO,13NEOGEO,14Web
  let games:any = []
  let filteredString:string = ''
  if(Object.keys(query).length === 0){
    const getData = await fetch(`https://api.rawg.io/api/games?key=e996863ffbd04374ac0586ec2bcadd55&page_size=20`)
    games = await getData.json()
  } else {
    if(query.dates) filteredString.concat(`&dates=${query.dates[0]}-1-1,${query.dates[1]}-1-1`)
    if(query.genres) {
      let genresString:string = ''
      query.genres.map((g:string,i:number) => i === query.genres.length - 1 ? genresString.concat(g) : genresString.concat(`g,`))
      filteredString.concat(`&genres=${genresString}`)
    } 
    if(query.publishers) {
      let publishersString:string = ''
      query.publishers.map((p:string,i:number) => i === query.publishers.length - 1 ? publishersString.concat(p) : publishersString.concat(`${p},`))
      filteredString.concat(`&genres=${publishersString}`)
    }
    const getData = await fetch(`https://api.rawg.io/api/games?key=e996863ffbd04374ac0586ec2bcadd55&page_size=20${filteredString}`)
    games = await getData.json()
  } 
  
  return {
    props: {
      games:games.results
    }
  }
}
