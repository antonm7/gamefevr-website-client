import useWindowSize from "../../lib/functions/hooks/useWindowSize";

interface Props {
  animationDuration: number;
  progress: number;
}

export const Bar = ({ animationDuration, progress }: Props) => {
  const [width] = useWindowSize()

  return (
    <div
      className="bg-cool-blue w-full left-0 top-0 fixed z-50"
      style={{
        height: width > 640 ? "3.5px" : "8px",
        marginLeft: `${(-1 + progress) * 100}%`,
        transition: `margin-left ${animationDuration}ms linear`,
      }}
    ></div>
  );
};
