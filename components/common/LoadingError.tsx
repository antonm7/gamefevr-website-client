import YellowButton from "./YellowButton";

interface Props {
  mainTitle: string;
  description: string;
  button?: boolean;
  onClick?: () => void;
}
export default function LoadingError(props: Props) {
  return (
    <div className="text-center">
      <h1 className="text-6xl text-specialYellow font-extrabold overflow-hidden">
        {props.mainTitle}
      </h1>
      <h3 className="pt-4 text-2xl font-semibold text-text-gray">
        {props.description}
      </h3>
      {props.button && props.onClick ? (
        <div className="w-32" style={{ margin: "2rem auto" }}>
          <YellowButton title={"Try Again"} active={true} onClick={props.onClick} />
        </div>
      ) : null}
    </div>
  );
}
