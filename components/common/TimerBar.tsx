import { useEffect, useState } from "react";

export default function TimerBar(props: any) {
  const [w, setW] = useState<number>(0);

  useEffect(() => {
    if (props.start) {
      setTimeout(() => {
        if (w > 288) {
          setW(0);
          return;
        }
        setW(w + 1);
      }, 12);
    } else {
      setW(0);
    }
  }, [props.start, w]);

  return (
    <div
      className="h-1 bg-red-200 absolute "
      style={{ bottom: 0, left: 0, width: `${w}px` }}
    >
      <div></div>
    </div>
  );
}
