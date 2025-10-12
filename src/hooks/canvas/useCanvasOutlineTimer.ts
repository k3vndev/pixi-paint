import { EVENTS } from '@consts'
import { useEffect, useRef } from 'react'
import { dispatchCustomEvent } from '@/utils/dispatchCustomEvent'

export const useCanvasOutlineTimer = () => {
  const activeStartListener = useRef<null | (() => void)>(null)
  const activeStartReject = useRef<null | (() => void)>(null)

  const isRunningRef = useRef(false)
  const isPausedRef = useRef(false)

  // biome-ignore format: <>
  useEffect(() => () => {
    activeStartReject.current?.()
  }, [])

  const removeStartListener = () => {
    activeStartListener.current?.()
    activeStartListener.current = null

    isRunningRef.current = false
    isPausedRef.current = false
  }

  const start = (seconds: number) =>
    new Promise<void>((res, rej) => {
      const eventHandler = () => {
        res()
        removeStartListener()
        activeStartReject.current = null
      }

      dispatchCustomEvent('$outline-timer-start', seconds)
      document.addEventListener(EVENTS.OUTLINE_TIMER_TIMED_UP, eventHandler, { once: true })

      isRunningRef.current = true
      isPausedRef.current = false

      activeStartListener.current = () =>
        document.removeEventListener(EVENTS.OUTLINE_TIMER_TIMED_UP, eventHandler)

      activeStartReject.current = rej
    })

  const pause = () => {
    dispatchCustomEvent('$outline-timer-toggle-pause', true)
    isPausedRef.current = true
  }

  const resume = () => {
    dispatchCustomEvent('$outline-timer-toggle-pause', false)
    isPausedRef.current = false
  }

  const reset = () => {
    dispatchCustomEvent('$outline-timer-set-value', 1)
    removeStartListener()
  }

  const complete = () => {
    dispatchCustomEvent('$outline-timer-set-value', 0)
    removeStartListener()
  }

  return {
    start,
    pause,
    resume,
    complete,
    reset,

    isRunning: isRunningRef.current,
    isPaused: isPausedRef.current
  }
}
