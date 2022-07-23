interface Props {
  title: string;
  active?: boolean;
  onClick: () => void;
}

export default function YellowButton(props: Props) {
  return (
    <button
      className={`w-full h-12 bg-specialYellow rounded-lg text-white text-lg font-normal ${
        !props.active ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={props.onClick}
      title={props.title}
    >
      {props.title}
    </button>
  );
}
