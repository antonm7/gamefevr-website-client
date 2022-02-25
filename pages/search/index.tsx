import { GetServerSideProps } from "next";
import SearchLayout from "../../components/layout/SearchLayout";
import SmallGameBox from "../../components/SmallGameBox";

export default function Index(props:any) {
  console.log(props.games)
    return (
        <SearchLayout>
          <div>Welcome</div>
          <div className="flex flex-wrap justify-center">
            {props.games.map((game:any,index:number) => <SmallGameBox key={index} game={game}/>)}
          </div>
        </SearchLayout>
      )
}

export const getServerSideProps:GetServerSideProps = async (context) => {
  const query = context.query
  //filters
  //dates:2010-01-01,2012-01-01
  //genres:action,indie
  //platforms:1-pc,2-playstations,3XBOX,4IOS,8Android,5Mac,6LINUX,7Nintendo,Atari9,Commodore / Amiga10,11SEGA,12-3DO,13NEOGEO,14Web
  let games:any = []

  if(Object.keys(query).length === 0){
    const getData = await fetch(`https://api.rawg.io/api/games?key=e996863ffbd04374ac0586ec2bcadd55&page_size=20`)
    games = await getData.json()
  }
  return {
    props: {
      games:games.results
    }
  }
}
