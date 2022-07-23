import Slider from "react-slick";
import { ShortGame } from "../../types";
import GameBox from "./GameBox";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export default function ExploreScroll(props: any) {
  const settings = {
    className: "center",
    centerMode: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    centerPadding: "60px",
  };
  return (
    <div
      id="explore_wrapper"
      className="overflow-hidden"
      style={{ width: "75%" }}
    >
      <Slider {...settings}>
        {props?.games.map((game: ShortGame, index: number) => (
          <GameBox game={game} key={index} />
        ))}
      </Slider>
    </div>
  );
}
