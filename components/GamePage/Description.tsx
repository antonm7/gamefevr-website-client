interface Props {
  desc: string
}
export default function Description({ desc }: Props) {
  return (
    <div
      id="game_page_description_wrapper"
      className="max-w-2xl leading-8 text-base py-20 text-white font-light"
      dangerouslySetInnerHTML={{
        __html: desc,
      }}
    />
  )
}
