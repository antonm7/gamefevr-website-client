import { useEffect, useState } from "react"
import useWindowSize from "../../../../lib/functions/hooks/useWindowSize"
import { DetailedGame } from "../../../../types"
import { Review_Type } from "../../../../types/schema"
import Description from "../../Description"
import SameSeries from "../../SameSeries"
import Tags from "../../Tags"
import Bigger900 from "./Bigger900"
import Lower900 from "./Lower900"
import styles from './index.module.scss'
import { wretchWrapper } from "../../../../lib/functions/fetchLogic"

type Props = {
    reviews: Review_Type[],
    game: DetailedGame,
    setIsUserRated: (value: string) => void
}

export default function Upper({ reviews, game, setIsUserRated }: Props) {
    const [width] = useWindowSize()

    const [movieUrl, setMovieUrl] = useState<string | null>(null)

    const loadMovie = async (): Promise<void> => {
        try {
            const getMovies: any = await wretchWrapper(`/api/game/get/getMovie?gameId=${game.id}`)
            if (!getMovies.movies) return
            setMovieUrl(getMovies.movies[0].data.max)
        } catch (e) {
            return
        }
    }

    useEffect(() => {
        loadMovie()
    }, [])

    return (
        <>
            {width >= 900 ? (
                <Bigger900
                    movieUri={movieUrl}
                    reviews={reviews}
                    game={game}
                    changeIsUserRated={(value) => setIsUserRated(value)}
                />
            ) : (
                <Lower900
                    movieUri={movieUrl}
                    reviews={reviews}
                    game={game}
                    changeIsUserRated={(value) => setIsUserRated(value)}
                />
            )}
            <div className="flex justify-between" id={styles.footer_container}>
                <Description desc={game.description} />
                {/* <SameSeries games={game.same_series} /> */}
            </div>
            <Tags tags={game.tags} />
        </>
    )
}