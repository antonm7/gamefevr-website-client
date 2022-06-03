import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
    style?: React.CSSProperties,
    onClick: () => void,
    direction: string
}

export default function Arrow(props:Props) {
    const { direction, style, onClick } = props;
    return (
        <FontAwesomeIcon 
            style={{ ...style, display: "block", background: "white" }} 
            icon={direction === 'left' ? faArrowLeft : faArrowRight}
            onClick={onClick}
        />
    );
  }
  