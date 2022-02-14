import { GetServerSideProps } from "next";
import SearchLayout from "../../components/layout/SearchLayout";

export default function Index(props:any) {
    return (
        <SearchLayout>
          <div>Welcome</div>
        </SearchLayout>
      )
}

export const getServerSideProps:GetServerSideProps = async (context) => {
  const query = context.query
  //filters
  //dates:2010-01-01,2012-01-01
  //genres:action,indie
  //platforms:1-pc,2-playstations,3XBOX,4IOS,8Android,5Mac,6LINUX,7Nintendo,Atari9,Commodore / Amiga10,11SEGA,12-3DO,13NEOGEO,14Web
  return {
    props: {
      data:'welcome'
    }
  }
}
