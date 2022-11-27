import { ObjectId } from "bson";
import { useRef } from "react";
import Slider from "react-slick";
import useWindowSize from "../../lib/functions/hooks/useWindowSize";
import { Favorite_Type } from "../../types/schema";
import Favorite from "./Favorite";

interface Props {
    visited: boolean
    favorites: Favorite_Type[]
    deleteFavorite: (id: ObjectId | undefined) => void
}

export default function FavoritesSlider({ favorites, deleteFavorite, visited }: Props) {
    const [width] = useWindowSize()
    const favoriteRef = useRef(null)

    const favoritesSettings = {
        infinite: false,
        arrows: false,
        slidesToShow: favorites.length >= 4 ? 4 : favorites.length,
        responsive: [
            {
                breakpoint: 1650,
                settings: {
                    slidesToShow: favorites.length >= 3 ? 3 : favorites.length,
                },
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: favorites.length >= 2 ? 2 : favorites.length,
                },
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    }
    return (
        <div className="pt-14">
            <h1 className="text-white font-bold text-3xl">Favorite Games</h1>
            <div
                className={`mt-12 ${width < 760
                    ? ''
                    : favorites.length === 2 && width > 1200
                        ? 'w-[44rem]'
                        : favorites.length === 3 && width > 1650
                            ? 'w-[83%]'
                            : favorites.length === 2 && width <= 1200
                                ? 'w-full'
                                : favorites.length === 3 && width <= 1200
                                    ? 'w-[44rem]'
                                    : 'w-full'
                    }`}
            >
                {favorites.length > 0 ? (
                    favorites.length === 2 && width > 700 ? (
                        <div
                            className={`flex flex-nowrap ${width < 1650 ? 'justify-between' : 'justify-between'
                                }`}
                        >
                            {favorites.map((review: Favorite_Type, index: number) =>
                                width < 1200 ? (
                                    <div className="w-[22rem]">
                                        <Favorite
                                            visited={visited}
                                            _id={review._id}
                                            key={index}
                                            userId={review.userId}
                                            created_at={review.created_at}
                                            gameId={review.gameId}
                                            game_name={review.game_name}
                                            game_image={review.game_image}
                                            deleteFavorite={(id) => deleteFavorite(id)}
                                        />
                                    </div>
                                ) : (
                                    <Favorite
                                        visited={visited}
                                        _id={review._id}
                                        key={index}
                                        userId={review.userId}
                                        created_at={review.created_at}
                                        gameId={review.gameId}
                                        game_name={review.game_name}
                                        game_image={review.game_image}
                                        deleteFavorite={(id) => deleteFavorite(id)}
                                    />
                                )
                            )}
                        </div>
                    ) : favorites.length <= 4 && width > 1650 ? (
                        <div
                            className={`flex flex-nowrap ${width < 1650 ? 'justify-start' : 'justify-between'
                                }`}
                        >
                            {favorites.map(
                                (review: Favorite_Type, index: number) => (
                                    <Favorite
                                        visited={visited}
                                        _id={review._id}
                                        key={index}
                                        userId={review.userId}
                                        created_at={review.created_at}
                                        gameId={review.gameId}
                                        game_name={review.game_name}
                                        game_image={review.game_image}
                                        deleteFavorite={(id) => deleteFavorite(id)}
                                    />
                                )
                            )}
                        </div>
                    ) : favorites.length === 1 && width < 1200 && width > 800 ? (
                        favorites.map((review: Favorite_Type, index: number) => (
                            <div>
                                <Favorite
                                    visited={visited}
                                    _id={review._id}
                                    key={index}
                                    userId={review.userId}
                                    created_at={review.created_at}
                                    gameId={review.gameId}
                                    game_name={review.game_name}
                                    game_image={review.game_image}
                                    deleteFavorite={(id) => deleteFavorite(id)}
                                />
                            </div>
                        ))
                    ) : favorites.length === 1 && width < 800 ? (
                        favorites.map((review: Favorite_Type, index: number) => (
                            <div className="w-full">
                                <Favorite
                                    visited={visited}
                                    _id={review._id}
                                    key={index}
                                    userId={review.userId}
                                    created_at={review.created_at}
                                    gameId={review.gameId}
                                    game_name={review.game_name}
                                    game_image={review.game_image}
                                    deleteFavorite={(id) => deleteFavorite(id)}
                                />
                            </div>
                        ))
                    ) : (
                        <Slider {...favoritesSettings} ref={favoriteRef}>
                            {favorites.map(
                                (review: Favorite_Type, index: number) => (
                                    <Favorite
                                        visited={visited}
                                        _id={review._id}
                                        key={index}
                                        userId={review.userId}
                                        created_at={review.created_at}
                                        gameId={review.gameId}
                                        game_name={review.game_name}
                                        game_image={review.game_image}
                                        deleteFavorite={(id) => deleteFavorite(id)}
                                    />
                                )
                            )}
                        </Slider>
                    )
                ) : (
                    <div className="text-md text-white font-semibold opacity-30">
                        You don't have favorite games yet!
                    </div>
                )}
            </div>
        </div>
    )
}