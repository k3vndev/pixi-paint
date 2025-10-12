import { useEffect, useRef } from 'react'
import { useTimeout } from './useTimeout'

export const useWait = () => {
  const { startTimeout, stopTimeout } = useTimeout()
  const currentPromiseRejectRef = useRef<null | (() => void)>(null)

  useEffect(
    () => () => {
      stopTimeout()
      currentPromiseRejectRef.current?.()
    },
    []
  )

  const forSeconds = (s: number) => forMiliseconds(s * 1000)

  const forMiliseconds = (ms: number) =>
    new Promise<void>((res, rej) => {
      requestAnimationFrame(() => {
        currentPromiseRejectRef.current = rej

        startTimeout(() => {
          res()
          currentPromiseRejectRef.current = null
        }, ms)
      })
    })

  return { forSeconds, forMiliseconds }
}
