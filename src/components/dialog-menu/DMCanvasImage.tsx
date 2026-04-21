import type { ReusableComponent } from '@types'
import { useMemo, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { usePerspectiveHover } from '@/hooks/usePerspectiveHover'
import { getPixelsDataUrl } from '@/utils/getPixelsDataUrl'
import { CanvasImage } from '../images/CanvasImage'

type Props = {
  pixels?: string[]
  dataUrl?: string
} & ReusableComponent

export const DMCanvasImage = ({ pixels, dataUrl, className = '', ref, style }: Props) => {
  const canvasRef = useRef<HTMLElement>(null)

  const { elementStyle } = usePerspectiveHover({
    ref: ref ?? canvasRef,
    rotationOffset: 18
  })

  const extractedDataUrl = useMemo(
    () => dataUrl ?? (pixels ? getPixelsDataUrl(pixels) : null),
    [pixels, dataUrl]
  )

  return extractedDataUrl ? (
    <div
      ref={ref ?? canvasRef}
      className={twMerge(`
        md:size-40 md:min-w-40 size-32 min-w-32 aspect-square 
        perspective-distant transition-transform duration-300 hover:scale-110
        flex justify-center items-center
        ${className}
      `)}
    >
      <CanvasImage
        className={`
          rounded-xl border-4 border-theme-10/50 animate-pulse-brightness
          size-[95%] aspect-square shadow-card
        `}
        dataUrl={extractedDataUrl}
        style={{ ...elementStyle, ...style }}
      />
    </div>
  ) : null
}
