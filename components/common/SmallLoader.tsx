import { SpinnerRoundFilled } from "spinners-react";

interface Props {
  xCentered?: boolean;
  screenCentered?: boolean;
  big?: boolean;
}

export default function SmallLoader(props: Props) {
  if (props.screenCentered) {
    return (
      <div className="h-5/6 w-full flex items-center justify-center">
        <SpinnerRoundFilled
          size={props.big ? 110 : 37}
          thickness={117}
          speed={85}
          color="rgba(255, 198, 53, 1)"
        />
      </div>
    );
  }
  if (props.xCentered) {
    return (
      <SpinnerRoundFilled
        className="mx-auto"
        size={props.big ? 110 : 37}
        thickness={117}
        speed={85}
        color="rgba(255, 198, 53, 1)"
      />
    );
  }
  return (
    <div>
      <SpinnerRoundFilled
        size={props.big ? 110 : 37}
        thickness={117}
        speed={85}
        color="rgba(255, 198, 53, 1)"
      />
    </div>
  );
}
