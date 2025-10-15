import { useEffect, useRef } from 'react'
import { useEvent } from '../useEvent'
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

  const skipClickCounter = useRef(0)

  useEvent('pointerdown', () => {
    skipClickCounter.current++
  })

  const forSkippeable = async (seconds: number, splitCount = 8) => {
    const interval = seconds / splitCount
    const mult = splitCount / 2

    skipClickCounter.current = 0

    for (let i = 0; i < splitCount; i++) {
      if (skipClickCounter.current * mult > i) {
        continue
      }

      await forSeconds(interval)
    }
  }

  return { forSeconds, forMiliseconds, forSkippeable }
}
