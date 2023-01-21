import useWindowSize from "../../../../lib/functions/hooks/useWindowSize"
import { DetailedGame } from "../../../../types"
import { Review_Type } from "../../../../types/schema"
import Description from "../../Description"
import SameSeries from "../../SameSeries"
import Tags from "../../Tags"
import Bigger640 from "../Upper/Bigger640"
import Lower640 from "../Upper/lower640"

type Props = {
    reviews: Review_Type[],
    game: DetailedGame,
    setIsUserRated: (value: string) => void
}

export default function Upper({ reviews, game, setIsUserRated }: Props) {
    const [width] = useWindowSize()
    return (
        <>
            {width > 640 ? (
                <Bigger640
                    reviews={reviews}
                    game={game}
                    changeIsUserRated={(value) => setIsUserRated(value)}
                />
            ) : (
                <Lower640
                    reviews={reviews}
                    game={game}
                    changeIsUserRated={(value) => setIsUserRated(value)}
                />
            )}
            <div className="flex justify-between" id="game_description_row">
                <Description desc={game.description} />
                <SameSeries games={game.same_series} />
            </div>
            <Tags tags={game.tags} />
        </>
    )
}