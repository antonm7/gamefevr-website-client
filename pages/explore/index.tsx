import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { ObjectId } from 'bson'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import SmallLoader from '../../components/common/SmallLoader'
import ExploreScroll from '../../components/Explore/ExploreScroll'
import FilterBox from '../../components/Explore/FilterBox'
import SearchLayout from '../../components/layout/SearchLayout'
import { ElementDescription, ShortGame } from '../../types'
import { genres, parentConsoles } from '../../lib/staticData'

interface Props {
  random_genres: ElementDescription[]
  random_platforms: ElementDescription[]
  explored: number
}

export default function Index({ random_genres, random_platforms }: Props) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedYears, setSelectedYears] = useState<string[]>([])

  const [genres, setGenres] = useState<ElementDescription[]>([])
  const [platforms, setPlatforms] = useState<ElementDescription[]>([])

  const loadMore = async (): Promise<void> => {
    // try {
    //   const req = await axios.get('/api/explore/get/search')
    //   if (req.status !== 200) throw new Error()
    //   if (!req.data.results.length) throw new Error()
    //   setGames((arr) => [...arr, ...req.data.results])
    // } catch (e) {
    //   console.log(e)
    // }
  }

  useEffect(() => {
    setGenres(random_genres)
    setPlatforms(random_platforms)
  }, [random_genres, random_platforms])

  const GenerateOrder = (
    arr1: ElementDescription[],
    arr2: ElementDescription[]
  ): ReactElement => {
    function shuffle(array: ElementDescription[]) {
      let currentIndex = array.length,
        randomIndex

      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        ;[array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ]
      }

      return array
    }

    return (
      <>
        {shuffle([...arr1, ...arr2]).map((g) => (
          <FilterBox
            name={g.name}
            key={g.name}
            onClick={() => setSelectedGenres((arr) => [...arr, g.id])}
            isSelected={selectedGenres.includes(g.id)}
          />
        ))}
      </>
    )
  }

  return (
    <SearchLayout>
      <div className="px-44 pb-10 py-10">
        <p
          id="we_found_title"
          className="we_found_padding font-bold text-white text-4xl "
        >
          Start Exploring Games New Games!
        </p>
        <div className="flex flex-wrap pt-4 ">
          {GenerateOrder(genres, platforms)}
          <FilterBox
            name="New Games"
            onClick={() =>
              selectedYears.includes('new_games')
                ? setSelectedYears(
                    selectedYears.filter((y) => y !== 'new_games')
                  )
                : setSelectedYears([...selectedYears, 'new_games'])
            }
            isSelected={selectedYears.includes('new_games')}
          />
        </div>
      </div>
    </SearchLayout>
  )
}

export async function getServerSideProps(context: GetServerSideProps) {
  //fetch random genres

  const random_genres: ElementDescription[] = []
  const random_platforms: ElementDescription[] = []

  const shuffle = (
    currArr: ElementDescription[],
    list: ElementDescription[],
    type: 'genres' | 'platforms'
  ): void => {
    const chosen = list[Math.floor(Math.random() * list.length)]

    if (type === 'genres') {
      const filtered = random_genres.filter((r) => r.name === chosen.name)
      if (filtered.length) {
        shuffle(currArr, list, type)
      } else {
        random_genres.push(chosen)
      }
    } else {
      const filtered = random_platforms.filter((r) => r.name === chosen.name)
      if (filtered.length) {
        shuffle(currArr, list, type)
      } else {
        random_platforms.push(chosen)
      }
    }
  }

  for (let i = 0; i < 5; i++) {
    shuffle(random_genres, genres, 'genres')
    shuffle(random_platforms, parentConsoles, 'platforms')
  }

  return {
    props: {
      random_genres,
      random_platforms,
    },
  }
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const limit = 50
//   const page = Math.round(getRandomInt(0, 760000) / limit)
//   let filteredString = ''

//   const useOrNot = () => {
//     const num = Math.round(Math.random())
//     if (num === 0) {
//       return false
//     }
//     return true
//   }

//   if (useOrNot()) {
//     const consoles = parentConsoles
//     let consolesString = ''
//     const item = consoles[Math.floor(Math.random() * consoles.length)]
//     consolesString = consolesString.concat(`${item.id}`, '')
//     filteredString = filteredString.concat(`&consoles=${consolesString}`)
//   }
//   //add more
//   if (useOrNot()) {
//     const genresData = genres
//     let genresString = ''
//     const item = genresData[Math.floor(Math.random() * genresData.length)]
//     genresString = genresString.concat(`${item.id}`, '')
//     filteredString = filteredString.concat(`&platforms=${genresString}`)
//   }

//   const getData = await fetch(
//     `https://api.rawg.io/api/games?key=39a2bd3750804b5a82669025ed9986a8&page=${page}&page_size=${limit}`
//   )

//   const client = await clientPromise
//   const db = client.db('gameFevr')
//   const session = await getSession(context)

//   const user: any = await db
//     .collection('users')
//     .findOne({ _id: new ObjectId(session?.user.userId) })

//   const explored = user?.visited_explore?.length

//   const games = await getData.json()
//   return {
//     props: {
//       games: games.results,
//       explored: explored ? explored : 0,
//     },
//   }
// }
