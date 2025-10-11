import { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { usePaintWorkspaceContext } from '@/context/PaintWorkspaceContext'
import { useFreshRefs } from '@/hooks/useFreshRefs'

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
  conicTimer?: {
    activeTimerTime?: number
    visible?: boolean
    inactiveValue?: number
  }
}

export const CanvasOutline = ({ children }: Props) => {
  const { outlineConfig } = usePaintWorkspaceContext()
  const backgroundSize = outlineConfig.visible ? BG_SIZES.SHOWN : BG_SIZES.HIDDEN

  const [percent, setPercent] = useState(1)
  const percentRef = useFreshRefs(percent)
  const animFrameRef = useRef<number | null>(null)

  const safeCancelAnimationFrame = () => {
    animFrameRef.current && cancelAnimationFrame(animFrameRef.current)
  }

  useEffect(() => {
    const waitTime = outlineConfig.conicTimer?.activeTimerTime
    if (!waitTime) {
      safeCancelAnimationFrame()
      return
    }

    setPercent(1)
    safeCancelAnimationFrame()

    let last = performance.now()

    const tick = (now: number) => {
      const delta = (now - last) / 1000
      last = now

      // Update percent based on elapsed time
      percentRef.current = Math.max(0, percentRef.current - delta / waitTime)
      setPercent(percentRef.current)

      if (percentRef.current > 0) {
        animFrameRef.current = requestAnimationFrame(tick)
      }
    }

    animFrameRef.current = requestAnimationFrame(tick)

    return safeCancelAnimationFrame
  }, [outlineConfig.conicTimer?.activeTimerTime])

  const correctForSquareMask = (p: number) => {
    const correctionAmplitude = 0.08
    const TWO_PI = Math.PI * 2
    const theta = p * TWO_PI
    const thetaC = theta + correctionAmplitude * Math.sin(4 * theta)
    return thetaC / TWO_PI
  }

  const displayedPercent = outlineConfig.conicTimer?.activeTimerTime
    ? correctForSquareMask(percent)
    : (outlineConfig.conicTimer?.inactiveValue ?? 0)

  const conicTimerVisibility = outlineConfig.conicTimer?.visible ? 'opacity-100' : 'opacity-0'

  return (
    <div
      className={twMerge(`
        relative size-[calc(var(--canvas-size)+(var(--canvas-outline-w)*2))]
        overflow-clip rounded-2xl flex justify-center items-center
        p-[calc(var(--canvas-outline-w)*0.43)] ${outlineConfig.className?.outer ?? ''}
      `)}
    >
      <div
        className={`
          absolute size-full top-0 left-0 bg-conic-30 blur-[0.5px] scale-200 -z-10
          ${outlineConfig.className?.conic ?? ''} ${conicTimerVisibility} transition-opacity duration-400
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
          animate-spin transition-all ${backgroundSize} ${outlineConfig.className?.gradient ?? ''}
        `)}
      />

      <div
        className={`
          size-full flex justify-center items-center 
          bg-theme-bg rounded-xl ${outlineConfig.className?.inner ?? ''}
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
