import useWindowSize from "../../../../lib/functions/hooks/useWindowSize"
import { DetailedGame } from "../../../../types"
import { Review_Type } from "../../../../types/schema"
import Description from "../../Description"
import SameSeries from "../../SameSeries"
import Tags from "../../Tags"
import Bigger900 from "./Bigger900"
import Lower900 from "./Lower900"
import styles from './index.module.scss'

type Props = {
    reviews: Review_Type[],
    game: DetailedGame,
    setIsUserRated: (value: string) => void
}

export default function Upper({ reviews, game, setIsUserRated }: Props) {
    const [width] = useWindowSize()
    return (
        <>
            {width >= 900 ? (
                <Bigger900
                    reviews={reviews}
                    game={game}
                    changeIsUserRated={(value) => setIsUserRated(value)}
                />
            ) : (
                <Lower900
                    reviews={reviews}
                    game={game}
                    changeIsUserRated={(value) => setIsUserRated(value)}
                />
            )}
            <div className="flex justify-between" id={styles.footer_container}>
                <Description desc={game.description} />
                <SameSeries games={game.same_series} />
            </div>
            <Tags tags={game.tags} />
        </>
    )
}