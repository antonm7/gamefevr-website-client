import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useGlobalError } from '../../store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark as regular } from '@fortawesome/free-regular-svg-icons'
import { faBookmark as solid } from '@fortawesome/free-solid-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

interface Props {
  gameId: number
}

export default function AddFavorite({ gameId }: Props) {
  const session = useSession()
  const router = useRouter()
  const globalErrorState = useGlobalError((state) => state)
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [mouseOver, setMouseOver] = useState<boolean>(false)

  const navigateAuth = (): void => {
    if (session.status !== 'authenticated') {
      router.push('/register/login')
    } else {
      addFavorite()
    }
  }

  const addFavorite = async (): Promise<void> => {
    try {
      //cancel favorite game
      if (isFavorite) {
        setIsFavorite(false)
        const req = await axios.post(
          '/api/game/cancel/favorite/deleteFavorite',
          {
            userId: session.data?.user?.userId,
            gameId: gameId,
            favoriteId: isFavorite,
          }
        )
        if (req.status !== 200) throw new Error(req.data.error)
      } else {
        const response = await axios.post(`/api/game/action/favorite/add`, {
          userId: session.data?.user?.userId,
          gameId: gameId,
        })
        if (response.status === 200) {
          setIsFavorite(response.data.favoriteId)
        } else {
          throw new Error('Unexpected error')
        }
      }
    } catch (e) {
      globalErrorState.setType('error')
      globalErrorState.setText(`oops, can't add game for favorites`)
      globalErrorState.setIsVisible(true)
    }
  }

  useEffect(() => {
    if (session.status === 'authenticated') {
      const checkIsFavorite = async (): Promise<void> => {
        try {
          const req = await axios.get(
            `/api/game/get/getIsFavorite?userId=${session.data?.user?.userId}&gameId=${gameId}`
          )
          if (req.status === 200) {
            if (!req.data.isFavorite) return setIsFavorite(false)
            setIsFavorite(req.data.isFavorite)
          } else {
            throw new Error(req.data.error)
          }
        } catch (e) {
          return
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
        className="flex items-center justify-center w-40 h-10  mt-6 rounded-md cursor-pointer opacity-70 hover:opacity-100"
        style={{ backgroundColor: '#0c284a' }}
      >
        <FontAwesomeIcon icon={regular} className="h-4 text-white pr-2" />
        <p className="whitespace-nowrap text-sm text-white">Add To Favorite</p>
      </div>
    )
  } else {
    return (
      <div
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
        onClick={() => navigateAuth()}
        className="flex items-center justify-center w-40 h-10  mt-6 rounded-md cursor-pointer opacity-70 hover:opacity-100"
        style={{ backgroundColor: mouseOver ? 'rgb(239 68 68)' : '#50c878' }}
      >
        <FontAwesomeIcon
          icon={mouseOver ? faXmark : solid}
          className={`${mouseOver ? 'h-5' : 'h-4'} text-white pr-2`}
        />
        <p className="whitespace-nowrap text-sm text-white">Favorite</p>
      </div>
    )
  }
}
