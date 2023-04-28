import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark as regular } from '@fortawesome/free-regular-svg-icons'
import { faBookmark as solid } from '@fortawesome/free-solid-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { wretchAction, wretchWrapper } from '../../../lib/functions/fetchLogic'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

interface Props {
  gameId: number
}

export default function AddFavorite({ gameId }: Props) {
  const session = useSession()
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState<boolean | string>(false)
  const [mouseOver, setMouseOver] = useState<boolean>(false)

  const navigateAuth = (): void => {
    if (session.status !== 'authenticated') {
      router.push(`/register/login?back=${router.asPath}`)
    } else {
      addFavorite()
    }
  }

  const addFavorite = async (): Promise<void> => {
    try {
      //cancel favorite game
      if (isFavorite) {
        await wretchAction('/api/game/cancel/favorite/deleteFavorite', {
          userId: session.data?.user?.userId,
          gameId: gameId,
          favoriteId: isFavorite
        })
        setIsFavorite(false)
      } else {
        const addToFavoriteAction = await
          wretchAction(`/api/game/action/favorite/add`, {
            userId: session.data?.user?.userId,
            gameId: gameId
          })
        if (typeof addToFavoriteAction.favoriteId === 'string') {
          setIsFavorite(addToFavoriteAction.favoriteId)
          PubSub.publish('OPEN_ALERT', {
            type: 'success',
            msg: 'Added game to favorites'
          })
        } else {
          throw new Error('Unexpected error')
        }
      }
    } catch (e) {
      PubSub.publish('OPEN_ALERT', {
        type: 'error',
        msg: `oops, can't add game for favorites`
      })
    }
  }

  useEffect(() => {
    if (session.status === 'authenticated') {
      const checkIsFavorite = async (): Promise<void> => {
        try {
          const fetchIsFavorite
            = await wretchWrapper(`/api/game/get/getIsFavorite?userId=${session.data?.user?.userId}&gameId=${gameId}`)
          if (fetchIsFavorite.isFavorite) {
            setIsFavorite(fetchIsFavorite.isFavorite)
          }
        } catch (e) {
          throw new Error('Unexpected Error')
        }
      }
      checkIsFavorite()
    }
  }, [session.status, gameId])

  useEffect(() => {
    setMouseOver(false)
  }, [isFavorite])

  if (!isFavorite) {
    return (
      <div
        onClick={() => navigateAuth()}
        className="flex items-center justify-center w-40 h-10  mt-2 rounded-md cursor-pointer opacity-70 hover:opacity-100"
        style={{ backgroundColor: '#0c284a' }}
      >
        <FontAwesomeIcon icon={regular as IconProp} className="h-4 text-white pr-2" />
        <p className="whitespace-nowrap text-sm text-white">Add To Favorite</p>
      </div>
    )
  } else {
    return (
      <div
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
        onClick={() => navigateAuth()}
        className="flex items-center justify-center w-40 h-10  mt-2 rounded-md cursor-pointer opacity-70 hover:opacity-100"
        style={{ backgroundColor: mouseOver ? 'rgb(239 68 68)' : '#50c878' }}
      >
        <FontAwesomeIcon
          icon={mouseOver ? faXmark as IconProp : solid as IconProp}
          className={`${mouseOver ? 'h-5' : 'h-4'} text-white pr-2`}
        />
        <p className="whitespace-nowrap text-sm text-white">Favorite</p>
      </div>
    )
  }
}
