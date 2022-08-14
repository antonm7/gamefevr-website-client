import LoadingError from '../common/LoadingError'

interface Props {
  onLoad: () => void
}

export default function Error({ onLoad }: Props) {
  return (
    <div className="pt-44">
      <LoadingError
        mainTitle={'Unexpected Error'}
        description={'Oops...error loading the game, please try again'}
        button={true}
        onClick={() => onLoad()}
      />
    </div>
  )
}
