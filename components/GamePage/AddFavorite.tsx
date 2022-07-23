import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as regular } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as solid } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

interface Props {
  gameId: number;
}

export default function AddFavorite(props: Props) {
  const session = useSession();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const addFavorite = async () => {
    try {
      //cancel favorite game
      if (isFavorite) {
        setIsFavorite(false);
        const req = await axios.post(
          "/api/game/cancel/favorite/deleteFavorite",
          {
            userId: session.data?.user?.userId,
            gameId: props.gameId,
            favoriteId: isFavorite,
          }
        );
        if (req.status !== 200) throw new Error(req.data.error);
      } else {
        const response = await axios.post(`/api/game/action/favorite/add`, {
          userId: session.data?.user?.userId,
          gameId: props.gameId,
        });
        if (response.status === 200) {
          setIsFavorite(response.data.favoriteId);
        } else {
          throw new Error("Unexpected error");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (session.status === "authenticated") {
      const checkIsFavorite = async () => {
        try {
          const req = await axios.get(
            `/api/game/get/getIsFavorite?userId=${session.data?.user?.userId}&gameId=${props.gameId}`
          );
          if (req.status === 200) {
            if (!req.data.isFavorite) return;
            setIsFavorite(req.data.isFavorite);
          } else {
            throw new Error(req.data.error);
          }
        } catch (e) {
          console.log("error", e);
        }
      };
      checkIsFavorite();
    }
  }, [session.status]);

  return (
    <div>
      <FontAwesomeIcon
        className="h-4 text-white cursor-pointer"
        icon={isFavorite ? solid : regular}
        onClick={() => addFavorite()}
      />
    </div>
  );
}
