import { useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { usePaintWorkspaceContext } from '@/context/PaintWorkspaceContext'
import { useEvent } from '@/hooks/useEvent'
import { dispatchCustomEvent } from '@/utils/dispatchCustomEvent'

interface Props {
  children?: React.ReactNode
}

export interface CanvasOutlineConfig {
  visible?: boolean
  className?: {
    outer?: string
    gradient?: string
    conic?: string
    inner?: string
  }
}

export const CanvasOutline = ({ children }: Props) => {
  const { outlineConfig } = usePaintWorkspaceContext()
  const { className } = outlineConfig

  const backgroundSize = outlineConfig.visible ? BG_SIZES.SHOWN : BG_SIZES.HIDDEN
  const { displayedPercent } = useOutlineTimerLogic()

  return (
    <div
      className={twMerge(`
        relative size-[calc(var(--canvas-size)+(var(--canvas-outline-w)*2))]
        overflow-clip rounded-2xl flex justify-center items-center
        p-[calc(var(--canvas-outline-w)*0.43)] ${className?.outer ?? ''}
      `)}
    >
      <div
        className={`
          absolute size-full top-0 left-0 bg-conic-30 blur-[0.5px] scale-200 -z-10
          transition-opacity duration-400 ${className?.conic ?? ''}
        `}
        style={{
          background: `conic-gradient(
            transparent 0deg calc(${displayedPercent} * 360deg),
            color-mix(in srgb, var(--color-theme-bg) 82%, transparent) calc(${displayedPercent} * 360deg) 360deg
          )`
        }}
      />

      <div
        className={twMerge(`
          bg-gradient-to-r from-theme-10 to-theme-20 -z-20 pointer-events-none
          absolute rounded-full blur-sm  ease-in-out top-1/2 left-1/2 -translate-1/2 
          animate-spin transition-all ${backgroundSize} ${className?.gradient ?? ''}
        `)}
      />

      <div
        className={`
          size-full flex justify-center items-center 
          bg-theme-bg rounded-xl ${className?.inner ?? ''}
        `}
      >
        {children}
      </div>
    </div>
  )
}

const BG_SIZES = {
  HIDDEN: 'size-[70%] duration-1200',
  SHOWN: 'size-[150%] duration-2100'
}

const useOutlineTimerLogic = () => {
  const timerAnimFrameRef = useRef<number | null>(null)
  const isPausedRef = useRef(false)

  const safelyStopTimer = () => {
    timerAnimFrameRef.current && cancelAnimationFrame(timerAnimFrameRef.current)
  }

  const [percent, setPercent] = useState(1)

  useEvent('$outline-timer-start', (e: CustomEvent<number>) => {
    startTimer(e.detail)
  })

  useEvent('$outline-timer-set-value', (e: CustomEvent<number>) => {
    const value = e.detail
    setPercent(Math.min(1, Math.max(0, value)))

    safelyStopTimer()
  })

  useEvent('$outline-timer-toggle-pause', (e: CustomEvent<boolean>) => {
    isPausedRef.current = e.detail
  })

  const startTimer = (seconds: number) => {
    let currentPercent = 1
    setPercent(currentPercent)
    safelyStopTimer()
    isPausedRef.current = false

    requestAnimationFrame(() => {
      let last = performance.now()

      const tick = (now: number) => {
        const delta = (now - last) / 1000
        last = now

        if (!isPausedRef.current) {
          // Update percent based on elapsed time
          currentPercent = Math.max(0, currentPercent - delta / seconds)
          setPercent(currentPercent)
        }

        if (currentPercent > 0) {
          timerAnimFrameRef.current = requestAnimationFrame(tick)
          return
        }

        isPausedRef.current = false
        dispatchCustomEvent('$outline-timer-timed-up')
      }
      timerAnimFrameRef.current = requestAnimationFrame(tick)
    })
  }

  const correctForSquareMask = (p: number) => {
    const correctionAmplitude = 0.08
    const TWO_PI = Math.PI * 2
    const theta = p * TWO_PI
    const thetaC = theta + correctionAmplitude * Math.sin(4 * theta)
    return thetaC / TWO_PI
  }

  const displayedPercent = correctForSquareMask(percent)

  return { displayedPercent }
}
