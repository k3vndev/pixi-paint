import { useRef, useState } from 'react'
import { useEvent } from './useEvent'

interface Params {
  ref: React.RefObject<HTMLElement | null>
  rotationOffset?: number
}

export const usePerspectiveHover = ({ ref, rotationOffset = 16 }: Params) => {
  const DEFAULT_STYLE: React.CSSProperties = {
    transformStyle: 'preserve-3d',
    transition: 'all 100ms ease'
  } as const

  const UNSELECTED_STYLE: React.CSSProperties = {
    ...DEFAULT_STYLE,
    transition: 'all 900ms ease',
    transform: ''
  }

  const [style, setStyle] = useState<React.CSSProperties>(UNSELECTED_STYLE)
  const isActive = useRef(false)

  useEvent(
    'mouseenter',
    () => {
      isActive.current = true
    },
    { target: ref }
  )

  useEvent(
    'mousemove',
    (e: MouseEvent) => {
      if (!ref.current || !isActive.current) return

      const { left, top, height, width } = ref.current.getBoundingClientRect()

      const x = centeredNormalize(left, width, e.clientX)
      const y = centeredNormalize(top, height, e.clientY)

      setStyle({
        ...DEFAULT_STYLE,
        transform: `rotateY(${x * rotationOffset}deg) rotateX(${-y * rotationOffset}deg)`
      })
    },
    { target: ref }
  )

  useEvent(
    'mouseleave',
    () => {
      isActive.current = false
      setStyle(UNSELECTED_STYLE)
    },
    { target: ref }
  )

  const centeredNormalize = (min: number, range: number, value: number) => {
    if (!range) return 0

    const max = min + range
    return (value - min) / (max - min) - 0.5
  }

  return {
    parentStyle: { perspective: '1200px' } as React.CSSProperties,
    elementStyle: style
  }
}
