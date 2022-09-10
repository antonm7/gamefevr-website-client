import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useGlobalError } from '../../store'

interface Props {
  gameId: number
}

export default function AddFavorite({ gameId }: Props) {
  const session = useSession()
  const router = useRouter()
  const globalErrorState = useGlobalError((state) => state)
  const [isFavorite, setIsFavorite] = useState<boolean>(false)

  const navigateAuth = (): void => {
    if (session.status !== 'authenticated') {
      router.push('/register/login')
    }
    addFavorite()
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

  return (
    <div
      onClick={() => navigateAuth()}
      className="flex items-center justify-center w-36 h-10  mt-4 rounded-md cursor-pointer opacity-70 hover:opacity-100"
      style={{ backgroundColor: '#0c284a' }}
    >
      <p className="whitespace-nowrap text-sm text-white">Add To Favorite</p>
    </div>
  )
}
