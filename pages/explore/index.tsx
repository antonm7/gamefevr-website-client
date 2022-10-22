import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'
import SearchLayout from '../../components/layout/SearchLayout'
import { ElementDescription } from '../../types'
import { genres, parentConsoles } from '../../lib/staticData'
import FiltersRow from '../../components/Explore/FiltersRow'

interface Props {
  random_genres: ElementDescription[]
  random_platforms: ElementDescription[]
  explored: number
}

export default function Index({ random_genres, random_platforms }: Props) {
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
  }, [])

  return (
    <SearchLayout>
      <div className="px-44 pb-10 py-10">
        <p
          id="we_found_title"
          className="we_found_padding font-bold text-white text-4xl "
        >
          Start Exploring Games New Games!
        </p>
        <FiltersRow genres={genres} platforms={platforms} />
      </div>
    </SearchLayout>
  )
}

interface ElementExtends extends ElementDescription {
  type?: string
}

export async function getServerSideProps(context: GetServerSideProps) {
  //fetch random genres

  const random_genres: ElementExtends[] = []
  const random_platforms: ElementExtends[] = []

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

  for (const key in random_genres) {
    random_genres[key] = {
      ...random_genres[key],
      type: 'genres',
    }
  }

  for (const key in random_platforms) {
    random_platforms[key] = {
      ...random_platforms[key],
      type: 'platforms',
    }
  }

  console.log(random_genres, random_platforms)

  return {
    props: {
      random_genres,
      random_platforms,
    },
  }
}
