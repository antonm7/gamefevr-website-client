interface Props {
  title: string
  active?: boolean
  onClick: () => void
}

export default function YellowButton({ title, active, onClick }: Props) {
  return (
    <button
      className={`w-full h-12 bg-specialYellow rounded-lg text-white text-lg font-normal ${
        !active && active !== undefined ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      title={title}
    >
      {title}
    </button>
  )
}
