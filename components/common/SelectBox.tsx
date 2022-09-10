type Props = {
  title: string
  onClick: () => void
  coolBlue?: boolean
  isSelected: boolean
}

export default function SelectBox({
  title,
  onClick,
  coolBlue,
  isSelected,
}: Props) {
  return (
    <button
      id="selectBox"
      onClick={onClick}
      className={`h-10 m-2 overflow-hidden border border-lighterBg px-6 flex flex-row items-center justify-center rounded-xl ${
        isSelected && !coolBlue
          ? 'bg-main-blue'
          : isSelected && true
          ? 'bg-cool-blue'
          : 'bg-transparent'
      }`}
    >
      <p
        className={`${
          isSelected ? 'text-white' : 'text-text-gray'
        } text-base font-extralight`}
      >
        {title}
      </p>
    </button>
  )
}
