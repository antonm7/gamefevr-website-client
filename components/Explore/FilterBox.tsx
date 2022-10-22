interface Props {
  name: string
  onClick: () => void
  isSelected: boolean
}
export default function FilterBox({ name, onClick, isSelected }: Props) {
  return (
    <div
      className={`${
        isSelected ? 'opacity-100' : 'opacity-70'
      } hover:opacity-100 cursor-pointer h-auto font-semibold whitespace-nowrap w-auto bg-cool-blue m-3 p-2 overflow-hidden text-center rounded-lg text-main-blue`}
      onClick={onClick}
    >
      <p className="text-sm">{name}</p>
    </div>
  )
}
