import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { wretchAction, wretchWrapper } from '../../../lib/functions/fetchLogic'
import { Review_Type } from '../../../types/schema'
import styles from './index.module.scss'

interface Props {
  reviews: Review_Type[]
  updateIsUserRated: (isUserRated: string) => void
}

export default function RateGame({ updateIsUserRated, reviews }: Props) {
  const [wasteOfTime, setWasteOfTime] = useState<boolean>(false)
  const [nuh, setNuh] = useState<boolean>(false)
  const [good, setGood] = useState<boolean>(false)
  const [must, setMust] = useState<boolean>(false)
  const [reviewsState, setReviewsState] = useState<Review_Type[]>([])
  const [isUserRated, setIsUserRated] = useState<string | null>(null)

  const session = useSession()
  const router = useRouter()

  const navigateAuth = (rank: string) => {
    if (session.status !== 'authenticated') {
      return router.push(`/register/login?back=${router.asPath}`)
    }
    rate(rank)
  }

  useEffect(() => {
    const isUserRated = async () => {
      try {
        const getUserRankFetch: any = await wretchWrapper(`/api/game/get/getRank?userId=${session.data?.user?.userId}&gameId=${router.query.id}`, 'getUserRankFetch')
        if (!getUserRankFetch.isUserRated) return
        setIsUserRated(getUserRankFetch.isUserRated)
        updateIsUserRated(getUserRankFetch.isUserRated)
      } catch (e) {
        return
      }
    }
    isUserRated()
  }, [session.status])

  const rate = async (rank: string) => {
    if (session.status === 'unauthenticated') return
    try {
      //cancel rank
      if (rank === isUserRated) {
        setIsUserRated(null)
        await wretchAction('/api/game/cancel/cancelRank', {
          userId: session.data?.user?.userId,
          gameId: router.query.id,
          value: rank
        })
      } else {
        setIsUserRated(rank)
        //for not getting several ranking on the same game
        if (isUserRated) {
          await wretchAction('/api/game/cancel/cancelRank', {
            userId: session.data?.user?.userId,
            gameId: router.query.id,
            value: rank
          })
        }
        await wretchAction('/api/game/action/rankGame', {
          userId: session.data?.user?.userId,
          gameId: router.query.id,
          value: rank
        })
      }
    } catch (e) {
      setIsUserRated(null)
      PubSub.publish('OPEN_ALERT', {
        type: 'error',
        msg: `error ranking the game, try again`
      })
    }
  }

  useEffect(() => {
    if (session.status === 'authenticated') {
      const currReview_ids: string[] = []
      const propsReview_ids: string[] = []
      currReview_ids.push(...reviewsState.map((r) => JSON.stringify(r.userId)))
      propsReview_ids.push(...reviews.map((r) => JSON.stringify(r.userId)))
      //if the incoming reviews from props doesnt includes the usersReview and at the current state there
      //is user Review that means user has deleted his review
      //meaning the rating should be cleared, because thats what we do in the server.
      //If I will not update it on here, that means the server will clear the rating and only after refresh of the page, the rating will
      //be cleared on client >> SERVER WONT BE SYNCED WITHT HE CLIENT
      if (
        !propsReview_ids.includes(JSON.stringify(session.data.user.userId)) &&
        currReview_ids.includes(JSON.stringify(session.data.user.userId))
      ) {
        setIsUserRated('')
      }
      //doing here the same but only if user creats new review and the current state,
      // is not update here. If user creates new review, its need to update the ranking
      if (
        propsReview_ids.includes(JSON.stringify(session.data.user.userId)) &&
        !currReview_ids.includes(JSON.stringify(session.data.user.userId))
      ) {
        let usersReview: Review_Type | null = null
        usersReview = reviews.filter(
          (r) => JSON.stringify(r.userId) === JSON.stringify(session.data.user.userId)
        )[0]

        const generateRank = (rank: string) => {
          switch (rank) {
            case 'Waste Of Time':
              return 'waste_of_time'
            case 'Nuh':
              return 'nuh'
            case 'Good':
              return 'good'
            case 'Must':
              return 'must'
            default:
              return 'good'
          }
        }
        setIsUserRated(generateRank(usersReview.rank))
      }
    }
    setReviewsState(reviews)
  }, [session.status, reviews])

  return (
    <div className="h-32 overflow-hidden">
      <div
        className="bg-white w-72 h-24 rounded-lg text-center py-4" id={styles.inner_container}>
        <h1 className="text-sm font-semibold text-darkIndigo">
          How Would You Rate This Game?
        </h1>
        <div className="flex justify-between px-16 pt-3" id={styles.icons_container}>
          <span
            className={`text-xl cursor-pointer opacity-40 ${wasteOfTime || isUserRated === 'waste_of_time'
              ? 'opacity-100'
              : ''
              }`}
            onMouseEnter={() => setWasteOfTime(true)}
            onMouseLeave={() => setWasteOfTime(false)}
            onClick={() => navigateAuth('waste_of_time')}
          >
            😫
          </span>
          <span
            className={`text-xl cursor-pointer opacity-40 ${nuh || isUserRated === 'nuh' ? 'opacity-100' : ''
              }`}
            onMouseEnter={() => setNuh(true)}
            onMouseLeave={() => setNuh(false)}
            onClick={() => navigateAuth('nuh')}
          >
            🙁
          </span>
          <span
            className={`text-xl cursor-pointer opacity-40 ${good || isUserRated === 'good' ? 'opacity-100' : ''
              }`}
            onMouseEnter={() => setGood(true)}
            onMouseLeave={() => setGood(false)}
            onClick={() => navigateAuth('good')}
          >
            😐
          </span>
          <span
            className={`text-xl cursor-pointer opacity-40 ${must || isUserRated === 'must' ? 'opacity-100' : ''
              }`}
            onMouseEnter={() => setMust(true)}
            onMouseLeave={() => setMust(false)}
            onClick={() => navigateAuth('must')}
          >
            😍
          </span>
        </div>
      </div>
      <div className="w-72">
        {wasteOfTime ? (
          <div
            className={`bg-white w-22 p-2 pt-1 rating-text text-center ${styles.rating_text}`}
            id={styles.waste_of_time}>
            <p className="text-sm font-semibold text-darkIndigo rating_label_text">
              waste of time
            </p>
          </div>
        ) : null}
        {nuh ? (
          <div
            className={`bg-white w-22 p-2 pt-1 ${styles.rating_text} text-center`} id={styles.nuh}>
            <p className="text-sm font-semibold text-darkIndigo rating_label_text">
              nuh
            </p>
          </div>
        ) : null}
        {good ? (
          <div
            className={`bg-white w-22 p-2 pt-1 ${styles.rating_text} text-center`}
            id={styles.good}>
            <p className="text-sm font-semibold text-darkIndigo rating_label_text">
              good
            </p>
          </div>
        ) : null}
        {must ? (
          <div
            className={`bg-white w-22 p-2 pt-1 ${styles.rating_text} text-center`} id={styles.must}>
            <p className="text-sm font-semibold text-darkIndigo rating_label_text">
              must
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
