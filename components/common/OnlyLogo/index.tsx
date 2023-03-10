import useWindowSize from "../../../lib/functions/hooks/useWindowSize"
import Image from "next/image"
import Shape from "./Shape"

export default function OnlyLogo() {
  const [width] = useWindowSize()

  if (width >= 900) {
    return <Image src={'/images/dLogo.png'} height={32} width={130} alt="Logo" />
  } else {
    return (
      <div className="relative overflow-hidden" id="login_onlyLogo">
        <Shape size={width >= 500 ? 'xl' : width >= 360 ? 'lg' : 'sm'} />
      </div>
    )
  }
}