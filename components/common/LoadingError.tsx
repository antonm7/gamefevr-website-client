import YellowButton from './YellowButton'

interface Props {
  mainTitle: string
  description: string
  button?: boolean
  onClick?: () => void
}

export default function LoadingError({
  mainTitle,
  description,
  button,
  onClick,
}: Props) {
  return (
    <div className="text-center">
      <h1 className="text-6xl text-specialYellow font-extrabold overflow-hidden">
        {mainTitle}
      </h1>
      <h3 className="pt-4 text-2xl font-semibold text-text-gray">
        {description}
      </h3>
      {button && onClick ? (
        <div className="w-32" style={{ margin: '2rem auto' }}>
          <YellowButton title={'Try Again'} active={true} onClick={onClick} />
        </div>
      ) : null}
    </div>
  )
}
