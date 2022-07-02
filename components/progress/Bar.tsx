export const Bar = ({ animationDuration, progress }:any) => {
    return (<div
      className='bg-cool-blue w-full left-0 top-0 fixed z-50'
      style={{
        height: "2px",
        marginLeft: `${(-1 + progress) * 100}%`,
        transition: `margin-left ${animationDuration}ms linear`,
      }}
    ></div>)
    }