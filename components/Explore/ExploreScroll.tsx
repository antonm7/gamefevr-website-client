import Slider from 'react-slick'
import { ShortGame } from '../../types'
import GameBox from './GameBox'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import axios from 'axios'

interface Props {
  games: ShortGame[]
  setRef: any
  onUpdate: (c: number) => void
}

export default function ExploreScroll({ games, setRef, onUpdate }: Props) {
  const settings = {
    className: 'center',
    centerMode: false,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    centerPadding: '60px',
    afterChange: (curr: number) => changeUpdate(curr),
  }

  const changeUpdate = async (curr: number): Promise<void> => {
    try {
      onUpdate(curr)
      axios.post('/api/explore/action/visited', {
        gameId: games[curr].id,
      })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div
      id="explore_wrapper"
      className="overflow-hidden mt-4"
      style={{ width: '60%', height: '42rem' }}
    >
      <Slider {...settings} ref={setRef}>
        {games.map((game: ShortGame, index: number) => (
          <GameBox game={game} key={index} />
        ))}
      </Slider>
    </div>
  )
}
