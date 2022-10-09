interface Props {
  title: string
  active?: boolean
  onClick: () => void
  complete?: boolean
  completeTitle?: string
}

export default function YellowButton({ title, active, onClick, complete, completeTitle }: Props) {
  if (complete) {
    return (<button
      className={`w-full h-12 bg-[#50c878] rounded-lg text-white text-lg font-normal ${!active && active !== undefined ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      onClick={onClick}
      title={completeTitle}
    >
      {completeTitle}
    </button>)
  } else {
    return (
      <button
        className={`w-full h-12 bg-specialYellow rounded-lg text-white text-lg font-normal ${!active && active !== undefined ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        onClick={onClick}
        title={title}
      >
        {title}
      </button>
    )
  }
}
