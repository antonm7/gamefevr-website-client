import LoadingError from '../common/LoadingError'

type Props = {
  onLoad: () => void
}

export default function ErrorComponent({ onLoad }: Props) {
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
